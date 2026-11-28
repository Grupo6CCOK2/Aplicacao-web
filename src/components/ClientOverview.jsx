import LoyaltyCard from './LoyaltyCard';
import { inicioAgendamento, horarioFinal, statusAtivo, formatarData } from '../utils/agenda';
import { contato } from '../data/contato';

export default function ClientOverview({ nome, agendamentos, agora, aoAgendar, aoVerAgendamentos }) {
  const proximo = agendamentos.filter(item => statusAtivo(item) && inicioAgendamento(item) > agora).sort((a, b) => inicioAgendamento(a) - inicioAgendamento(b))[0];
  const data = proximo && inicioAgendamento(proximo);
  return <section className="client-overview">
    <div className="client-welcome"><div><span>SEU ESPAÇO NO FRED</span><h1>Bem-vindo, <strong>{nome}!</strong></h1><p>Cuide do seu visual com quem entende.</p></div></div>
    <div className="client-home-main"><LoyaltyCard agendamentos={agendamentos} agora={agora} /><article className="client-schedule-card"><span className="client-home-icon" aria-hidden="true">▦</span><h2>Seu próximo cuidado começa aqui</h2><p>Escolha o melhor horário para você.</p><button className="btn-burgundy" onClick={aoAgendar}>Agendar atendimento</button></article></div>
    <div className="client-home-bottom"><article className="client-next-card"><h2>Seu próximo agendamento</h2>{proximo ? <div className="client-next-booking"><div className="client-next-date"><strong>{data.getDate()}</strong><span>{data.toLocaleDateString('pt-BR', { month: 'short' })}</span></div><div><h3>{proximo.servico}</h3><p>{formatarData(proximo.data)} · {proximo.horario} às {horarioFinal(proximo.horario, proximo.duracao)}</p><p>Com {proximo.profissional}</p></div><button onClick={aoVerAgendamentos}>Ver detalhes</button></div> : <div className="client-next-empty"><p>Você ainda não tem um próximo atendimento.</p><button onClick={aoAgendar}>Escolher um horário</button></div>}</article>
    <article className="client-benefits"><h2>Seus benefícios</h2><ul><li>Um brinde para retirar após 10 cortes concluídos</li><li>Horário reservado para você</li><li>Atendimento com profissionais especializados</li></ul><a href={contato.avaliacaoUrl} target="_blank" rel="noreferrer">Gostou do atendimento? Avalie no Google</a></article></div>
  </section>;
}
