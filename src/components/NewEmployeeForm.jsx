import { useState } from "react";
import "./NewEmployeeForm.css";

const especialidadesIniciais = [
  "Cortes e finalização",
  "Coloração e mechas",
  "Tratamentos",
  "Barba e visagismo",
];
const camposIniciais = {
  nome: "",
  sobrenome: "",
  cpf: "",
  telefone: "",
  email: "",
  senha: "",
  confirmarSenha: "",
};

export default function NewEmployeeForm({
  funcionarios,
  aoCadastrar,
  aoCancelar,
  funcionarioInicial = null,
}) {
  const editando = Boolean(funcionarioInicial);
  const [campos, setCampos] = useState(() =>
    funcionarioInicial
      ? {
          ...camposIniciais,
          nome: funcionarioInicial.nome.split(" ")[0],
          sobrenome: funcionarioInicial.nome.split(" ").slice(1).join(" "),
          cpf: funcionarioInicial.cpf || "",
          telefone: funcionarioInicial.telefone,
          email: funcionarioInicial.email,
        }
      : camposIniciais,
  );
  const [opcoes, setOpcoes] = useState(() => [
    ...new Set([
      ...especialidadesIniciais,
      ...(funcionarioInicial?.especialidades || []),
    ]),
  ]);
  const [especialidades, setEspecialidades] = useState(
    funcionarioInicial?.especialidades || [],
  );
  const [cargo, setCargo] = useState(funcionarioInicial?.cargo === "Cabeleireira" ? "Cabeleireira" : "Cabeleireiro");
  const [novaEspecialidade, setNovaEspecialidade] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");

  const alterar = (campo) => (e) => {
    setCampos((atuais) => ({ ...atuais, [campo]: e.target.value }));
    setErro("");
  };
  const alternarEspecialidade = (nome) => {
    setEspecialidades((atuais) =>
      atuais.includes(nome)
        ? atuais.filter((item) => item !== nome)
        : [...atuais, nome],
    );
    setErro("");
  };
  const incluirEspecialidade = () => {
    const nome = novaEspecialidade.trim();
    if (!nome) return;
    const existente = opcoes.find(
      (item) =>
        item.toLocaleLowerCase("pt-BR") === nome.toLocaleLowerCase("pt-BR"),
    );
    const selecionada = existente || nome;
    if (!existente) setOpcoes((atuais) => [...atuais, nome]);
    setEspecialidades((atuais) =>
      atuais.includes(selecionada) ? atuais : [...atuais, selecionada],
    );
    setNovaEspecialidade("");
    setErro("");
  };
  const cadastrar = (e) => {
    e.preventDefault();
    if (!campos.nome.trim() || !campos.sobrenome.trim())
      return setErro("Preencha o nome e o sobrenome.");
    if (
      (!editando || campos.cpf) &&
      campos.cpf.replace(/\D/g, "").length !== 11
    )
      return setErro("O CPF precisa ter 11 dígitos.");
    if (![10, 11].includes(campos.telefone.replace(/\D/g, "").length))
      return setErro("Informe o telefone com DDD.");
    if ((!editando || campos.senha) && campos.senha.length < 6)
      return setErro("A senha temporária precisa ter pelo menos 6 caracteres.");
    if (campos.senha !== campos.confirmarSenha)
      return setErro("As senhas não coincidem.");
    if (!especialidades.length)
      return setErro("Selecione pelo menos uma especialidade.");
    const email = campos.email.trim().toLowerCase();
    if (
      funcionarios.some(
        (item) =>
          item.id !== funcionarioInicial?.id &&
          item.email.toLowerCase() === email,
      )
    )
      return setErro("Já existe um funcionário com este e-mail.");
    aoCadastrar({
      ...funcionarioInicial,
      id: funcionarioInicial?.id || crypto.randomUUID(),
      nome: `${campos.nome.trim()} ${campos.sobrenome.trim()}`,
      cpf: campos.cpf.replace(/\D/g, ""),
      telefone: campos.telefone.trim(),
      email,
      cargo,
      especialidades,
      ocupacao: funcionarioInicial?.ocupacao || 0,
      status: funcionarioInicial?.status || "Ativo",
      avatar:
        funcionarioInicial?.avatar ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      ...(editando && campos.senha
        ? { redefinicaoSenhaEm: new Date().toISOString() }
        : {}),
    });
  };

  return (
    <section className="employee-form-page">
      <button type="button" className="employee-form-back" onClick={aoCancelar}>
        ← Voltar para funcionários
      </button>
      <header className="employee-form-header">
        <div>
          <span className="employee-form-kicker">GESTÃO DA EQUIPE</span>
          <h1>{editando ? "Editar funcionário" : "Novo funcionário"}</h1>
          <p>
            {editando
              ? "Atualize os dados, as especialidades ou simule uma nova senha temporária."
              : "Preencha os dados do profissional e selecione suas especialidades."}
          </p>
        </div>
        <span className="employee-form-required">* Campos obrigatórios</span>
      </header>

      <form
        onSubmit={cadastrar}
        aria-describedby={erro ? "employee-form-error" : undefined}
      >
        <div className="employee-form-grid">
          <div className="employee-form-sections">
            <section className="employee-form-card">
              <div className="employee-form-section-heading">
                <span>01</span>
                <div>
                  <h2>Dados pessoais</h2>
                  <p>Informações para identificar e contatar o profissional.</p>
                </div>
              </div>
              <div className="employee-form-fields">
                <div>
                  <label htmlFor="employee-first-name">Nome *</label>
                  <input
                    id="employee-first-name"
                    autoComplete="given-name"
                    required
                    maxLength={45}
                    placeholder="Nome do profissional"
                    value={campos.nome}
                    onChange={alterar("nome")}
                  />
                </div>
                <div>
                  <label htmlFor="employee-last-name">Sobrenome *</label>
                  <input
                    id="employee-last-name"
                    autoComplete="family-name"
                    required
                    maxLength={45}
                    placeholder="Sobrenome"
                    value={campos.sobrenome}
                    onChange={alterar("sobrenome")}
                  />
                </div>
                <div>
                  <label htmlFor="employee-cpf">CPF{!editando && " *"}</label>
                  <input
                    id="employee-cpf"
                    inputMode="numeric"
                    required={!editando}
                    maxLength={14}
                    placeholder="000.000.000-00"
                    value={campos.cpf}
                    onChange={alterar("cpf")}
                  />
                </div>
                <div>
                  <label htmlFor="employee-phone">Telefone / WhatsApp *</label>
                  <input
                    id="employee-phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={16}
                    placeholder="(11) 99999-9999"
                    value={campos.telefone}
                    onChange={alterar("telefone")}
                  />
                </div>
                <div><label htmlFor="employee-role">Cargo</label><select id="employee-role" value={cargo} onChange={e => setCargo(e.target.value)}><option>Cabeleireiro</option><option>Cabeleireira</option></select></div>
              </div>
            </section>

            <section className="employee-form-card">
              <div className="employee-form-section-heading">
                <span>02</span>
                <div>
                  <h2>Dados de acesso</h2>
                  <p>
                    {editando
                      ? "Para simular a redefinição, preencha e confirme uma nova senha. Deixe em branco para editar apenas os dados."
                      : "Defina o e-mail e a senha temporária do profissional."}
                  </p>
                </div>
              </div>
              <div className="employee-form-fields">
                <div className="employee-form-full">
                  <label htmlFor="employee-email">E-mail profissional *</label>
                  <input
                    id="employee-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="profissional@exemplo.com"
                    value={campos.email}
                    onChange={alterar("email")}
                  />
                </div>
                <div>
                  <label htmlFor="employee-password">
                    {editando ? "Nova senha temporária" : "Senha temporária *"}
                  </label>
                  <input
                    id="employee-password"
                    type={mostrarSenha ? "text" : "password"}
                    autoComplete="new-password"
                    required={!editando}
                    minLength={6}
                    placeholder="Mínimo de 6 caracteres"
                    value={campos.senha}
                    onChange={alterar("senha")}
                  />
                </div>
                <div>
                  <label htmlFor="employee-password-confirm">
                    Confirmar senha{!editando && " *"}
                  </label>
                  <input
                    id="employee-password-confirm"
                    type={mostrarSenha ? "text" : "password"}
                    autoComplete="new-password"
                    required={!editando || Boolean(campos.senha)}
                    minLength={6}
                    placeholder="Repita a senha"
                    value={campos.confirmarSenha}
                    onChange={alterar("confirmarSenha")}
                  />
                </div>
              </div>
              <label className="employee-form-password-toggle">
                <input
                  type="checkbox"
                  checked={mostrarSenha}
                  onChange={(e) => setMostrarSenha(e.target.checked)}
                />
                Mostrar senhas
              </label>
              <p className="employee-form-hint">
                Nesta demonstração, os dados são atualizados só nesta sessão. O
                acesso e a redefinição de senha reais dependem da integração com
                o Java.
              </p>
            </section>
          </div>

          <aside className="employee-form-card employee-form-specialties">
            <div className="employee-form-section-heading">
              <span>03</span>
              <div>
                <h2>Especialidades *</h2>
                <p>Selecione os serviços que este profissional realiza.</p>
              </div>
            </div>
            <div
              className="employee-form-options"
              role="group"
              aria-label="Especialidades do profissional"
            >
              {opcoes.map((nome) => (
                <label
                  key={nome}
                  className={especialidades.includes(nome) ? "is-selected" : ""}
                >
                  <input
                    type="checkbox"
                    checked={especialidades.includes(nome)}
                    onChange={() => alternarEspecialidade(nome)}
                  />
                  <span>{nome}</span>
                </label>
              ))}
            </div>
            <p className="employee-form-hint">
              {especialidades.length}{" "}
              {especialidades.length === 1
                ? "especialidade selecionada"
                : "especialidades selecionadas"}
            </p>
            <div className="employee-form-add-specialty">
              <label htmlFor="employee-new-specialty">
                Adicionar especialidade
              </label>
              <div>
                <input
                  id="employee-new-specialty"
                  maxLength={60}
                  placeholder="Nome da especialidade"
                  value={novaEspecialidade}
                  onChange={(e) => setNovaEspecialidade(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      incluirEspecialidade();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={incluirEspecialidade}
                  disabled={!novaEspecialidade.trim()}
                >
                  Incluir
                </button>
              </div>
            </div>
          </aside>
        </div>
        {erro && (
          <p
            id="employee-form-error"
            className="employee-form-error"
            role="alert"
          >
            {erro}
          </p>
        )}
        <footer className="employee-form-actions">
          <p>
            {editando ? (
              "As alterações serão mantidas durante esta sessão."
            ) : (
              <>
                O profissional será adicionado à equipe como{" "}
                <strong>ativo</strong>.
              </>
            )}
          </p>
          <div>
            <button
              type="button"
              className="employee-form-cancel"
              onClick={aoCancelar}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-burgundy">
              {editando ? "Salvar alterações →" : "Cadastrar funcionário →"}
            </button>
          </div>
        </footer>
      </form>
    </section>
  );
}
