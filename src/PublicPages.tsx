import { useState, type FormEvent } from "react"
import { services, type Professional } from "./data"
import {
  Alert,
  Button,
  Card,
  Check,
  Eyebrow,
  Field,
  Icon,
  Modal,
  Textarea,
} from "./ui"

type Props = {
  navigate: (page: string) => void
  book: (service?: string, professional?: string) => void
  team: Professional[]
}
export function ServiceCard({
  service,
  book,
}: {
  service: typeof services[number]
  book: Props["book"]
}) {
  return (
    <Card className="service-card">
      <div className="service-image">
        <img
          src={service.image}
          alt={`Exemplo ilustrativo de ${service.name.toLowerCase()}`}
          loading="lazy"
        />
        {service.id === "color" && (
          <span className="highlight-badge">
            <Icon name="sparkle" size={13} /> DESTAQUE
          </span>
        )}
      </div>
      <div className="service-body">
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div className="service-meta">
          <span>
            <Icon name="clock" size={16} />
            {service.duration} min
          </span>
          <strong>A partir de R$ {service.price}</strong>
        </div>
        <Button
          variant="link"
          className="service-book"
          onClick={() => book(service.id)}
        >
          Agendar serviço <Icon name="arrow" size={16} />
        </Button>
      </div>
    </Card>
  )
}
export function MapBlock() {
  return (
    <div className="map-placeholder">
      <div className="map-roads" />
      <div className="map-label">
        <span className="map-pin">
          <Icon name="pin" size={22} />
        </span>
        <strong>Fred Cabeleireiros</strong>
        <small>Rua Principal, 123 · Centro</small>
      </div>
      <small className="map-caption">Localização ilustrativa</small>
    </div>
  )
}
export function ContactInfo({ compact = false }: { compact?: boolean }) {
  return (
    <Card className="contact-card">
      <Eyebrow>VENHA NOS VISITAR</Eyebrow>
      <h3>
        {compact ? "Seu próximo momento de cuidado" : "Onde nos encontrar"}
      </h3>
      <div className="contact-line">
        <Icon name="pin" />
        <div>
          <strong>Endereço</strong>
          <p>Rua Principal, 123 - Centro</p>
        </div>
      </div>
      {compact && <MapBlock />}
      <div className="contact-line">
        <Icon name="phone" />
        <div>
          <strong>WhatsApp</strong>
          <a
            href="https://wa.me/5511987654321"
            target="_blank"
            rel="noreferrer"
          >
            (11) 98765-4321
          </a>
        </div>
      </div>
      {!compact && (
        <div className="contact-line">
          <Icon name="clock" />
          <div>
            <strong>Horário de atendimento</strong>
            <p>Terça a Sábado das 9h às 19h</p>
          </div>
        </div>
      )}
      <a
        className="button button-outline"
        href="https://www.google.com/maps/search/?api=1&query=Rua+Principal+123+Centro"
        target="_blank"
        rel="noreferrer"
      >
        Como chegar <Icon name="arrow" size={16} />
      </a>
    </Card>
  )
}
export function Home({ navigate, book, team }: Props) {
  const [about, setAbout] = useState(false)
  return (
    <>
      <section id="inicio" className="hero container">
        <div className="hero-copy">
          <Eyebrow>
            <span className="eyebrow-line" /> CUIDADO QUE REVELA VOCÊ
          </Eyebrow>
          <h1>
            Seu melhor estilo,
            <br />
            todos os dias<span className="accent">.</span>
          </h1>
          <p className="lead">
            Beleza que valoriza quem você é. Agende seu horário e viva a
            experiência Fred.
          </p>
          <div className="hero-actions">
            <Button className="button-lg" onClick={() => book()}>
              Agendar horário <Icon name="arrow" size={18} />
            </Button>
            <Button
              className="button-lg"
              variant="outline"
              onClick={() => navigate("servicos")}
            >
              Ver serviços
            </Button>
          </div>
          <div className="hero-address">
            <Icon name="pin" size={18} />
            <span>
              Rua Principal, 123 - Centro
              <br />
              <small>(11) 98765-4321</small>
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="/images/salon.jpg"
            alt="Foto ilustrativa do interior de um salão de cabeleireiros"
            fetchPriority="high"
          />
          <div className="hero-image-caption">
            <span className="caption-icon">
              <Icon name="scissors" size={23} />
            </span>
            <div>
              <strong>Seu estilo. Nosso cuidado.</strong>
              <small>Um espaço para você se sentir bem.</small>
            </div>
          </div>
          <span className="image-label">A EXPERIÊNCIA FRED</span>
        </div>
      </section>
      <section id="sobre" className="container about-section">
        <div className="about-copy">
          <Eyebrow>SOBRE NÓS</Eyebrow>
          <h2>
            Mais do que um corte.
            <br />
            Um cuidado com você.
          </h2>
          <p>
            Acreditamos que o melhor estilo é aquele que faz você se sentir bem.
            Aqui, cada detalhe é pensado para valorizar a sua personalidade.
          </p>
          <Button variant="link" onClick={() => setAbout(true)}>
            Conheça o Fred <Icon name="arrow" size={16} />
          </Button>
        </div>
        <div className="values-grid">
          {[
            {
              number: "01",
              icon: "scissors",
              title: "Seu estilo, de verdade",
              text: "Um atendimento pensado para você.",
            },
            {
              number: "02",
              icon: "sparkle",
              title: "Cuidado em cada detalhe",
              text: "Técnica e atenção do início ao fim.",
            },
            {
              number: "03",
              icon: "heart",
              title: "Sinta-se em casa",
              text: "Seu momento de beleza e bem-estar.",
            },
          ].map((item) => (
            <Card className="value-card" key={item.number}>
              <div className="value-top">
                <span>{item.number}</span>
                <Icon name={item.icon} size={25} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Card>
          ))}
        </div>
      </section>
      <section id="servicos" className="services-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>FEITO PARA VOCÊ</Eyebrow>
              <h2>Nossos serviços</h2>
              <p>Técnicas exclusivas para realçar sua beleza.</p>
            </div>
            <Button variant="outline" onClick={() => navigate("servicos")}>
              Conhecer todos <Icon name="arrow" size={16} />
            </Button>
          </div>
          <div className="services-grid">
            {services.slice(0, 3).map((service) => (
              <ServiceCard service={service} book={book} key={service.id} />
            ))}
          </div>
        </div>
      </section>
      <section id="profissionais" className="container team-contact-section">
        <div>
          <Eyebrow>MÃOS QUE CUIDAM</Eyebrow>
          <h2>Conheça nossos profissionais</h2>
          <p className="section-intro">
            Talento, experiência e um olhar atento para o seu estilo.
          </p>
          <div className="team-grid">
            {team.slice(0, 3).map((person) => (
              <div className="person-card" key={person.id}>
                <div className="person-image">
                  <img
                    src={person.image}
                    alt={`Retrato ilustrativo de ${person.name}`}
                    loading="lazy"
                  />
                  <Button
                    variant="icon"
                    aria-label={`Agendar com ${person.name}`}
                    onClick={() => book(person.services[0], person.id)}
                  >
                    <Icon name="arrow" />
                  </Button>
                </div>
                <h3>{person.name}</h3>
                <p>{person.specialty}</p>
              </div>
            ))}
          </div>
        </div>
        <div id="contato">
          <ContactInfo compact />
        </div>
      </section>
      <section className="closing-cta">
        <div className="container">
          <div>
            <Eyebrow>UM TEMPO PARA VOCÊ</Eyebrow>
            <h2>Seu próximo bom dia começa aqui.</h2>
            <p>Escolha seu horário. Do resto, a gente cuida.</p>
          </div>
          <Button variant="dark" className="button-lg" onClick={() => book()}>
            Agendar horário <Icon name="arrow" size={18} />
          </Button>
        </div>
      </section>
      {about && (
        <Modal
          title="O cuidado tem nome: Fred."
          onClose={() => setAbout(false)}
        >
          <p>
            Um espaço para cuidar do cabelo, renovar o estilo e se sentir
            acolhido. Nossa equipe combina técnica, atenção e um atendimento
            próximo para encontrar o que combina com você.
          </p>
          <p className="muted">
            Texto institucional sugerido, sujeito à aprovação.
          </p>
          <Button
            onClick={() => {
              setAbout(false)
              book()
            }}
          >
            Viva a experiência Fred <Icon name="arrow" size={18} />
          </Button>
        </Modal>
      )}
    </>
  )
}
export function ServicesPage({ book }: Props) {
  const [filter, setFilter] = useState("Todos")
  const [offset, setOffset] = useState(0)
  const [all, setAll] = useState(false)
  const filtered = services.filter(
    (s) => filter === "Todos" || s.category === filter,
  )
  const visible = all ? filtered : filtered.slice(offset, offset + 3)
  return (
    <>
      <div className="catalog-banner">
        <img src="/images/salon.jpg" alt="Ambiente ilustrativo do salão" />
        <div className="container">
          <Eyebrow>BELEZA COM PERSONALIDADE</Eyebrow>
          <h2>Um novo olhar para o seu estilo.</h2>
        </div>
      </div>
      <section className="services-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>SERVIÇOS</Eyebrow>
              <h1>Catálogo de Serviços</h1>
              <p>
                Conheça nossos procedimentos exclusivos para cabelo e barba com
                atendimento de qualidade.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setAll(!all)
                setOffset(0)
              }}
            >
              {all ? "Ver destaques" : "Ver todos"}
            </Button>
          </div>
          <div className="pills">
            {["Todos", "Cortes", "Barba", "Tratamentos", "Coloração"].map(
              (category) => (
                <Button
                  variant="outline"
                  className={category === filter ? "selected" : ""}
                  aria-pressed={category === filter}
                  key={category}
                  onClick={() => {
                    setFilter(category)
                    setOffset(0)
                  }}
                >
                  {category}
                </Button>
              ),
            )}
          </div>
          <div className="services-grid">
            {visible.map((service) => (
              <ServiceCard service={service} book={book} key={service.id} />
            ))}
          </div>
          {!all && filtered.length > 3 && (
            <div className="carousel-controls">
              <Button
                variant="icon"
                aria-label="Serviços anteriores"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - 1))}
              >
                <Icon name="left" />
              </Button>
              <span>
                {offset + 1}–{Math.min(offset + 3, filtered.length)} de{" "}
                {filtered.length}
              </span>
              <Button
                variant="icon"
                aria-label="Próximos serviços"
                disabled={offset + 3 >= filtered.length}
                onClick={() => setOffset(offset + 1)}
              >
                <Icon name="right" />
              </Button>
            </div>
          )}
        </div>
      </section>
      <section className="container highlights-section">
        <Eyebrow>A DIFERENÇA ESTÁ NOS DETALHES</Eyebrow>
        <h2>Destaques</h2>
        <div className="highlights-grid">
          {[
            [
              "scissors",
              "Cortes e finalização",
              "O seu estilo, com técnica e personalidade.",
            ],
            [
              "sparkle",
              "Cor que transforma",
              "Tons e cuidados que valorizam você.",
            ],
            [
              "shield",
              "Cuidado profissional",
              "Atenção e qualidade em cada etapa.",
            ],
            [
              "heart",
              "Experiência acolhedora",
              "Um momento leve, do início ao fim.",
            ],
          ].map(([icon, title, text]) => (
            <Card key={title}>
              <Icon name={icon} size={30} />
              <h3>{title}</h3>
              <p>{text}</p>
            </Card>
          ))}
        </div>
        <Button variant="outline" onClick={() => book()}>
          Agendar meu horário <Icon name="arrow" size={16} />
        </Button>
      </section>
    </>
  )
}
export function ContactPage() {
  const [sent, setSent] = useState(false)
  function submit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }
  return (
    <section className="surface-page">
      <div className="container">
        <Eyebrow>VAMOS CONVERSAR</Eyebrow>
        <h1>Contato</h1>
        <p className="lead section-intro">
          Seu cuidado começa com uma boa conversa. Estamos aqui para ajudar.
        </p>
        <div className="contact-layout">
          <div>
            <ContactInfo />
            <MapBlock />
          </div>
          <Card className="message-card">
            <h2>Envie uma mensagem</h2>
            <p>Tire suas dúvidas ou conte como podemos ajudar.</p>
            <form onSubmit={submit}>
              <div className="form-grid">
                <Field
                  label="Nome"
                  required
                  autoComplete="name"
                  placeholder="Seu nome"
                />
                <Field
                  label="Telefone"
                  required
                  type="tel"
                  autoComplete="tel"
                  placeholder="(11) 98765-4321"
                  pattern={"[\\d\\s\\(\\)\\+\\-]{10,20}"}
                />
              </div>
              <Field
                label="E-mail"
                required
                type="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
              />
              <Field
                label="Assunto"
                placeholder="Sobre o que você gostaria de conversar?"
              />
              <Textarea
                label="Mensagem"
                required
                placeholder="Escreva sua mensagem aqui..."
              />
              <Check label="Autorizo o contato." required />
              {sent && (
                <Alert kind="success">
                  <strong>Mensagem registrada na demonstração.</strong>
                  <p>
                    O envio para o salão estará disponível após a integração com
                    o backend.
                  </p>
                </Alert>
              )}
              <Button type="submit" className="full button-lg">
                Enviar mensagem <Icon name="arrow" size={18} />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  )
}
export default Home
