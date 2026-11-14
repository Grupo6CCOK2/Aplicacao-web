import { useState } from "react";
import "./EmployeeProfile.css";

export default function EmployeeProfile({
  funcionario,
  funcionarios,
  aoSalvar,
}) {
  const [perfil, setPerfil] = useState(funcionario);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  if (!funcionario)
    return <p>Nenhum funcionário disponível para visualizar.</p>;
  const mudar = (campo) => (e) => {
    setPerfil((atual) => ({ ...atual, [campo]: e.target.value }));
    setMensagem("");
    setErro("");
  };
  const salvar = (e) => {
    e.preventDefault();
    if (!perfil.nome.trim()) return setErro("Informe seu nome.");
    const email = perfil.email.trim().toLowerCase();
    if (
      funcionarios.some(
        (item) => item.id !== perfil.id && item.email.toLowerCase() === email,
      )
    )
      return setErro("Este e-mail já é usado por outro funcionário.");
    aoSalvar({
      ...perfil,
      nome: perfil.nome.trim(),
      telefone: perfil.telefone.trim(),
      email,
    });
    setMensagem("Perfil atualizado nesta sessão.");
  };
  return (
    <section className="employee-profile">
      <header>
        <span>MINHA CONTA</span>
        <h1>Meu perfil</h1>
        <p>Atualize sua foto e os seus dados de contato.</p>
      </header>
      <div className="employee-profile-grid">
        <aside className="employee-profile-summary">
          <img src={perfil.avatar} alt={`Foto de ${perfil.nome}`} />
          <h2>{perfil.nome}</h2>
          <p>{funcionario.cargo}</p>
          <span className="employee-profile-status">{funcionario.status}</span>
          <div className="employee-profile-specialties">
            <h3>Especialidades</h3>
            {funcionario.especialidades.map((nome) => (
              <span key={nome}>{nome}</span>
            ))}
          </div>
        </aside>
        <form className="employee-profile-form" onSubmit={salvar}>
          <h2>Dados pessoais</h2>
          <p>Essas informações identificam seu perfil profissional.</p>
          <div>
            <label htmlFor="professional-name">Nome completo *</label>
            <input
              className="auth-input"
              id="professional-name"
              required
              autoComplete="name"
              value={perfil.nome}
              onChange={mudar("nome")}
            />
          </div>
          <div className="form-row-2">
            <div>
              <label htmlFor="professional-phone">Telefone / WhatsApp *</label>
              <input
                className="auth-input"
                type="tel"
                id="professional-phone"
                required
                autoComplete="tel"
                value={perfil.telefone}
                onChange={mudar("telefone")}
              />
            </div>
            <div>
              <label htmlFor="professional-email">E-mail *</label>
              <input
                className="auth-input"
                type="email"
                id="professional-email"
                required
                autoComplete="email"
                value={perfil.email}
                onChange={mudar("email")}
              />
            </div>
          </div>
          <div>
            <label htmlFor="professional-photo">Link da foto (URL)</label>
            <input
              className="auth-input"
              type="url"
              id="professional-photo"
              value={perfil.avatar}
              onChange={mudar("avatar")}
              placeholder="https://..."
            />
            <small>Escolha uma foto para apresentar seu perfil.</small>
          </div>
          <div className="employee-profile-note">
            <strong>Precisa redefinir sua senha?</strong>
            <p>Solicite ao administrador Fred pela gestão de funcionários.</p>
          </div>
          {erro && (
            <p role="alert" className="employee-profile-error">
              {erro}
            </p>
          )}
          {mensagem && <p role="status">{mensagem}</p>}
          <button className="btn-burgundy" type="submit">
            Salvar alterações
          </button>
        </form>
      </div>
    </section>
  );
}
