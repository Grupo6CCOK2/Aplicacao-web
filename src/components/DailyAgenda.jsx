import { useState } from 'react';
import { agendaProfissional, dataLocal, diaSeguinte, filtrarAgenda, formatarData, horarioFinal } from '../utils/agenda';
import './DailyAgenda.css';

export default function DailyAgenda({ agendamentos, setAgendamentos, profissional, titulo = 'Agenda diária' }) {
  const [data, setData] = useState(dataLocal);
  const [selecionado, setSelecionado] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [erro, setErro] = useState('');
  const agenda = filtrarAgenda(agendaProfissional(agendamentos, profissional), data).sort((a, b) => (a.hora || a.horario).localeCompare(b.hora || b.horario));
  const detalhes = agenda.find(item => item.id === selecionado);
  const mudarData = valor => { if (valor) { setData(valor); setSelecionado(null); setMotivo(''); setErro(''); } };
  const cancelar = e => {
    e.preventDefault();
    if (!motivo.trim()) { setErro('Informe o motivo do cancelamento.'); return; }
    setAgendamentos(atuais => atuais.map(item => item.id === detalhes.id && !['Concluído', 'Cancelado'].includes(item.status) ? { ...item, status: 'Cancelado', motivoCancelamento: motivo.trim(), canceladoPor: 'admin', canceladoEm: new Date().toISOString() } : item));
    setMotivo(''); setErro('');
  };
  return <section className="daily-agenda">
    <header className="daily-header"><div><span className="daily-eyebrow">{profissional}</span><h1>{titulo}</h1><p>Selecione um atendimento para ver os detalhes.</p></div><div className="daily-date-controls"><button onClick={() => mudarData(dataLocal())}>Hoje</button><label><span className="daily-sr-only">Dia da agenda</span><input aria-label="Dia da agenda" type="date" value={data} onInput={e => mudarData(e.target.value)} onChange={e => mudarData(e.target.value)} /></label><button onClick={() => mudarData(diaSeguinte(data))}>Próximo dia</button></div></header>
    <div className={`daily-workspace ${detalhes ? 'daily-workspace-selected' : ''}`}>
      <div className="daily-list-panel"><div className="daily-list-heading"><h2>{formatarData(data)}</h2><span>{agenda.length} {agenda.length === 1 ? 'atendimento' : 'atendimentos'}</span></div>
        <div className="daily-list">{agenda.length ? agenda.map(item => <button key={item.id} aria-pressed={selecionado === item.id} className={`daily-appointment ${selecionado === item.id ? 'daily-appointment-selected' : ''}`} onClick={() => { setSelecionado(item.id); setMotivo(''); setErro(''); }}>
          <div className="daily-time"><strong>{item.hora || item.horario}</strong><span>até {horarioFinal(item.hora || item.horario, item.duracao)}</span></div>
          <div className="daily-client"><strong>{item.cliente || item.nome}</strong><span>{item.servico}</span></div>
          <span className={`daily-status daily-status-${item.status === 'Cancelado' ? 'cancelled' : item.status === 'Concluído' ? 'done' : 'active'}`}>{item.status}</span>
          <span className="daily-open">Ver detalhes</span>
        </button>) : <div className="daily-empty"><h3>Seu dia está livre</h3><p>Nenhum atendimento agendado para esta data.</p></div>}</div>
        <p className="daily-hours">Atendimento: terça a sábado, das 9h às 20h · Intervalo das 12h às 13h</p>
      </div>
      {detalhes && <aside className="daily-details" aria-label="Detalhes do atendimento"><header><h2>Detalhes do atendimento</h2><button aria-label="Fechar detalhes" onClick={() => setSelecionado(null)}>×</button></header><span className="daily-avatar" aria-hidden="true">{(detalhes.cliente || detalhes.nome || 'C').split(' ').map(nome => nome[0]).slice(0, 2).join('')}</span><h3>{detalhes.cliente || detalhes.nome}</h3><p>{detalhes.telefone || 'Telefone não informado'}</p><dl><div><dt>Serviço</dt><dd>{detalhes.servico}</dd></div><div><dt>Data e horário</dt><dd>{formatarData(detalhes.data)} · {detalhes.hora || detalhes.horario} às {horarioFinal(detalhes.hora || detalhes.horario, detalhes.duracao)}</dd></div><div><dt>Valor</dt><dd>{detalhes.valor}</dd></div><div><dt>Status</dt><dd>{detalhes.status}</dd></div><div><dt>Observação</dt><dd>{detalhes.observacao || 'Nenhuma observação.'}</dd></div></dl>
        {detalhes.motivoCancelamento && <p className="daily-cancel-note">Motivo: {detalhes.motivoCancelamento}</p>}
        {!['Concluído', 'Cancelado'].includes(detalhes.status) && <form onSubmit={cancelar}><label htmlFor="daily-cancel-reason">Motivo do cancelamento *</label><textarea id="daily-cancel-reason" required value={motivo} onChange={e => setMotivo(e.target.value)} />{erro && <p role="alert" className="agenda-error">{erro}</p>}<button className="daily-cancel-button" type="submit">Cancelar atendimento</button></form>}
      </aside>}
    </div>
  </section>;
}

