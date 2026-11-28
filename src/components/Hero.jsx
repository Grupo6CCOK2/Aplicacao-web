import { contato } from "../data/contato";

export default function Hero({ aoAgendar }) {
  return (
    <section id="inicio" style={styles.banner}>
      <div style={styles.overlay} />

      <div className="container" style={styles.contentWrapper}>
        <div style={styles.centerText}>
          <span style={styles.badge}>CUIDADO QUE REVELA VOCÊ</span>
          <h1 style={styles.title}>Seu melhor estilo, todos os dias.</h1>
          <p style={styles.subtitle}>
            Beleza que valoriza quem você é. Escolha seu serviço, veja os
            horários livres e agende sem filas.
          </p>
          <button
            onClick={() => aoAgendar && aoAgendar("Corte Masculino")}
            className="btn-burgundy"
          >
            Agendar Horário →
          </button>
        </div>

        {/* Faixa de informações na base do banner */}
        <div style={styles.bottomBar}>
          <span>📍 {contato.localizacao}</span>
          <span>🕒 Terça a Sábado • 09h às 20h</span>
          <span>📞 (11) 98765-4321</span>
        </div>
      </div>
    </section>
  );
}

const styles = {
  banner: {
    position: "relative",
    width: "100%",
    minHeight: "78vh",
    backgroundImage:
      'url("https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=1920&q=90")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(17, 18, 20, 0.94) 12%, rgba(17, 18, 20, 0.28) 52%, rgba(17, 18, 20, 0.08) 100%)",
  },
  contentWrapper: {
    position: "relative",
    zIndex: 2,
    paddingTop: "90px",
    paddingBottom: "28px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  centerText: {
    textAlign: "center",
    maxWidth: "720px",
    marginBottom: "44px",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "rgba(17, 18, 20, 0.72)",
    border: "1px solid var(--gold)",
    color: "#ffffff",
    fontSize: "0.76rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    padding: "6px 16px",
    borderRadius: "999px",
    marginBottom: "18px",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "3.8rem",
    lineHeight: 1.1,
    color: "#ffffff",
    marginBottom: "16px",
    textShadow: "0 4px 18px rgba(0, 0, 0, 0.45)",
  },
  subtitle: {
    fontSize: "1.12rem",
    color: "#f2f3f5",
    marginBottom: "30px",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.45)",
  },
  bottomBar: {
    width: "100%",
    paddingTop: "20px",
    borderTop: "1px solid rgba(242, 243, 245, 0.25)",
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: "16px",
    color: "#f2f3f5",
    fontSize: "0.92rem",
  },
};
