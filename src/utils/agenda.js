const normalizar = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export function dataLocal(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function paraISO(data = '') { return data.includes('/') ? data.split('/').reverse().join('-') : data; }
export function diaSeguinte(date) { const local = new Date(`${date}T12:00:00`); local.setDate(local.getDate() + 1); return dataLocal(local); }
export function formatarData(date) { return paraISO(date).split('-').reverse().join('/'); }
export function duracaoEmMinutos(value = 60) {
  if (typeof value === 'number') return value > 0 ? value : 60;
  const horas = String(value).match(/(\d+)\s*h/i);
  const minutos = String(value).match(/(\d+)\s*min/i);
  if (horas || minutos) return Number(horas?.[1] || 0) * 60 + Number(minutos?.[1] || 0) || 60;
  return Number.parseInt(value, 10) > 0 ? Number.parseInt(value, 10) : 60;
}
export function minutosDoHorario(horario) { const [hora, minutos] = String(horario).split(':').map(Number); return hora * 60 + minutos; }
export function horarioFinal(horario, duracao) { const fim = minutosDoHorario(horario) + duracaoEmMinutos(duracao); return `${String(Math.floor(fim / 60)).padStart(2, '0')}:${String(fim % 60).padStart(2, '0')}`; }
export function gerarHorarios(inicio = 540, fim = 1200, passo = 15) {
  if (passo <= 0 || fim <= inicio) return [];
  return Array.from({ length: Math.ceil((fim - inicio) / passo) }, (_, i) => { const minutos = inicio + i * passo; return `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`; });
}
export function inicioAgendamento(item) { return new Date(`${paraISO(item.data)}T${item.horario || item.hora}:00`); }
export function statusAtivo(item) { return ['confirmado', 'aguardando', 'pendente'].includes(normalizar(item.status)); }
export function podeCancelar(item, agora = new Date()) { return statusAtivo(item) && inicioAgendamento(item) > agora; }
export function exigeMotivo(item, agora = new Date()) { const falta = inicioAgendamento(item) - agora; return falta > 0 && falta <= 7200000; }
export function validarCancelamento(item, motivo, agora = new Date()) {
  if (!item || !podeCancelar(item, agora)) return 'Este atendimento não pode mais ser cancelado.';
  if (exigeMotivo(item, agora) && !String(motivo || '').trim()) return 'Informe o motivo: faltam 2 horas ou menos para o atendimento.';
  return '';
}
export function filtrarAgenda(rows, date, query = '') {
  const busca = normalizar(query);
  return rows.filter((row) => (!date || paraISO(row.data) === date) && normalizar(`${row.cliente || row.nome || ''} ${row.profissional || ''}`).includes(busca));
}
export function cruzaBloqueio(item, bloqueio) {
  if (paraISO(item.data) !== bloqueio.data) return false;
  const inicio = minutosDoHorario(item.horario || item.hora);
  return inicio < minutosDoHorario(bloqueio.fim) && inicio + duracaoEmMinutos(item.duracao) > minutosDoHorario(bloqueio.inicio);
}
export function validarBloqueio(bloqueio, agora = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(bloqueio.data || '') || dataLocal(new Date(`${bloqueio.data}T12:00:00`)) !== bloqueio.data) return 'Escolha uma data válida.';
  if (bloqueio.data < dataLocal(agora)) return 'Não é possível bloquear uma data passada.';
  if (![bloqueio.inicio, bloqueio.fim].every((hora) => /^([01]\d|2[0-3]):[0-5]\d$/.test(hora))) return 'Informe os horários do bloqueio.';
  if (minutosDoHorario(bloqueio.fim) <= minutosDoHorario(bloqueio.inicio)) return 'O horário final precisa ser posterior ao inicial.';
  if (new Date(`${bloqueio.data}T${bloqueio.fim}:00`) <= agora) return 'Esse período já terminou.';
  if (!bloqueio.motivo?.trim()) return 'Informe o motivo do bloqueio.';
  return '';
}
export function reservasAfetadas(agenda, bloqueio, agora = new Date()) { return agenda.filter((item) => podeCancelar(item, agora) && cruzaBloqueio(item, bloqueio)); }
export function aplicarBloqueio(agenda, bloqueio, agora = new Date()) {
  const erro = validarBloqueio(bloqueio, agora);
  if (erro) return { ok: false, erro };
  const ids = new Set(reservasAfetadas(agenda, bloqueio, agora).map((item) => item.id));
  return { ok: true, quantidade: ids.size, agendamentos: agenda.map((item) => ids.has(item.id) ? { ...item, status: 'Cancelado', motivoCancelamento: bloqueio.motivo.trim(), canceladoPor: 'admin', canceladoEm: agora.toISOString(), bloqueioId: bloqueio.id } : item) };
}
export function fidelidadeCortes(agenda, agora = new Date()) {
  const ids = new Set();
  const cortes = agenda.filter((item) => {
    const corte = /\bcorte(s)?\b/.test(normalizar(item.servico));
    const fim = new Date(inicioAgendamento(item).getTime() + duracaoEmMinutos(item.duracao) * 60000);
    if (normalizar(item.status) !== 'concluido' || !corte || fim > agora || !Number.isFinite(fim.getTime()) || ids.has(item.id)) return false;
    ids.add(item.id); return true;
  }).length;
  return { cortes, brindeLiberado: cortes >= 10, faltam: Math.max(0, 10 - cortes), progresso: Math.min(10, cortes) };
}
export function horarioDisponivel(data, horario, servico, agendamentos, agora = new Date(), bloqueios = []) {
  const inicio = new Date(`${data}T${horario}:00`);
  const hora = minutosDoHorario(horario);
  const fim = hora + duracaoEmMinutos(servico.duracao);
  if (!Number.isFinite(inicio.getTime()) || inicio - agora < 7200000) return false;
  if ([0, 1].includes(inicio.getDay()) || hora < 540 || fim > 1200) return false;
  if (hora < 780 && fim > 720) return false;
  if (bloqueios.some((b) => cruzaBloqueio({ data, horario, duracao: servico.duracao }, b))) return false;
  const profissional = (nome) => normalizar(nome) === 'fred santos' ? 'fred' : normalizar(nome);
  return !agendamentos.some((item) => {
    if (normalizar(item.status) === 'cancelado' || profissional(item.profissional) !== profissional(servico.profissional) || paraISO(item.data) !== data) return false;
    const outroInicio = minutosDoHorario(item.horario || item.hora);
    return hora < outroInicio + duracaoEmMinutos(item.duracao) && fim > outroInicio;
  });
}
