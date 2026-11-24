import { useEffect, useId, useRef } from 'react';
import './AgendaRules.css';
export default function AgendaDialog({ titulo, children, aoFechar }) {
  const ref = useRef(null);
  const id = useId();
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog className="agenda-dialog" ref={ref} aria-labelledby={id} onCancel={(e) => { e.preventDefault(); aoFechar(); }}><header><h2 id={id}>{titulo}</h2><button type="button" aria-label="Fechar" onClick={aoFechar}>×</button></header>{children}</dialog>;
}
