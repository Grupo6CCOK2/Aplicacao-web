import { useRef, useState } from 'react';
import AgendaDialog from './AgendaDialog';
import { dataLocal, formatarData, horarioFinal, reservasAfetadas, validarBloqueio } from '../utils/agenda';
import { useAgora } from '../hooks/useAgora';

export default function AgendaBlockManager({ agenda, bloqueios, aoAplicar, aoRemover }) {
  const [data, setData] = useState(dataLocal);
  const [tipo, setTipo] = useState('dia');
  const [inicio, setInicio] = useState('09:00');
  const [fim, setFim] = useState('12:00');
  const [motivo, setMotivo] = useState('');
  const [revisao, setRevisao] = useState(null);
  const [removendo, setRemovendo] = useState(null);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const aplicando = useRef(false);
  const agora = useAgora();
  const afetados = revisao ? reservasAfetadas(agenda, revisao, agora) : [];
  const revisar = (e) => {
    e.preventDefault();
    const novo = { data, tipo, inicio: tipo === 'dia' ? '00:00' : inicio, fim: tipo === 'dia' ? '23:59' : fim, motivo: motivo.trim() };
    const problema = validarBloqueio(novo);
    if (problema) return setErro(problema);
    aplicando.current = false;
    setErro(''); setAviso(''); setRevisao(novo);
  };
  const confirmar = () => {
    if (aplicando.current) return;
    aplicando.current = true;
    const resultado = aoAplicar({ ...revisao, id: crypto.randomUUID() });
    if (!resultado.ok) { aplicando.current = false; setErro(resultado.erro); setRevisao(null); return; }
    setRevisao(null); setMotivo(''); setAviso(`Período bloqueado para o salão inteiro. ${resultado.quantidade} agendamento(s) cancelado(s).`);
  };
  return <section className="agenda-block-manager">
    <h2>Cancelar dia ou faixa de horário</h2><p>Bloqueie o salão inteiro e cancele as reservas futuras que cruzarem esse período. Atendimentos iniciados ou concluídos serão preservados.</p>
    <form onSubmit={revisar}>
      <div className="agenda-block-fields"><div><label htmlFor="block-date">Data *</label><input id="block-date" type="date" min={dataLocal(agora)} required value={data} onChange={(e) => setData(e.target.value)} /></div><div><label htmlFor="block-type">Período</label><select id="block-type" value={tipo} onChange={(e) => setTipo(e.target.value)}><option value="dia">Dia inteiro</option><option value="faixa">Faixa de horário</option></select></div>
        {tipo === 'faixa' && <><div><label htmlFor="block-start">Das *</label><input id="block-start" type="time" required value={inicio} onChange={(e) => setInicio(e.target.value)} /></div><div><label htmlFor="block-end">Até *</label><input id="block-end" type="time" required value={fim} onChange={(e) => setFim(e.target.value)} /></div></>}
      </div><label htmlFor="block-reason">Motivo do cancelamento / bloqueio *</label><input id="block-reason" required maxLength={500} placeholder="Ex.: manutenção do salão" value={motivo} onChange={(e) => setMotivo(e.target.value)} /><button type="submit" className="btn-burgundy">Revisar cancelamentos →</button>
    </form>{erro && <p className="agenda-error" role="alert">{erro}</p>}{aviso && <p className="agenda-notice" role="status">{aviso}</p>}
    {!!bloqueios.length && <div className="agenda-block-list"><h3>Períodos bloqueados</h3>{bloqueios.map((item) => <div key={item.id}><div><strong>{formatarData(item.data)} · {item.tipo === 'dia' ? 'Dia inteiro' : `${item.inicio} às ${item.fim}`}</strong><p>{item.motivo}</p></div><button type="button" onClick={() => setRemovendo(item)}>Desbloquear</button></div>)}</div>}
    {revisao && <AgendaDialog titulo="Confirmar bloqueio da agenda" aoFechar={() => setRevisao(null)}><div className="agenda-review"><strong>{formatarData(revisao.data)} · {revisao.tipo === 'dia' ? 'Dia inteiro' : `${revisao.inicio} às ${revisao.fim}`}</strong><p>Salão inteiro · {revisao.motivo}</p></div><p><strong>{afetados.length}</strong> agendamento(s) serão cancelados. Novas reservas também serão impedidas nesse período.</p><ul className="agenda-affected-list">{afetados.map((item) => <li key={item.id}><strong>{item.cliente || 'Cliente'}</strong> · {item.servico}<br />{item.profissional} · {item.horario || item.hora} às {horarioFinal(item.horario || item.hora, item.duracao)}</li>)}</ul><div className="agenda-dialog-actions"><button type="button" autoFocus onClick={() => setRevisao(null)}>Voltar sem alterar</button><button type="button" className="btn-burgundy" onClick={confirmar}>Confirmar bloqueio e cancelamentos</button></div></AgendaDialog>}
    {removendo && <AgendaDialog titulo="Desbloquear período?" aoFechar={() => setRemovendo(null)}><p>Novas reservas voltarão a ser permitidas em {formatarData(removendo.data)}. Os agendamentos cancelados não serão restaurados.</p><div className="agenda-dialog-actions"><button type="button" autoFocus onClick={() => setRemovendo(null)}>Manter bloqueio</button><button type="button" className="btn-burgundy" onClick={() => { aoRemover(removendo.id); setRemovendo(null); setAviso('Bloqueio removido. Agendamentos cancelados não foram restaurados.'); }}>Desbloquear</button></div></AgendaDialog>}
  </section>;
}
