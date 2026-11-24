import test from "node:test";
import assert from "node:assert/strict";
import {
  dataLocal,
  diaSeguinte,
  filtrarAgenda,
  formatarData,
  horarioDisponivel,
  aplicarBloqueio,
  cruzaBloqueio,
  duracaoEmMinutos,
  exigeMotivo,
  fidelidadeCortes,
  gerarHorarios,
  horarioFinal,
  podeCancelar,
  reservasAfetadas,
  validarBloqueio,
  validarCancelamento,
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

// Casos de negócio: cancelamento, duração, bloqueios e fidelidade.
test('cancelamento exige motivo exatamente às duas horas e abaixo, não acima', () => {
  assert.equal(exigeMotivo(reserva, new Date('2026-11-18T07:59:59')), false);
  assert.equal(exigeMotivo(reserva, new Date('2026-11-18T08:00:00')), true);
  assert.equal(exigeMotivo(reserva, new Date('2026-11-18T09:30:00')), true);
  assert.notEqual(validarCancelamento(reserva, '   ', agora), '');
  assert.equal(validarCancelamento(reserva, 'Imprevisto', agora), '');
  assert.equal(validarCancelamento(reserva, '', new Date('2026-11-18T07:00:00')), '');
});

test('regressão: reserva para 15:45 no mesmo dia exige motivo ao cancelar às 13:46', () => {
  const item = { ...reserva, data: '24/11/2026', horario: '15:45' };
  const tentativa = new Date('2026-11-24T13:46:00');
  assert.equal(podeCancelar(item, tentativa), true);
  assert.equal(exigeMotivo(item, tentativa), true);
  assert.notEqual(validarCancelamento(item, '', tentativa), '');
  assert.notEqual(validarCancelamento(item, '   ', tentativa), '');
  assert.equal(validarCancelamento(item, 'Imprevisto', tentativa), '');
});

test('não se cancela uma reserva iniciada, concluída ou já cancelada', () => {
  assert.equal(podeCancelar(reserva, new Date('2026-11-18T10:00:00')), false);
  assert.equal(podeCancelar({ ...reserva, status: 'Concluído' }, agora), false);
  assert.equal(podeCancelar({ ...reserva, status: 'Cancelado' }, agora), false);
  assert.notEqual(validarCancelamento(null, 'Motivo', agora), '');
});

test('grade de 15 minutos inclui 13h e respeita a duração de serviços longos', () => {
  const horarios = gerarHorarios();
  assert.equal(horarios.length, 44);
  assert.equal(horarios[1], '09:15');
  assert.equal(horarios.at(-1), '19:45');
  assert.ok(horarios.includes('13:00'));
  assert.equal(horarioFinal('13:00', '150 min'), '15:30');
  assert.equal(duracaoEmMinutos('2h 30 min'), 150);
  assert.equal(horarioDisponivel('2026-11-18', '17:30', { ...servico, duracao: '150 min' }, [], agora), true);
  assert.equal(horarioDisponivel('2026-11-18', '17:45', { ...servico, duracao: '150 min' }, [], agora), false);
});

const diaBloqueado = { id: 'bloqueio-1', data: '2026-11-18', inicio: '00:00', fim: '23:59', tipo: 'dia', motivo: 'Manutenção' };
const faixaBloqueada = { ...diaBloqueado, inicio: '11:00', fim: '13:00', tipo: 'faixa' };

test('bloqueio detecta serviço longo que começa antes e cruza o período', () => {
  assert.equal(cruzaBloqueio(reserva, faixaBloqueada), true);
  assert.equal(cruzaBloqueio({ ...reserva, duracao: '60 min' }, faixaBloqueada), false);
  assert.equal(cruzaBloqueio({ ...reserva, horario: '13:00' }, faixaBloqueada), false);
  assert.equal(cruzaBloqueio({ ...reserva, data: '19/11/2026' }, faixaBloqueada), false);
});

test('bloqueio do salão afeta todos os profissionais e registra motivo e origem', () => {
  const agenda = [{ ...reserva, id: 1 }, { ...reserva, id: 2, profissional: 'Carla' }];
  const resultado = aplicarBloqueio(agenda, diaBloqueado, agora);
  assert.equal(resultado.ok, true);
  assert.equal(resultado.quantidade, 2);
  assert.ok(resultado.agendamentos.every((item) => item.status === 'Cancelado' && item.motivoCancelamento === 'Manutenção' && item.canceladoPor === 'admin'));
  assert.equal(agenda[0].status, 'Confirmado');
});

test('bloqueios preservam passado, atendimentos em curso e concluídos', () => {
  const agenda = [
    { ...reserva, id: 1, horario: '07:00' },
    { ...reserva, id: 2, status: 'Em atendimento' },
    { ...reserva, id: 3, status: 'Concluído' },
    { ...reserva, id: 4, status: 'Cancelado' },
    { ...reserva, id: 5 },
  ];
  assert.deepEqual(reservasAfetadas(agenda, diaBloqueado, agora).map((item) => item.id), [5]);
  const resultado = aplicarBloqueio(agenda, faixaBloqueada, agora);
  assert.equal(resultado.quantidade, 1);
  assert.equal(resultado.agendamentos[1].status, 'Em atendimento');
});

test('horários ficam indisponíveis para todos no bloqueio e liberam fora dele', () => {
  assert.equal(horarioDisponivel('2026-11-18', '14:00', servico, [], agora, [diaBloqueado]), false);
  assert.equal(horarioDisponivel('2026-11-18', '14:00', { ...servico, profissional: 'Carla' }, [], agora, [diaBloqueado]), false);
  assert.equal(horarioDisponivel('2026-11-18', '10:00', { ...servico, duracao: '120 min' }, [], agora, [faixaBloqueada]), false);
  assert.equal(horarioDisponivel('2026-11-18', '14:00', servico, [], agora, [faixaBloqueada]), true);
});

test('bloqueios rejeitam datas passadas, horários inválidos, faixa invertida e motivo vazio', () => {
  assert.equal(validarBloqueio(diaBloqueado, agora), '');
  for (const alteracoes of [{ data: '2026-11-17' }, { data: '2026-02-31' }, { inicio: '14:00', fim: '13:00' }, { inicio: '25:00' }, { motivo: '   ' }]) {
    assert.notEqual(validarBloqueio({ ...diaBloqueado, ...alteracoes }, agora), '');
  }
  assert.equal(aplicarBloqueio([reserva], { ...diaBloqueado, motivo: '' }, agora).ok, false);
});

const cortes = Array.from({ length: 10 }, (_, i) => ({ id: `corte-${i}`, data: `${String(i + 1).padStart(2, '0')}/11/2026`, horario: '09:00', duracao: '45 min', servico: 'Corte Masculino', status: 'Concluído' }));
test('brinde só libera ao completar dez cortes concluídos', () => {
  assert.deepEqual(fidelidadeCortes(cortes.slice(0, 9), agora), { cortes: 9, brindeLiberado: false, faltam: 1, progresso: 9 });
  assert.equal(fidelidadeCortes(cortes, agora).brindeLiberado, true);
});

test('reservas, cancelamentos, outros serviços e conclusões futuras não contam para o brinde', () => {
  const invalidos = [
    { ...cortes[0], id: 'confirmado', status: 'Confirmado' },
    { ...cortes[0], id: 'cancelado', status: 'Cancelado' },
    { ...cortes[0], id: 'cor', servico: 'Coloração Premium' },
    { ...cortes[0], id: 'futuro', data: '25/11/2026' },
    { ...cortes[0], id: 'barba', servico: 'Barba e Acabamento' },
  ];
  assert.equal(fidelidadeCortes(invalidos, agora).cortes, 0);
  assert.equal(fidelidadeCortes([...cortes, cortes[0]], agora).cortes, 10);
  assert.equal(fidelidadeCortes([{ ...cortes[0], servico: 'Combo Corte + Barba' }], agora).cortes, 1);
});
