import { useState } from "react";
import bannerServicos from "../assets/banner-servicos.jpg";

import { servicosIniciais } from "../data/servicos";

export default function ServicesPage({ aoAgendar, servicos = servicosIniciais }) {
  const listaServicos = servicos.filter(item => item.ativo !== false);
  const categorias = ["Todos", ...new Set(listaServicos.map(item => item.categoria))];
  const [filtro, setFiltro] = useState("Todos");

  const servicosFiltrados =
    filtro === "Todos"
      ? listaServicos
      : listaServicos.filter((item) => item.categoria === filtro);

  return (
    <div>
      {/* 1. Banner da aba Serviços com a foto escolhida */}
      <section style={styles.banner}>
        <div style={styles.overlay} />
        <div className="container" style={styles.bannerContent}>
          <span style={styles.badge}>CATÁLOGO COMPLETO</span>
          <h1 style={styles.bannerTitle}>Nossos Serviços</h1>
          <p style={styles.bannerSubtitle}>
            Escolha o atendimento ideal, confira duração e valores e reserve seu
            horário sem filas.
          </p>
        </div>
      </section>

      {/* 2. Grade 3x3 de Serviços */}
      <section style={styles.gridSection}>
        <div className="container">
          <div style={styles.filterBar}>
            {categorias.map((cat) => {
              const ativo = filtro === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFiltro(cat)}
                  style={ativo ? styles.filterBtnActive : styles.filterBtn}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="cards-grid">
            {servicosFiltrados.map((item) => (
              <article key={item.id} style={styles.card}>
                <div style={styles.cardImgWrapper}>
                  <span style={styles.categoryTag}>{item.categoria}</span>
                  <img
                    src={item.imagem}
                    alt={item.titulo}
                    style={styles.cardImg}
                  />
                </div>

                <div style={styles.cardBody}>
                  <h2 style={styles.cardTitle}>{item.titulo}</h2>
                  <p style={styles.cardDesc}>{item.descricao}</p>

                  <div style={styles.specialistRow}>
                    <span style={styles.specialistLabel}>Profissional:</span>
                    <strong style={styles.specialistName}>
                      {item.profissional}
                    </strong>
                  </div>

                  <div style={styles.cardFooter}>
                    <div>
                      <span style={styles.duration}>⏱ {item.duracao}</span>
                      <strong style={styles.price}>{item.preco}</strong>
                    </div>

                    <button
                      onClick={() => aoAgendar(item.titulo)}
                      className="btn-burgundy"
                      style={styles.cardBtn}
                    >
                      Agendar →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  banner: {
    position: "relative",
    width: "100%",
    minHeight: "58vh",
    backgroundImage: `url(${bannerServicos})`,
    backgroundSize: "cover",
    backgroundPosition: "center 42%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    textAlign: "center",
    padding: "80px 20px 44px",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(17, 18, 20, 0.94) 14%, rgba(17, 18, 20, 0.42) 55%, rgba(17, 18, 20, 0.12) 100%)",
  },
  bannerContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "680px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "rgba(17, 18, 20, 0.78)",
    border: "1px solid var(--gold)",
    color: "#ffffff",
    fontSize: "0.74rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    padding: "6px 16px",
    borderRadius: "999px",
    marginBottom: "14px",
  },
  bannerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "3.2rem",
    lineHeight: 1.15,
    color: "#ffffff",
    marginBottom: "12px",
    textShadow: "0 4px 18px rgba(0, 0, 0, 0.45)",
  },
  bannerSubtitle: {
    fontSize: "1.06rem",
    color: "#f2f3f5",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.45)",
  },
  gridSection: {
    padding: "48px 0 64px",
    backgroundColor: "var(--bg-page)",
  },
  filterBar: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "36px",
  },
  filterBtn: {
    backgroundColor: "#ffffff",
    color: "var(--text-main)",
    border: "1px solid var(--border-warm)",
    padding: "9px 18px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  filterBtnActive: {
    backgroundColor: "var(--espresso)",
    color: "#ffffff",
    border: "1px solid var(--espresso)",
    padding: "9px 18px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
    border: "1px solid var(--border-warm)",
    boxShadow: "0 8px 20px rgba(17, 18, 20, 0.05)",
    display: "flex",
    flexDirection: "column",
  },
  cardImgWrapper: {
    position: "relative",
    height: "200px",
  },
  categoryTag: {
    position: "absolute",
    top: "12px",
    left: "12px",
    backgroundColor: "rgba(17, 18, 20, 0.85)",
    color: "#ffffff",
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    padding: "4px 10px",
    borderRadius: "6px",
  },
  cardImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardBody: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  cardTitle: {
    fontSize: "1.16rem",
    color: "var(--espresso)",
    marginBottom: "8px",
  },
  cardDesc: {
    fontSize: "0.9rem",
    color: "var(--text-muted)",
    marginBottom: "14px",
    flex: 1,
  },
  specialistRow: {
    fontSize: "0.82rem",
    backgroundColor: "var(--bg-cream)",
    padding: "7px 12px",
    borderRadius: "8px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
  },
  specialistLabel: {
    color: "var(--text-muted)",
  },
  specialistName: {
    color: "var(--espresso)",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "14px",
    borderTop: "1px solid var(--border-warm)",
  },
  duration: {
    display: "block",
    fontSize: "0.78rem",
    color: "var(--text-muted)",
  },
  price: {
    fontSize: "1.05rem",
    color: "var(--burgundy)",
  },
  cardBtn: {
    padding: "10px 16px",
    fontSize: "0.78rem",
  },
};
