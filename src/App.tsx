import { useEffect, useState } from "react"
import {
  initialAppointments,
  initialClients,
  initialTeam,
  loadSaved,
  type Appointment,
  type Client,
  type Professional,
  type Session,
} from "./data"
import { Brand, Button, Icon, Modal } from "./ui"
import { ContactPage, Home, ServicesPage } from "./PublicPages"
import AuthPages from "./AuthPages"
import BookingPage from "./BookingPage"
import AdminPages from "./AdminPages"

const publicPages = [
  "inicio",
  "servicos",
  "contato",
  "entrar",
  "cadastro",
  "recuperar-senha",
  "equipe",
]
const adminPages = ["painel", "financeiro", "funcionarios", "novo-funcionario"]
const knownPages = [
  ...publicPages,
  ...adminPages,
  "agenda",
  "clientes",
  "perfil",
  "agendamento",
]
function readPerfil(): "cabeleireiro" | "cliente" | null {
  const urlParams = new URLSearchParams(window.location.search)
  const p = urlParams.get("perfil")
  if (p === "cabeleireiro" || p === "cliente") {
    sessionStorage.setItem("fred-perfil", p)
    return p
  }
  const saved = sessionStorage.getItem("fred-perfil")
  if (saved === "cabeleireiro" || saved === "cliente") return saved
  return null
}
function readRoute() {
  const route = location.hash.slice(1).split("?")[0]
  if (knownPages.includes(route)) return route
  if (readPerfil() === "cabeleireiro") return "equipe"
  return "inicio"
}
export default function App() {
  const [page, setPage] = useState(readRoute)
  const [session, setSession] = useState<Session | null>(() => {
    try {
      return JSON.parse(sessionStorage.getItem("fred-session") || "null")
    } catch {
      return null
    }
  })
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadSaved("fred-appointments", initialAppointments),
  )
  const [clients, setClients] = useState<Client[]>(() =>
    loadSaved("fred-clients", initialClients),
  )
  const [team, setTeam] = useState<Professional[]>(() =>
    loadSaved("fred-team", initialTeam),
  )
  const [selectedService, setSelectedService] = useState("")
  const [selectedProfessional, setSelectedProfessional] = useState("")
  const [menu, setMenu] = useState(false)
  const [help, setHelp] = useState(false)
  useEffect(() => {
    fetch("/api/data")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return
        if (Array.isArray(data.appointments)) setAppointments(data.appointments)
        if (Array.isArray(data.clients)) setClients(data.clients)
        if (Array.isArray(data.team)) setTeam(data.team)
      })
      .catch(() => {})

    let es: EventSource | null = null
    try {
      es = new EventSource("/api/events")
      es.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          if (Array.isArray(payload.appointments))
            setAppointments(payload.appointments)
          if (Array.isArray(payload.clients)) setClients(payload.clients)
          if (Array.isArray(payload.team)) setTeam(payload.team)
        } catch {}
      }
    } catch {}

    const storageListener = (e: StorageEvent) => {
      if (e.key === "fred-appointments" && e.newValue) {
        try {
          setAppointments(JSON.parse(e.newValue))
        } catch {}
      }
      if (e.key === "fred-clients" && e.newValue) {
        try {
          setClients(JSON.parse(e.newValue))
        } catch {}
      }
      if (e.key === "fred-team" && e.newValue) {
        try {
          setTeam(JSON.parse(e.newValue))
        } catch {}
      }
    }
    window.addEventListener("storage", storageListener)
    return () => {
      if (es) es.close()
      window.removeEventListener("storage", storageListener)
    }
  }, [])
  function handleAddAppointment(appointment: Appointment) {
    setAppointments((prev) => [...prev, appointment])
    fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment),
    }).catch(() => {})
  }
  function handleUpdateAppointment(id: string, update: Partial<Appointment>) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...update } : a)),
    )
    fetch(`/api/appointments/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    }).catch(() => {})
  }
  function handleAddClient(client: Client) {
    setClients((prev) => [...prev, client])
    fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    }).catch(() => {})
  }
  function handleUpdateClient(id: string, update: Partial<Client>) {
    const previousName = clients.find((c) => c.id === id)?.name
    if (update.name && previousName) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.name === previousName ? { ...a, name: update.name! } : a,
        ),
      )
    }
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...update } : c)),
    )
    fetch(`/api/clients/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    }).catch(() => {})
  }
  function handleAddProfessional(professional: Professional) {
    setTeam((prev) => [...prev, professional])
    fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(professional),
    }).catch(() => {})
  }
  useEffect(() => {
    const listener = () => {
      setPage(readRoute())
      setMenu(false)
      window.scrollTo(0, 0)
    }
    window.addEventListener("hashchange", listener)
    return () => window.removeEventListener("hashchange", listener)
  }, [])
  useEffect(() => {
    localStorage.setItem("fred-appointments", JSON.stringify(appointments))
  }, [appointments])
  useEffect(() => {
    localStorage.setItem("fred-clients", JSON.stringify(clients))
  }, [clients])
  useEffect(() => {
    localStorage.setItem("fred-team", JSON.stringify(team))
  }, [team])
  useEffect(() => {
    if (!publicPages.includes(page) && !session)
      navigate(
        page === "agendamento" && readPerfil() !== "cabeleireiro"
          ? "entrar"
          : "equipe",
      )
    else if (adminPages.includes(page) && session?.role !== "admin")
      navigate(session?.role === "client" ? "agendamento" : "agenda")
    else if (
      ["agenda", "clientes", "perfil"].includes(page) &&
      session?.role === "client"
    )
      navigate("agendamento")
    else if (page === "agendamento" && session && session.role !== "client")
      navigate("agenda")
    document.title = `Fred Cabeleireiros · ${
      page === "inicio" ? "Seu melhor estilo" : page.replace(/-/g, " ")
    }`
  }, [page, session])
  function navigate(target: string) {
    setMenu(false)
    if (location.hash === `#${target}`) {
      setPage(target)
      window.scrollTo(0, 0)
    } else location.hash = target
  }
  function book(service?: string, professional?: string) {
    setSelectedService(service || "")
    setSelectedProfessional(professional || "")
    navigate(
      session?.role === "client"
        ? "agendamento"
        : readPerfil() === "cabeleireiro"
          ? "equipe"
          : "entrar",
    )
  }
  function login(value: Session) {
    setSession(value)
    sessionStorage.setItem("fred-session", JSON.stringify(value))
    navigate(
      value.role === "client"
        ? "agendamento"
        : value.role === "admin"
          ? "painel"
          : "agenda",
    )
  }
  function logout() {
    setSession(null)
    sessionStorage.removeItem("fred-session")
    navigate("inicio")
  }
  function scrollSection(id: string) {
    setMenu(false)
    if (page === "inicio")
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    else {
      navigate("inicio")
      setTimeout(
        () =>
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
        60,
      )
    }
  }
  const internal =
    !publicPages.includes(page) && page !== "novo-funcionario" && !!session
  const adminShell = internal && page !== "agendamento"
  const isAdmin = session?.role === "admin"
  const sidebar = isAdmin
    ? [
        ["painel", "Visão geral", "chart"],
        ["agenda", "Agendamentos", "calendar"],
        ["clientes", "Clientes", "users"],
        ["funcionarios", "Funcionários", "scissors"],
        ["financeiro", "Financeiro", "wallet"],
      ]
    : [
        ["agenda", "Agenda", "calendar"],
        ["clientes", "Clientes", "users"],
        ["perfil", "Meu perfil", "user"],
      ]
  const publicProps = { navigate, book, team }
  const canRender =
    publicPages.includes(page) ||
    (!!session &&
      (adminPages.includes(page)
        ? isAdmin
        : page === "agendamento"
          ? session.role === "client"
          : session.role !== "client"))
  return (
    <>
      <a
        href="#conteudo"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById("conteudo")?.focus()
        }}
      >
        Pular para o conteúdo
      </a>
      <header className={`site-header ${internal ? "internal-header" : ""}`}>
        <div
          className={internal ? "header-content" : "container header-content"}
        >
          <Brand onClick={() => navigate("inicio")} />
          {internal ? (
            <>
              <span className="header-area">
                {page === "agendamento"
                  ? "Área do cliente"
                  : isAdmin
                    ? "Painel administrativo"
                    : "Área do funcionário"}
              </span>
              <div className="header-user">
                <Button
                  variant="icon"
                  aria-label="Ajuda"
                  onClick={() => setHelp(true)}
                >
                  ?
                </Button>
                <span className="avatar">
                  {session?.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div>
                  <strong>{session?.name}</strong>
                  <Button variant="link" onClick={logout}>
                    Sair
                  </Button>
                </div>
                {adminShell && (
                  <Button
                    variant="icon"
                    className="menu-toggle"
                    aria-label="Abrir navegação"
                    aria-expanded={menu}
                    onClick={() => setMenu(!menu)}
                  >
                    <Icon name={menu ? "close" : "menu"} />
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <nav
                className={`public-nav ${menu ? "nav-open" : ""}`}
                aria-label="Navegação principal"
              >
                <button
                  className={page === "inicio" ? "active" : ""}
                  onClick={() => navigate("inicio")}
                >
                  Início
                </button>
                <button onClick={() => scrollSection("sobre")}>Sobre</button>
                <button
                  className={page === "servicos" ? "active" : ""}
                  onClick={() =>
                    page === "inicio"
                      ? scrollSection("servicos")
                      : navigate("servicos")
                  }
                >
                  Serviços
                </button>
                <button onClick={() => scrollSection("profissionais")}>
                  Profissionais
                </button>
                <button
                  className={page === "contato" ? "active" : ""}
                  onClick={() => navigate("contato")}
                >
                  Contato
                </button>
                <button
                  className="mobile-login"
                  onClick={() =>
                    navigate(
                      readPerfil() === "cabeleireiro" ? "equipe" : "entrar",
                    )
                  }
                >
                  Entrar
                </button>
              </nav>
              <div className="header-actions">
                <Button
                  variant="link"
                  className="header-login"
                  onClick={() =>
                    navigate(
                      session?.role === "client"
                        ? "agendamento"
                        : session
                          ? session.role === "admin"
                            ? "painel"
                            : "agenda"
                          : readPerfil() === "cabeleireiro"
                            ? "equipe"
                            : "entrar",
                    )
                  }
                >
                  <Icon name="user" size={16} />
                  {session ? "Minha área" : "Entrar"}
                </Button>
                <Button onClick={() => book()}>
                  <Icon name="calendar" size={16} />
                  <span>Agendar horário</span>
                </Button>
                <Button
                  variant="icon"
                  className="menu-toggle"
                  aria-label="Abrir menu"
                  aria-expanded={menu}
                  onClick={() => setMenu(!menu)}
                >
                  <Icon name={menu ? "close" : "menu"} />
                </Button>
              </div>
            </>
          )}
        </div>
      </header>
      <div
        id="conteudo"
        tabIndex={-1}
        className={adminShell ? "admin-layout" : ""}
      >
        {adminShell && (
          <aside className={`sidebar ${menu ? "sidebar-open" : ""}`}>
            <div>
              <span className="sidebar-label">
                {isAdmin ? "ADMINISTRAÇÃO" : "FUNCIONÁRIO"}
              </span>
              <nav aria-label="Navegação da área interna">
                {sidebar.map(([target, label, icon]) => (
                  <button
                    key={target}
                    className={page === target ? "active" : ""}
                    onClick={() => navigate(target)}
                  >
                    <Icon name={icon} size={19} />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="sidebar-bottom">
              <Icon name="scissors" size={22} />
              <strong>
                Seu estilo.
                <br />
                Nosso cuidado.
              </strong>
              <Button variant="dark" onClick={logout}>
                <Icon name="logout" size={16} />
                Sair da conta
              </Button>
            </div>
          </aside>
        )}
        {canRender &&
          (page === "inicio" ? (
            <Home {...publicProps} />
          ) : page === "servicos" ? (
            <ServicesPage {...publicProps} />
          ) : page === "contato" ? (
            <ContactPage />
          ) : [
              "entrar",
              "cadastro",
              "recuperar-senha",
              "equipe",
              "novo-funcionario",
            ].includes(page) ? (
            <AuthPages
              key={page}
              page={page}
              navigate={navigate}
              login={login}
              addProfessional={handleAddProfessional}
              addClient={handleAddClient}
              clients={clients}
              perfil={readPerfil()}
            />
          ) : page === "agendamento" && session ? (
            <BookingPage
              session={session}
              team={team}
              selectedService={selectedService}
              selectedProfessional={selectedProfessional}
              appointments={appointments}
              addAppointment={handleAddAppointment}
            />
          ) : session ? (
            <AdminPages
              key={page}
              page={page}
              session={session}
              navigate={navigate}
              appointments={appointments}
              clients={clients}
              team={team}
              updateAppointment={handleUpdateAppointment}
              updateClient={handleUpdateClient}
            />
          ) : null)}
      </div>
      {["inicio", "servicos", "contato"].includes(page) && (
        <footer className="site-footer">
          <div className="container footer-top">
            <Brand onClick={() => navigate("inicio")} />
            <p>Beleza que valoriza quem você é.</p>
            <div>
              <Button variant="dark" onClick={() => navigate("contato")}>
                Fale com a gente <Icon name="arrow" size={16} />
              </Button>
            </div>
          </div>
          <div className="container footer-bottom">
            <small>
              Fred Cabeleireiros © {new Date().getFullYear()} · Todos os
              direitos reservados
            </small>
            <small>Rua Principal, 123 - Centro · (11) 98765-4321</small>
            <Button variant="link" onClick={() => navigate("equipe")}>
              Área da equipe <Icon name="arrow" size={13} />
            </Button>
          </div>
        </footer>
      )}
      {help && (
        <Modal title="Como podemos ajudar?" onClose={() => setHelp(false)}>
          <p>
            {session?.role === "client"
              ? "Selecione um serviço e um profissional. Depois, escolha uma data e um horário livre e confirme seu agendamento."
              : "Acompanhe a agenda, selecione um atendimento para ver seus detalhes e atualize o status. Para cancelar, informe um motivo e confirme a ação."}
          </p>
          <p className="muted">
            Para dúvidas ou agendamentos especiais, entre em contato direto com
            nossa equipe pelo canal oficial de atendimento.
          </p>
          <a
            href="https://wa.me/5511987654321"
            target="_blank"
            rel="noreferrer"
            className="button button-outline"
          >
            <Icon name="phone" size={16} />
            WhatsApp do salão
          </a>
        </Modal>
      )}
    </>
  )
}
