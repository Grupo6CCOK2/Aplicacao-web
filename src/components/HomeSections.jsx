import { contato } from "../data/contato";
const servicos = [
  {
    titulo: "Coloração Premium",
    descricao:
      "Nova cor com cuidado, brilho e personalidade para realçar sua beleza.",
    duracao: "120 min",
    preco: "R$ 280",
    destaque: true,
    imagem:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
  },
  {
    titulo: "Corte Feminino",
    descricao:
      "Leveza, movimento e um corte pensado para combinar com o seu dia a dia.",
    duracao: "60 min",
    preco: "R$ 120",
    destaque: false,
    imagem:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
  },
  {
    titulo: "Corte Masculino",
    descricao:
      "Do clássico ao moderno, acabamento preciso em cada detalhe do seu estilo.",
    duracao: "45 min",
    preco: "R$ 80",
    destaque: false,
    imagem:
      "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&w=800&q=80",
  },
];

const equipe = [
  { nome: "Fred", cargo: "Barbeiro Master" },
  { nome: "Carla Soares", cargo: "Cortes e Finalização" },
  { nome: "Ana Oliveira", cargo: "Colorista" },
];

export default function HomeSections({ aoVerServicos, aoAgendar }) {
  return (
    <>
      {/* BLOCO 2: Sobre o Salão (Texto + Mini-cards à esquerda, Foto à direita) */}
      <section id="sobre" style={styles.section}>
        <div className="container split-grid">
          <div>
            <span style={styles.kicker}>SOBRE O SALÃO</span>
            <h2 style={styles.heading}>
              Mais do que um corte. Um cuidado com você.
            </h2>
            <p style={styles.paragraph}>
              Sob o comando do proprietário Fred, nosso salão oferece
              atendimento especializado em cortes, coloração e cuidados com os
              cabelos. Aqui cada detalhe é pensado para valorizar sua
              personalidade com horário marcado e zero espera.
            </p>

            {/* 3 caixas que preenchem o espaço abaixo do texto */}
            <div style={styles.miniCardsRow}>
              <div style={styles.miniCard}>
                <strong style={styles.miniCardTitle}>24h Online</strong>
                <span style={styles.miniCardSub}>Agende quando quiser</span>
              </div>
              <div style={styles.miniCard}>
                <strong style={styles.miniCardTitle}>Sem Filas</strong>
                <span style={styles.miniCardSub}>Horário reservado</span>
              </div>
              <div style={styles.miniCard}>
                <strong style={styles.miniCardTitle}>Especialistas</strong>
                <span style={styles.miniCardSub}>Atendimento sob medida</span>
              </div>
            </div>

            <a href="#profissionais" className="btn-burgundy">
              Conheça Nossa Equipe
            </a>
          </div>

          <div style={styles.photoCard}>
            <img
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1100&q=80"
              alt="Atendimento no Fred Cabeleireiros"
              style={styles.splitImage}
            />
          </div>
        </div>
      </section>

      {/* BLOCO 3: Nossos Serviços (3 Cards + Botão centralizado) */}
      <section id="servicos" style={styles.creamSection}>
        <div className="container">
          <div style={styles.centerHeader}>
            <span style={styles.kicker}>FEITO PARA VOCÊ</span>
            <h2 style={styles.heading}>Nossos Serviços</h2>
          </div>

          <div className="cards-grid">
            {servicos.map((item) => (
              <article key={item.titulo} style={styles.card}>
                <div style={styles.cardImgWrapper}>
                  {item.destaque && (
                    <span style={styles.tagDestaque}>DESTAQUE</span>
                  )}
                  <img
                    src={item.imagem}
                    alt={item.titulo}
                    style={styles.cardImg}
                  />
                </div>

                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>{item.titulo}</h3>
                  <p style={styles.cardDesc}>{item.descricao}</p>

                  <div style={styles.cardFooter}>
                    <span style={styles.duration}>⏱ {item.duracao}</span>
                    <strong style={styles.price}>
                      A partir de {item.preco}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={styles.centerButtonWrapper}>
            <button onClick={aoVerServicos} className="btn-gold">
              Ver Todos os Serviços →
            </button>
          </div>
        </div>
      </section>

      {/* BLOCO 4: Equipe e Localização (Foto à esquerda, Cards da equipe à direita) */}
      <section id="profissionais" style={styles.section}>
        <div className="container split-grid">
          <div style={styles.photoCard}>
            <img
              src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1100&q=80"
              alt="Profissionais Fred Cabeleireiros"
              style={styles.splitImage}
            />
          </div>

          <div>
            <span style={styles.kicker}>MÃOS QUE CUIDAM</span>
            <h2 style={styles.heading}>
              Profissionais especialistas e localização fácil.
            </h2>
            <p style={styles.paragraph}>
              Escolha o profissional de sua preferência diretamente no
              agendamento. Estamos na <strong>{contato.localizacao}</strong>.
            </p>

            {/* Lista visual dos profissionais para equilibrar a altura */}
            <div style={styles.teamGrid}>
              {equipe.map((pro) => (
                <div key={pro.nome} style={styles.teamCard}>
                  <strong style={styles.teamName}>{pro.nome}</strong>
                  <span style={styles.teamRole}>{pro.cargo}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => aoAgendar && aoAgendar("Corte Masculino")}
              className="btn-burgundy"
            >
              Agendar com Especialista
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

const styles = {
  section: {
    padding: "44px 0",
  },
  creamSection: {
    padding: "48px 0",
    backgroundColor: "var(--bg-cream)",
    borderTop: "1px solid var(--border-warm)",
    borderBottom: "1px solid var(--border-warm)",
  },
  kicker: {
    display: "inline-block",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    color: "var(--burgundy)",
    marginBottom: "8px",
  },
  heading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2.35rem",
    lineHeight: 1.18,
    color: "var(--espresso)",
    marginBottom: "14px",
  },
  paragraph: {
    fontSize: "1.02rem",
    color: "var(--text-muted)",
    marginBottom: "22px",
  },
  miniCardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    marginBottom: "24px",
  },
  miniCard: {
    backgroundColor: "var(--bg-cream)",
    border: "1px solid var(--border-warm)",
    borderRadius: "10px",
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
  },
  miniCardTitle: {
    color: "var(--espresso)",
    fontSize: "0.95rem",
  },
  miniCardSub: {
    color: "var(--text-muted)",
    fontSize: "0.78rem",
  },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    marginBottom: "24px",
  },
  teamCard: {
    backgroundColor: "var(--bg-cream)",
    borderLeft: "3px solid var(--gold)",
    borderRadius: "8px",
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
  },
  teamName: {
    color: "var(--espresso)",
    fontSize: "0.95rem",
  },
  teamRole: {
    color: "var(--burgundy)",
    fontSize: "0.78rem",
    fontWeight: 600,
  },
  photoCard: {
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    border: "3px solid var(--bg-cream-strong)",
    boxShadow: "0 14px 30px rgba(35, 20, 18, 0.1)",
  },
  splitImage: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    display: "block",
  },
  centerHeader: {
    textAlign: "center",
    marginBottom: "32px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
    border: "1px solid var(--border-warm)",
    boxShadow: "0 8px 20px rgba(35, 20, 18, 0.05)",
    display: "flex",
    flexDirection: "column",
  },
  cardImgWrapper: {
    position: "relative",
    height: "220px",
  },
  tagDestaque: {
    position: "absolute",
    top: "12px",
    left: "12px",
    backgroundColor: "var(--burgundy)",
    color: "#ffffff",
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    padding: "4px 10px",
    borderRadius: "6px",
  },
  cardImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardBody: {
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  cardTitle: {
    fontSize: "1.18rem",
    color: "var(--espresso)",
    marginBottom: "8px",
  },
  cardDesc: {
    fontSize: "0.92rem",
    color: "var(--text-muted)",
    marginBottom: "18px",
    flex: 1,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "14px",
    borderTop: "1px solid var(--border-warm)",
    fontSize: "0.88rem",
  },
  duration: {
    color: "var(--text-muted)",
  },
  price: {
    color: "var(--burgundy)",
    fontSize: "0.96rem",
  },
  centerButtonWrapper: {
    marginTop: "32px",
    display: "flex",
    justifyContent: "center",
  },
};
