import { useState } from "react";
import "./Navbar.css";

export default function Navbar({
  paginaAtual,
  mudarPagina,
  usuarioLogado,
  aoSair,
}) {
  const [menuAberto, setMenuAberto] = useState(false);
  const irPara = (e, pagina, ancora) => {
    e.preventDefault();
    setMenuAberto(false);
    mudarPagina(pagina);

    if (ancora) {
      setTimeout(() => {
        const el = document.getElementById(ancora);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 60);
    }
  };

  return (
    <header className="site-navbar" style={styles.header}>
      <div
        className="container site-navbar-container"
        style={styles.navContainer}
      >
        {/* 1. Esquerda: Logo */}
        <a
          href="#inicio"
          onClick={(e) => irPara(e, "inicio")}
          style={styles.logoWrapper}
        >
          <span style={styles.logoTitle}>FRED.</span>
          <span style={styles.logoSub}>CABELEIREIROS</span>
        </a>

        {/* 2. Centro: Links */}
        <button
          className="navbar-menu-toggle"
          type="button"
          aria-expanded={menuAberto}
          aria-controls="main-navigation"
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          {menuAberto ? "Fechar menu ×" : "Menu ☰"}
        </button>
        <nav
          id="main-navigation"
          aria-label="Navegação principal"
          className={`nav-center-links ${menuAberto ? "nav-is-open" : ""}`}
          style={styles.navLinks}
        >
          <a
            href="#inicio"
            onClick={(e) => irPara(e, "inicio")}
            style={paginaAtual === "inicio" ? styles.linkActive : styles.link}
          >
            Início
          </a>
          <a
            href="#sobre"
            onClick={(e) => irPara(e, "inicio", "sobre")}
            style={styles.link}
          >
            Sobre
          </a>
          <a
            href="#profissionais"
            onClick={(e) => irPara(e, "inicio", "profissionais")}
            style={styles.link}
          >
            Profissionais
          </a>
          <a
            href="#servicos"
            onClick={(e) => irPara(e, "inicio", "servicos")}
            style={paginaAtual === "servicos" ? styles.linkActive : styles.link}
          >
            Serviços
          </a>
          <a
            href="#contato"
            onClick={(e) => irPara(e, "inicio", "contato")}
            style={styles.link}
          >
            Contato
          </a>
        </nav>

        {/* 3. Direita: Entrar ou Perfil do Cliente + Botão Agendar */}
        <div className="navbar-actions" style={styles.actions}>
          {usuarioLogado ? (
            <div style={styles.userBadge}>
              {/* Clicar na foto ou no nome agora leva direto à Área do Cliente */}
              <div
                onClick={() => mudarPagina("cliente")}
                style={styles.userInfoClickable}
                title="Ir para minha área"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt={usuarioLogado}
                  style={styles.userAvatar}
                />
                <span style={styles.userName}>Olá, {usuarioLogado}</span>
              </div>

              <button onClick={aoSair} style={styles.logoutBtn}>
                Sair
              </button>
            </div>
          ) : (
            <a
              href="#login"
              onClick={(e) => irPara(e, "login")}
              style={
                paginaAtual === "login"
                  ? styles.loginLinkActive
                  : styles.loginLink
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Entrar
            </a>
          )}

          <a
            href="#agendar"
            onClick={(e) => irPara(e, "agendamento")}
            className="btn-burgundy"
          >
            Agendar Horário
          </a>
        </div>
      </div>
      {/* Atalhos provisórios para conferir as telas antes da integração do login. */}
      <nav
        aria-label="Acesso provisório às áreas internas"
        style={styles.previewBar}
      >
        <div className="container" style={styles.previewLinks}>
          <span style={styles.previewLabel}>Visualização provisória:</span>
          {[
            { pagina: "cliente", nome: "Área do cliente" },
            { pagina: "funcionario", nome: "Área do funcionário" },
            { pagina: "admin", nome: "Admin Fred" },
          ].map(({ pagina, nome }) => (
            <a
              key={pagina}
              href={`#${pagina}`}
              onClick={(e) => irPara(e, pagina)}
              aria-current={paginaAtual === pagina ? "page" : undefined}
              style={
                paginaAtual === pagina
                  ? styles.previewLinkActive
                  : styles.previewLink
              }
            >
              {nome}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

const styles = {
  previewBar: {
    borderTop: "1px solid var(--border-warm)",
    backgroundColor: "var(--bg-page)",
  },
  previewLinks: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px 24px",
    padding: "10px 0",
  },
  previewLabel: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
  },
  previewLink: {
    color: "var(--espresso)",
    fontSize: "0.82rem",
    fontWeight: 500,
    textDecoration: "none",
    padding: "3px 0",
  },
  previewLinkActive: {
    color: "var(--burgundy)",
    fontSize: "0.82rem",
    fontWeight: 700,
    textDecoration: "none",
    padding: "3px 0",
    borderBottom: "2px solid var(--gold)",
  },
  header: {
    backgroundColor: "var(--bg-cream)",
    borderBottom: "1px solid var(--border-warm)",
    boxShadow: "0 4px 16px rgba(17, 18, 20, 0.06)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoWrapper: {
    display: "flex",
    flexDirection: "column",
    textDecoration: "none",
    color: "var(--espresso)",
    lineHeight: 1,
  },
  logoTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.75rem",
    fontWeight: 700,
  },
  logoSub: {
    fontSize: "0.6rem",
    letterSpacing: "0.24em",
    color: "var(--burgundy)",
    fontWeight: 700,
    marginTop: "3px",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "34px",
  },
  link: {
    textDecoration: "none",
    color: "var(--text-main)",
    fontSize: "0.94rem",
    fontWeight: 500,
  },
  linkActive: {
    textDecoration: "none",
    color: "var(--burgundy)",
    fontSize: "0.94rem",
    fontWeight: 700,
    borderBottom: "2px solid var(--gold)",
    paddingBottom: "4px",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
  },
  loginLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
    color: "var(--espresso)",
    fontWeight: 600,
    fontSize: "0.92rem",
  },
  loginLinkActive: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
    color: "var(--burgundy)",
    fontWeight: 700,
    fontSize: "0.92rem",
    borderBottom: "2px solid var(--gold)",
    paddingBottom: "3px",
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-warm)",
    padding: "5px 12px 5px 6px",
    borderRadius: "999px",
  },
  userInfoClickable: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  userName: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "var(--espresso)",
    textTransform: "capitalize",
  },
  logoutBtn: {
    background: "none",
    border: "none",
    color: "var(--burgundy)",
    fontSize: "0.78rem",
    fontWeight: 700,
    cursor: "pointer",
    borderLeft: "1px solid var(--border-warm)",
    paddingLeft: "10px",
  },
};
