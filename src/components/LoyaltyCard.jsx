import { fidelidadeCortes } from '../utils/agenda';
import './AgendaRules.css';
export default function LoyaltyCard({ agendamentos, agora }) {
  const fidelidade = fidelidadeCortes(agendamentos, agora);
  return <section className="agenda-loyalty" aria-label="Fidelidade após 10 cortes"><div><span>PROGRAMA DE FIDELIDADE</span><h2>{fidelidade.brindeLiberado ? 'Seu brinde está liberado!' : 'A cada 10 cortes, um brinde para você'}</h2><p>{fidelidade.brindeLiberado ? 'Você completou 10 cortes. Retire seu brinde com a equipe no salão.' : `Faltam ${fidelidade.faltam} cortes concluídos para liberar seu brinde.`}</p><small>Reservas e cancelamentos não contam. O brinde não altera o valor do serviço.</small></div><div className="agenda-loyalty-progress"><strong>{fidelidade.progresso}/10</strong><progress value={fidelidade.progresso} max="10" aria-label={`${fidelidade.progresso} de 10 cortes concluídos`} /><div className="loyalty-stamps" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <span key={i} className={i < fidelidade.progresso ? 'loyalty-stamp-complete' : ''}>{i < fidelidade.progresso ? '✓' : i + 1}</span>)}</div></div></section>;
}
