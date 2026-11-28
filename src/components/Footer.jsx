import { contato } from "../data/contato";
export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.footerGrid}>
        <div>
          <strong style={styles.logo}>FRED. CABELEIREIROS</strong>
          <p style={styles.sub}>Beleza que valoriza quem você é.</p>
        </div>

        <div style={styles.info}>
          <span>📍 {contato.localizacao}</span>
          <span>📞 (11) 98765-4321</span>
        </div>

        <div style={styles.copy}>
          <span>© 2026 Fred Cabeleireiros</span>
          <span style={styles.team}>Desenvolvido por HexaDevs</span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "var(--espresso)",
    color: "#f2f3f5",
    padding: "36px 0",
    borderTop: "4px solid var(--gold)",
  },
  footerGrid: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.3rem",
    color: "#b7d4f5",
    display: "block",
  },
  sub: {
    fontSize: "0.85rem",
    color: "#b6c0cc",
    marginTop: "4px",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "0.88rem",
  },
  copy: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    fontSize: "0.82rem",
    color: "#b6c0cc",
  },
  team: {
    color: "#b7d4f5",
    fontWeight: 600,
    marginTop: "4px",
  },
};

