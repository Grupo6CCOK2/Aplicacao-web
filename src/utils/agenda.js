// Datas locais evitam que a conversão para UTC mude o dia exibido no calendário.
export function dataLocal(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function diaSeguinte(date) {
  const local = new Date(`${date}T12:00:00`);
  local.setDate(local.getDate() + 1);
  return dataLocal(local);
}

export function formatarData(date) {
  return date.split("-").reverse().join("/");
}

export function filtrarAgenda(rows, date, query = "") {
  const normalizar = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const busca = normalizar(query.trim());
  return rows.filter(
    (row) =>
      (!date || row.data === date) &&
      normalizar(
        `${row.cliente || row.nome || ""} ${row.profissional || ""}`,
      ).includes(busca),
  );
}

export function horarioDisponivel(
  data,
  horario,
  servico,
  agendamentos,
  agora = new Date(),
) {
  const inicio = new Date(`${data}T${horario}:00`);
  const minutos = Number.parseInt(servico.duracao, 10) || 60;
  const fim = new Date(inicio.getTime() + minutos * 60000);
  const hora = inicio.getHours() * 60 + inicio.getMinutes();
  const fimMinutos = hora + minutos;
  if (!Number.isFinite(inicio.getTime()) || inicio - agora < 2 * 3600000)
    return false;
  if ([0, 1].includes(inicio.getDay()) || hora < 9 * 60 || fimMinutos > 20 * 60)
    return false;
  if (hora < 13 * 60 && fimMinutos > 12 * 60) return false;
  return !agendamentos.some((item) => {
    if (
      ["Cancelado", "Concluído"].includes(item.status) ||
      item.profissional !== servico.profissional ||
      item.data !== formatarData(data)
    )
      return false;
    const outroInicio = new Date(`${data}T${item.horario}:00`);
    const outroFim = new Date(
      outroInicio.getTime() + (Number.parseInt(item.duracao, 10) || 60) * 60000,
    );
    return inicio < outroFim && fim > outroInicio;
  });
}
