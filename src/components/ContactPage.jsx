import { useState } from "react";
import { contato } from "../data/contato";
import "./ContactSection.css";

export default function ContactPage() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [autorizado, setAutorizado] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleEnviar = (e) => {
    e.preventDefault();
    setEnviado(true);
    setNome("");
    setTelefone("");
    setEmail("");
    setAssunto("");
    setMensagem("");
    setAutorizado(false);
  };

  return (
    <section
      id="contato"
      className="home-contact"
      style={styles.pageWrapper}
      aria-label="Localização e contato"
    >
      <div className="container contact-grid">
        <div style={styles.leftCol}>
          {/* Card do Mapa Estilizado */}
          <div className="home-contact-map" style={styles.mapCard}>
            <iframe
              title="Localização do Fred Cabeleireiros no Google Maps"
              src={contato.mapaEmbed}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: "100%", border: 0, display: "block" }}
            />

            <div style={styles.mapFooter}>
              <div>
                <a
                  href={contato.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...styles.mapTitle, textDecoration: "none" }}
                >
                  FRED. Cabeleireiros ↗
                </a>
                <span style={styles.mapSub}>{contato.localizacao}</span>
              </div>

              <a
                href={contato.rotaUrl}
                target="_blank"
                rel="noreferrer"
                style={styles.mapLink}
              >
                Ver rota ↗
              </a>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Formulário Enviar Mensagem */}
        <div className="home-contact-form" style={styles.formCard}>
          <span style={styles.kicker}>ATENDIMENTO DIRETO</span>
          <h2 style={styles.formTitle}>Enviar mensagem</h2>

          <form onSubmit={handleEnviar}>
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
                <label style={styles.label}>Telefone *</label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>E-mail *</label>
              <input
                type="email"
                required
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Assunto</label>
              <input
                type="text"
                placeholder="Ex: Dúvida sobre serviços, horários ou eventos"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className="auth-input"
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Mensagem *</label>
              <textarea
                required
                placeholder="Escreva sua mensagem..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className="auth-textarea"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  required
                  checked={autorizado}
                  onChange={(e) => setAutorizado(e.target.checked)}
                  style={styles.checkbox}
                />
                <span>Autorizo o contato da equipe Fred Cabeleireiros.</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn-burgundy"
              style={styles.fullBtn}
            >
              Enviar Mensagem →
            </button>

            {enviado && (
              <div style={styles.successBanner}>
                <strong>✓ Mensagem registrada nesta demonstração.</strong> O
                envio para a equipe será ativado com a integração.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "var(--bg-cream)",
    padding: "40px 0 64px",
  },
  kicker: {
    display: "inline-block",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    color: "var(--burgundy)",
    marginBottom: "4px",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },
  mapCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-warm)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(35, 20, 18, 0.04)",
  },
  mapFooter: {
    padding: "16px 22px",
    backgroundColor: "var(--bg-cream)",
    borderTop: "1px solid var(--border-warm)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mapTitle: {
    display: "block",
    fontSize: "0.92rem",
    color: "var(--espresso)",
  },
  mapSub: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
  },
  mapLink: {
    color: "var(--burgundy)",
    fontSize: "0.82rem",
    fontWeight: 700,
    textDecoration: "none",
  },
  formCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-warm)",
    borderRadius: "var(--radius-lg)",
    padding: "32px 36px",
    boxShadow: "0 10px 28px rgba(35, 20, 18, 0.05)",
  },
  formTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.85rem",
    color: "var(--espresso)",
    marginBottom: "22px",
  },
  fieldGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "var(--espresso)",
    marginBottom: "6px",
  },
  checkboxLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.86rem",
    color: "var(--text-main)",
    cursor: "pointer",
  },
  checkbox: {
    accentColor: "var(--burgundy)",
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },
  fullBtn: {
    width: "100%",
    padding: "14px",
    fontSize: "0.86rem",
  },
  successBanner: {
    marginTop: "16px",
    backgroundColor: "var(--bg-cream)",
    border: "1px solid var(--gold)",
    color: "var(--espresso)",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "0.86rem",
  },
};
