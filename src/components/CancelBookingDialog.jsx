import { useRef, useState } from 'react';
import AgendaDialog from './AgendaDialog';
import { exigeMotivo, horarioFinal, inicioAgendamento, podeCancelar, validarCancelamento } from '../utils/agenda';
import { useAgora } from '../hooks/useAgora';

export default function CancelBookingDialog({ agendamento, aoFechar, aoConfirmar }) {
  const [etapa, setEtapa] = useState(1);
  const [motivo, setMotivo] = useState('');
  const [erro, setErro] = useState('');
  const enviando = useRef(false);
  const agora = useAgora(1000);
  const obrigatorio = exigeMotivo(agendamento, agora);
  const permitido = podeCancelar(agendamento, agora);
  const motivoValido = !obrigatorio || motivo.trim().length > 0;
  const minutos = Math.max(0, Math.ceil((inicioAgendamento(agendamento) - agora) / 60000));
  const tempo = `${Math.floor(minutos / 60)}h ${String(minutos % 60).padStart(2, '0')}min`;

  const avancarOuConfirmar = (e) => {
    e.preventDefault();
    if (enviando.current) return;
    // Recalcula na hora do clique: não depende só do atributo required nem do relógio da tela.
    const problema = validarCancelamento(agendamento, motivo, new Date());
    if (problema) { setErro(problema); return; }
    if (etapa === 1) { setErro(''); setEtapa(2); return; }
    enviando.current = true;
    const resultado = aoConfirmar(agendamento.id, motivo.trim());
    if (!resultado.ok) { enviando.current = false; setErro(resultado.erro); return; }
    aoFechar();
  };

  return (
    <AgendaDialog titulo={etapa === 1 ? 'Cancelar este agendamento?' : 'Confirmar cancelamento'} aoFechar={aoFechar}>
      <p className="agenda-step">Etapa {etapa} de 2</p>
      <div className="agenda-review">
        <strong>{agendamento.servico}</strong>
        <p>{agendamento.profissional}</p>
        <p>{agendamento.data} · {agendamento.horario} às {horarioFinal(agendamento.horario, agendamento.duracao)}</p>
        <p>{permitido ? `Faltam ${tempo} para o atendimento.` : 'Este atendimento não pode mais ser cancelado.'}</p>
      </div>
      <form noValidate onSubmit={avancarOuConfirmar}>
        <p>{obrigatorio
          ? 'Faltam 2 horas ou menos. Preencha o motivo para continuar com o cancelamento.'
          : etapa === 1 ? 'Você deseja liberar este horário? O motivo é opcional com mais de 2 horas de antecedência.' : 'Confira os dados e confirme o cancelamento.'}</p>
        <label htmlFor="cancel-booking-reason">Motivo {obrigatorio ? '(obrigatório)' : '(opcional)'}</label>
        <textarea id="cancel-booking-reason" required={obrigatorio} aria-required={obrigatorio} aria-describedby="cancel-booking-rule" maxLength={500} value={motivo} onChange={(e) => { setMotivo(e.target.value); setErro(''); }} />
        <p id="cancel-booking-rule" className="agenda-status-note">Com 2 horas ou menos de antecedência, não é possível cancelar sem informar um motivo.</p>
        {erro && <p className="agenda-error" role="alert">{erro}</p>}
        <div className="agenda-dialog-actions">
          <button type="button" autoFocus onClick={etapa === 1 ? aoFechar : () => setEtapa(1)}>{etapa === 1 ? 'Manter agendamento' : 'Voltar'}</button>
          <button className="btn-burgundy" type="submit" disabled={!permitido || !motivoValido}>{etapa === 1 ? 'Continuar cancelamento' : 'Confirmar cancelamento'}</button>
        </div>
      </form>
    </AgendaDialog>
  );
}
