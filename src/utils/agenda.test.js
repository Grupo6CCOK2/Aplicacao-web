import test from "node:test";
import assert from "node:assert/strict";
import {
  dataLocal,
  diaSeguinte,
  filtrarAgenda,
  formatarData,
  horarioDisponivel,
} from "./agenda.js";

const servico = { profissional: "Fred", duracao: "60 min" };
const agora = new Date("2026-11-18T08:00:00");
const reserva = {
  profissional: "Fred",
  data: "18/11/2026",
  horario: "10:00",
  duracao: "75 min",
  status: "Confirmado",
};

test("datas locais e virada de mês/ano preservam o dia", () => {
  assert.equal(dataLocal(new Date(2026, 10, 18, 23, 59)), "2026-11-18");
  assert.equal(diaSeguinte("2026-11-30"), "2026-12-01");
  assert.equal(diaSeguinte("2026-12-31"), "2027-01-01");
  assert.equal(formatarData("2026-11-18"), "18/11/2026");
});

test("filtros combinam data, cliente e profissional sem depender de acentos", () => {
  const rows = [
    { data: "2026-11-18", cliente: "Júlia", profissional: "Fred" },
    { data: "2026-11-19", cliente: "Ana", profissional: "Patrícia" },
  ];
  assert.deepEqual(filtrarAgenda(rows, "2026-11-18", "julia"), [rows[0]]);
  assert.deepEqual(filtrarAgenda(rows, "", " PATRICIA "), [rows[1]]);
  assert.deepEqual(filtrarAgenda(rows, "2026-11-18", "Ana"), []);
  assert.deepEqual(filtrarAgenda(rows, "", ""), rows);
});

test("antecedência mínima e intervalo de almoço são respeitados", () => {
  assert.equal(
    horarioDisponivel("2026-11-18", "09:00", servico, [], agora),
    false,
  );
  assert.equal(
    horarioDisponivel("2026-11-18", "10:00", servico, [], agora),
    true,
  );
  assert.equal(
    horarioDisponivel("2026-11-18", "12:00", servico, [], agora),
    false,
  );
  assert.equal(
    horarioDisponivel(
      "2026-11-18",
      "11:00",
      { ...servico, duracao: "120 min" },
      [],
      agora,
    ),
    false,
  );
});

test("serviços não podem terminar depois do expediente nem cair em dias fechados", () => {
  assert.equal(
    horarioDisponivel(
      "2026-11-18",
      "18:30",
      { ...servico, duracao: "120 min" },
      [],
      agora,
    ),
    false,
  );
  assert.equal(
    horarioDisponivel("2026-11-22", "14:00", servico, [], agora),
    false,
  );
  assert.equal(
    horarioDisponivel("2026-11-23", "14:00", servico, [], agora),
    false,
  );
});

test("conflitos consideram a duração e apenas o profissional envolvido", () => {
  assert.equal(
    horarioDisponivel("2026-11-18", "10:00", servico, [reserva], agora),
    false,
  );
  assert.equal(
    horarioDisponivel("2026-11-18", "11:00", servico, [reserva], agora),
    false,
  );
  assert.equal(
    horarioDisponivel(
      "2026-11-18",
      "10:00",
      { ...servico, profissional: "Carla" },
      [reserva],
      agora,
    ),
    true,
  );
  assert.equal(
    horarioDisponivel(
      "2026-11-18",
      "10:00",
      servico,
      [{ ...reserva, status: "Cancelado" }],
      agora,
    ),
    true,
  );
  assert.equal(
    horarioDisponivel("2026-11-18", "14:00", servico, [reserva], agora),
    true,
  );
});
