import { useState, useEffect } from "react";
import DependentsFields from "./DependentsFields";
import fotoLogin from "../assets/foto-login.avif";

export default function AuthPage({
  modoInicial = "login",
  aoConcluirAuth,
  aoConcluirCadastro,
}) {
  const [aba, setAba] = useState(modoInicial);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Campos de Login
  const [emailLogin, setEmailLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");

  // Campos de Recuperar Senha
  const [emailRecuperar, setEmailRecuperar] = useState("");
  const [linkEnviado, setLinkEnviado] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(45);

  // Campos de Cadastro
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dependentesCadastro, setDependentesCadastro] = useState([]);
  const [erroCadastro, setErroCadastro] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Contador regressivo para reenviar link de recuperação
  useEffect(() => {
    if (!linkEnviado || segundosRestantes <= 0) return;

    const timer = setInterval(() => {
      setSegundosRestantes((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [linkEnviado, segundosRestantes]);

  const handleLogin = (e) => {
    e.preventDefault();
    const nomeExibicao = emailLogin.split("@")[0] || "Cliente";
    aoConcluirAuth(nomeExibicao);
  };

  const handleCadastro = (e) => {
    e.preventDefault();
    if (senhaCadastro !== confirmarSenha) {
      setErroCadastro("As senhas não coincidem. Verifique e tente novamente.");
      return;
    }
    if (dependentesCadastro.some((item) => !item.nome.trim())) {
      setErroCadastro(
        "Preencha o nome de todos os dependentes ou remova as linhas vazias.",
      );
      return;
    }
    setErroCadastro("");
    aoConcluirCadastro({
      perfil: {
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        nascimento,
        telefone,
        email: emailCadastro,
        foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      },
      dependentes: dependentesCadastro.map((item) => ({
        ...item,
        nome: item.nome.trim(),
      })),
    });
  };

  const handleEnviarLink = (e) => {
    e.preventDefault();
    setLinkEnviado(true);
    setSegundosRestantes(45);
  };

  const abrirRecuperacao = (e) => {
    e.preventDefault();
    setEmailRecuperar(emailLogin);
    setLinkEnviado(false);
    setSegundosRestantes(45);
    setAba("recuperar");
  };

  const emailRecuperarValido =
    emailRecuperar.includes("@") && emailRecuperar.includes(".");

  return (
    <section className="auth-split">
      {/* METADE ESQUERDA: Imagem das ferramentas + destaques */}
      <div className="auth-visual-col" style={styles.visualSide}>
        <div style={styles.visualOverlay} />

        <div style={styles.visualContent}>
          <span style={styles.visualBadge}>A EXPERIÊNCIA FRED</span>
          <h2 style={styles.visualTitle}>
            Seu momento de cuidado começa aqui.
          </h2>
          <p style={styles.visualText}>
            Agende em segundos, escolha seu profissional favorito e acompanhe
            seus horários sem precisar esperar por mensagens.
          </p>

          <div style={styles.benefitsList}>
            <div style={styles.benefitItem}>
              <span style={styles.checkIcon}>✓</span>
              <span>Agendamento online 24 horas por dia</span>
            </div>
            <div style={styles.benefitItem}>
              <span style={styles.checkIcon}>✓</span>
              <span>Lembretes automáticos no seu WhatsApp</span>
            </div>
            <div style={styles.benefitItem}>
              <span style={styles.checkIcon}>✓</span>
              <span>Cadastro de dependentes em uma única conta</span>
            </div>
          </div>
        </div>
      </div>

      {/* METADE DIREITA: Login, Cadastro ou Recuperação */}
      <div style={styles.formSide}>
        <div style={styles.formContainer}>
          {/* Seletor de Abas (aparece no Login e no Cadastro) */}
          {aba !== "recuperar" && (
            <div style={styles.tabSwitcher}>
              <button
                type="button"
                onClick={() => setAba("login")}
                style={aba === "login" ? styles.tabActive : styles.tabBtn}
              >
                Entrar na conta
              </button>
              <button
                type="button"
                onClick={() => setAba("cadastro")}
                style={aba === "cadastro" ? styles.tabActive : styles.tabBtn}
              >
                Criar conta
              </button>
            </div>
          )}

          {/* ================= 1. FORMULÁRIO DE LOGIN ================= */}
          {aba === "login" && (
            <form onSubmit={handleLogin}>
              <div style={styles.formHeader}>
                <span style={styles.kicker}>BEM-VINDO DE VOLTA</span>
                <h1 style={styles.title}>Acessar minha conta</h1>
                <p style={styles.subtitle}>
                  Entre para agendar ou acompanhar seus horários no Fred.
                </p>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>E-mail *</label>
                <input
                  type="email"
                  required
                  placeholder="voce@exemplo.com"
                  value={emailLogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
                  className="auth-input"
                />
              </div>

              <div style={styles.fieldGroup}>
                <div style={styles.labelRow}>
                  <label style={styles.label}>Senha *</label>
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    style={styles.textAction}
                  >
                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  required
                  placeholder="Sua senha"
                  value={senhaLogin}
                  onChange={(e) => setSenhaLogin(e.target.value)}
                  className="auth-input"
                />
              </div>

              <div style={styles.optionsRow}>
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" style={styles.checkbox} />
                  <span>Lembrar de mim</span>
                </label>

                <a
                  href="#recuperar"
                  onClick={abrirRecuperacao}
                  style={styles.burgundyLink}
                >
                  Esqueci minha senha
                </a>
              </div>

              <button
                type="submit"
                className="btn-burgundy"
                style={styles.fullBtn}
              >
                Entrar →
              </button>

              <p style={styles.switchFooter}>
                Ainda não tem cadastro?{" "}
                <button
                  type="button"
                  onClick={() => setAba("cadastro")}
                  style={styles.switchLink}
                >
                  Criar conta agora
                </button>
              </p>
            </form>
          )}

          {/* ================= 2. FORMULÁRIO DE RECUPERAR SENHA ================= */}
          {aba === "recuperar" && (
            <form onSubmit={handleEnviarLink}>
              <div style={styles.formHeader}>
                <span style={styles.kicker}>RECUPERAÇÃO DE ACESSO</span>
                <h1 style={styles.title}>Recuperar senha</h1>
                <p style={styles.subtitle}>
                  Enviaremos um link para redefinir sua senha com segurança.
                </p>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>E-mail cadastrado *</label>
                <input
                  type="email"
                  required
                  placeholder="voce@exemplo.com"
                  value={emailRecuperar}
                  onChange={(e) => setEmailRecuperar(e.target.value)}
                  className="auth-input"
                />
                {emailRecuperarValido && (
                  <span style={styles.validHint}>✓ E-mail válido</span>
                )}
              </div>

              <button
                type="submit"
                className="btn-burgundy"
                style={{ ...styles.fullBtn, marginTop: "6px" }}
              >
                Enviar link →
              </button>

              {linkEnviado && (
                <div style={styles.sentCard}>
                  <strong style={styles.sentTitle}>Link enviado</strong>
                  <p style={styles.sentDesc}>
                    Confira a caixa de entrada de{" "}
                    <strong>{emailRecuperar}</strong> para redefinir sua senha.
                  </p>
                </div>
              )}

              {linkEnviado && (
                <div style={styles.resendRow}>
                  <span style={styles.timerText}>
                    {segundosRestantes > 0
                      ? `Reenviar em 00:${String(segundosRestantes).padStart(
                          2,
                          "0",
                        )}`
                      : "Não recebeu o e-mail?"}
                  </span>

                  <button
                    type="button"
                    disabled={segundosRestantes > 0}
                    onClick={() => setSegundosRestantes(45)}
                    style={
                      segundosRestantes > 0
                        ? styles.resendBtnDisabled
                        : styles.resendBtnActive
                    }
                  >
                    Reenviar
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setAba("login")}
                style={styles.backToLoginBtn}
              >
                ← Voltar ao login
              </button>
            </form>
          )}

          {/* ================= 3. FORMULÁRIO DE CADASTRO ================= */}
          {aba === "cadastro" && (
            <form onSubmit={handleCadastro}>
              <div style={styles.formHeader}>
                <span style={styles.kicker}>CADASTRO RÁPIDO</span>
                <h1 style={styles.title}>Criar minha conta</h1>
                <p style={styles.subtitle}>
                  Preencha seus dados uma única vez para agendar sem filas.
                </p>
              </div>

              <div className="form-row-2" style={styles.fieldGroup}>
                <div>
                  <label style={styles.label}>Nome *</label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="auth-input"
                  />
                </div>
                <div>
                  <label style={styles.label}>Sobrenome *</label>
                  <input
                    type="text"
                    required
                    placeholder="Seu sobrenome"
                    value={sobrenome}
                    onChange={(e) => setSobrenome(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="form-row-2" style={styles.fieldGroup}>
                <div>
                  <label style={styles.label}>Data de nascimento *</label>
                  <input
                    type="date"
                    required
                    value={nascimento}
                    onChange={(e) => setNascimento(e.target.value)}
                    className="auth-input"
                  />
                </div>
                <div>
                  <label style={styles.label}>Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 98765-4321"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>

              <DependentsFields
                dependentes={dependentesCadastro}
                aoAlterar={setDependentesCadastro}
              />

              <div style={styles.fieldGroup}>
                <label style={styles.label}>E-mail *</label>
                <input
                  type="email"
                  required
                  placeholder="voce@exemplo.com"
                  value={emailCadastro}
                  onChange={(e) => setEmailCadastro(e.target.value)}
                  className="auth-input"
                />
              </div>

              <div className="form-row-2" style={styles.fieldGroup}>
                <div>
                  <label style={styles.label}>Senha *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    value={senhaCadastro}
                    onChange={(e) => setSenhaCadastro(e.target.value)}
                    className="auth-input"
                  />
                </div>
                <div>
                  <label style={styles.label}>Confirmar senha *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Repita a senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" required style={styles.checkbox} />
                  <span>
                    Li e concordo com os{" "}
                    <strong style={{ color: "var(--burgundy)" }}>
                      termos de uso
                    </strong>
                    .
                  </span>
                </label>
              </div>

              {erroCadastro && (
                <p
                  role="alert"
                  style={{ color: "var(--burgundy)", marginBottom: "12px" }}
                >
                  {erroCadastro}
                </p>
              )}
              <button
                type="submit"
                className="btn-burgundy"
                style={styles.fullBtn}
              >
                Criar Minha Conta →
              </button>

              <p style={styles.switchFooter}>
                Já possui cadastro?{" "}
                <button
                  type="button"
                  onClick={() => setAba("login")}
                  style={styles.switchLink}
                >
                  Fazer login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const styles = {
  visualSide: {
    position: "relative",
    backgroundColor: "#231412",
    backgroundImage: `url(${fotoLogin})`,
    backgroundSize: "cover", // MUDOU AQUI: cobre todo o espaço sem distorcer
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center", // Centraliza a imagem
    padding: "48px 52px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  visualOverlay: {
    position: "absolute",
    inset: 0,
    // Deixa um gradiente suave embaixo para destacar o texto e clareia um pouco em cima
    background:
      "linear-gradient(to top, rgba(35, 20, 18, 0.95) 0%, rgba(35, 20, 18, 0.65) 50%, rgba(35, 20, 18, 0.2) 100%)",
  },
  visualContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "500px",
    color: "#ffffff",
  },
  visualBadge: {
    display: "inline-block",
    backgroundColor: "rgba(35, 20, 18, 0.78)",
    border: "1px solid var(--gold)",
    color: "var(--gold)",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    padding: "5px 14px",
    borderRadius: "999px",
    marginBottom: "16px",
  },
  visualTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2.5rem",
    lineHeight: 1.15,
    marginBottom: "14px",
    textShadow: "0 3px 14px rgba(0, 0, 0, 0.4)",
  },
  visualText: {
    fontSize: "0.98rem",
    color: "#f7ebe1",
    marginBottom: "26px",
    lineHeight: 1.6,
  },
  benefitsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(247, 235, 225, 0.24)",
  },
  benefitItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "0.9rem",
    color: "#f7ebe1",
  },
  checkIcon: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    backgroundColor: "var(--gold)",
    color: "var(--espresso)",
    fontWeight: 700,
    fontSize: "0.75rem",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  formSide: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "44px 32px",
    backgroundColor: "var(--bg-page)",
  },
  formContainer: {
    width: "100%",
    maxWidth: "520px",
  },
  tabSwitcher: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    backgroundColor: "var(--bg-cream)",
    padding: "4px",
    borderRadius: "10px",
    border: "1px solid var(--border-warm)",
    marginBottom: "26px",
  },
  tabBtn: {
    background: "none",
    border: "none",
    padding: "10px",
    borderRadius: "7px",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "var(--text-muted)",
    cursor: "pointer",
  },
  tabActive: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-warm)",
    padding: "10px",
    borderRadius: "7px",
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "var(--burgundy)",
    boxShadow: "0 2px 6px rgba(35, 20, 18, 0.06)",
    cursor: "pointer",
  },
  formHeader: {
    marginBottom: "22px",
  },
  kicker: {
    display: "inline-block",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    color: "var(--burgundy)",
    marginBottom: "6px",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2rem",
    lineHeight: 1.2,
    color: "var(--espresso)",
    marginBottom: "6px",
  },
  subtitle: {
    fontSize: "0.92rem",
    color: "var(--text-muted)",
  },
  fieldGroup: {
    marginBottom: "15px",
  },
  validHint: {
    display: "inline-block",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "var(--burgundy)",
    marginTop: "6px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "var(--espresso)",
    marginBottom: "5px",
  },
  textAction: {
    background: "none",
    border: "none",
    color: "var(--burgundy)",
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  optionsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
    fontSize: "0.84rem",
  },
  checkboxLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.84rem",
    color: "var(--text-main)",
    cursor: "pointer",
  },
  checkbox: {
    accentColor: "var(--burgundy)",
    width: "15px",
    height: "15px",
    cursor: "pointer",
  },
  burgundyLink: {
    color: "var(--burgundy)",
    fontWeight: 600,
    textDecoration: "none",
  },
  dependentBox: {
    backgroundColor: "var(--bg-cream)",
    border: "1px solid var(--border-warm)",
    borderRadius: "8px",
    padding: "11px 13px",
    marginBottom: "15px",
  },
  fullBtn: {
    width: "100%",
    padding: "13px",
    fontSize: "0.86rem",
  },
  sentCard: {
    marginTop: "18px",
    backgroundColor: "var(--bg-cream)",
    border: "1px solid var(--gold)",
    borderLeft: "4px solid var(--gold)",
    borderRadius: "10px",
    padding: "14px 16px",
  },
  sentTitle: {
    display: "block",
    fontSize: "0.92rem",
    color: "var(--espresso)",
    marginBottom: "3px",
  },
  sentDesc: {
    fontSize: "0.84rem",
    color: "var(--text-muted)",
    lineHeight: 1.5,
  },
  resendRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
    paddingTop: "14px",
    borderTop: "1px solid var(--border-warm)",
    fontSize: "0.84rem",
  },
  timerText: {
    color: "var(--text-muted)",
  },
  resendBtnDisabled: {
    background: "none",
    border: "none",
    color: "#b8aba6",
    fontWeight: 700,
    fontSize: "0.84rem",
    cursor: "not-allowed",
  },
  resendBtnActive: {
    background: "none",
    border: "none",
    color: "var(--burgundy)",
    fontWeight: 700,
    fontSize: "0.84rem",
    textDecoration: "underline",
    cursor: "pointer",
  },
  backToLoginBtn: {
    width: "100%",
    marginTop: "18px",
    padding: "12px",
    borderRadius: "8px",
    border: "1.5px solid var(--border-warm)",
    backgroundColor: "#ffffff",
    color: "var(--espresso)",
    fontSize: "0.84rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  switchFooter: {
    textAlign: "center",
    marginTop: "18px",
    fontSize: "0.86rem",
    color: "var(--text-muted)",
  },
  switchLink: {
    background: "none",
    border: "none",
    color: "var(--burgundy)",
    fontWeight: 700,
    fontSize: "0.86rem",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
