import { useEffect, useRef } from "react";

export default function RemoveEmployeeDialog({
  funcionario,
  aoCancelar,
  aoConfirmar,
}) {
  const dialog = useRef(null);
  useEffect(() => {
    dialog.current.showModal();
  }, []);
  return (
    <dialog
      className="employee-remove-dialog"
      ref={dialog}
      aria-labelledby="employee-remove-title"
      onCancel={(e) => {
        e.preventDefault();
        aoCancelar();
      }}
    >
      <h2 id="employee-remove-title">Remover funcionário?</h2>
      <p>
        <strong>{funcionario.nome}</strong> será removido da equipe nesta
        demonstração.
      </p>
      <p>Os agendamentos demonstrativos existentes serão mantidos.</p>
      <div>
        <button type="button" autoFocus onClick={aoCancelar}>
          Manter funcionário
        </button>
        <button type="button" className="btn-burgundy" onClick={aoConfirmar}>
          Remover funcionário
        </button>
      </div>
    </dialog>
  );
}
