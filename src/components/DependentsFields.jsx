import { useId } from "react";
import "./DependentsFields.css";

export default function DependentsFields({ dependentes, aoAlterar }) {
  const prefixo = useId();
  const atualizar = (id, campo, valor) =>
    aoAlterar(
      dependentes.map((item) =>
        item.id === id ? { ...item, [campo]: valor } : item,
      ),
    );
  return (
    <div className="signup-dependents">
      <div className="signup-dependents-heading">
        <div>
          <h3>Dependentes</h3>
          <p>Opcional: adicione os familiares que usam sua conta.</p>
        </div>
        <span>{dependentes.length}</span>
      </div>
      {dependentes.map((item, index) => (
        <div className="signup-dependent" key={item.id}>
          <div className="signup-dependent-heading">
            <strong>Dependente {index + 1}</strong>
            <button
              type="button"
              aria-label={`Remover dependente ${index + 1}`}
              onClick={() =>
                aoAlterar(dependentes.filter((dep) => dep.id !== item.id))
              }
            >
              Remover
            </button>
          </div>
          <div className="form-row-2">
            <div>
              <label htmlFor={`${prefixo}-${item.id}-name`}>
                Nome completo *
              </label>
              <input
                id={`${prefixo}-${item.id}-name`}
                className="auth-input"
                required
                maxLength={90}
                value={item.nome}
                onChange={(e) => atualizar(item.id, "nome", e.target.value)}
                placeholder="Nome do dependente"
              />
            </div>
            <div>
              <label htmlFor={`${prefixo}-${item.id}-relation`}>
                Parentesco *
              </label>
              <select
                id={`${prefixo}-${item.id}-relation`}
                className="auth-input"
                value={item.parentesco}
                onChange={(e) =>
                  atualizar(item.id, "parentesco", e.target.value)
                }
              >
                <option>Filho(a)</option>
                <option>Cônjuge</option>
                <option>Outro</option>
              </select>
            </div>
          </div>
        </div>
      ))}
      <button
        className="signup-add-dependent"
        type="button"
        onClick={() =>
          aoAlterar([
            ...dependentes,
            { id: crypto.randomUUID(), nome: "", parentesco: "Filho(a)" },
          ])
        }
      >
        + Adicionar dependente
      </button>
    </div>
  );
}
