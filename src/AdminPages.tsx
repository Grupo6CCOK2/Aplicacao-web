import { useState } from "react"
import {
  displayDate,
  localDate,
  money,
  services,
  today,
  type Appointment,
  type Client,
  type Professional,
  type Session,
} from "./data"
import {
  Alert,
  Badge,
  Button,
  Card,
  Eyebrow,
  Field,
  Icon,
  Modal,
  Select,
  Textarea,
} from "./ui"

type Props = {
  page: string
  navigate: (page: string) => void
  session: Session
  appointments: Appointment[]
  updateAppointment: (id: string, update: Partial<Appointment>) => void
  clients: Client[]
  updateClient: (id: string, update: Partial<Client>) => void
  team: Professional[]
}
const serviceName = (id: string) =>
  services.find((s) => s.id === id)?.name || id
export default function AdminPages(props: Props) {
  const {
    page,
    navigate,
    appointments,
    updateAppointment,
    clients,
    updateClient,
    team,
    session,
  } = props
  const [date, setDate] = useState(today())
  const [professional, setProfessional] = useState("")
  const [applied, setApplied] = useState({ date: today(), professional: "" })
  const [status, setStatus] = useState("Todos")
  const [selectedId, setSelectedId] = useState(appointments[0]?.id || "")
  const [reason, setReason] = useState("")
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [search, setSearch] = useState("")
  const [active, setActive] = useState("Todos")
  const [modalClient, setModalClient] = useState<Client | null>(null)
  const [clientAction, setClientAction] = useState("history")
  const [pageNumber, setPageNumber] = useState(1)
  const [period, setPeriod] = useState("Mensal")
  const [savedNotice, setSavedNotice] = useState("")
  const selected = appointments.find((a) => a.id === selectedId)
  const employeeProfessional =
    team.find((p) => p.name === session.name)?.id || "carla"
  const isEmployee = session.role === "employee"
  const visibleAppointments = appointments
    .filter(
      (a) =>
        a.date === (page === "painel" ? applied.date : date) &&
        (!isEmployee || a.professional === employeeProfessional) &&
        (!(page === "painel" ? applied.professional : professional) ||
          a.professional ===
            (page === "painel" ? applied.professional : professional)) &&
        (status === "Todos" || a.status === status),
    )
    .sort((a, b) => a.time.localeCompare(b.time))
  const scopeClients = isEmployee
    ? clients.filter((c) =>
        appointments.some(
          (a) => a.name === c.name && a.professional === employeeProfessional,
        ),
      )
    : clients
  const filteredClients = scopeClients.filter(
    (c) =>
      `${c.name} ${c.phone}`.toLowerCase().includes(search.toLowerCase()) &&
      (active === "Todos" || (active === "Ativo" ? c.active : !c.active)),
  )
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / 4))
  const clientsPage = filteredClients.slice(
    (Math.min(pageNumber, totalPages) - 1) * 4,
    Math.min(pageNumber, totalPages) * 4,
  )
  const heading =
    page === "painel"
      ? "Visão geral"
      : page === "agenda"
        ? "Agenda Diária"
        : page === "clientes"
          ? "Clientes"
          : page === "financeiro"
            ? "Painel financeiro"
            : page === "funcionarios"
              ? "Funcionários"
              : "Meu perfil"
  function cancel() {
    if (!selected || !reason.trim()) return
    updateAppointment(selected.id, {
      status: "Cancelado",
      reason: reason.trim(),
      canceledAt: new Date().toISOString(),
    })
    setCancelConfirm(false)
    setReason("")
    setSavedNotice("Agendamento cancelado. Motivo registrado na demonstração.")
  }
  function exportClients() {
    const rows = [
      ["Cliente", "WhatsApp", "E-mail", "Visitas", "Status"],
      ...filteredClients.map((c) => [
        c.name,
        c.phone,
        c.email,
        String(c.visits),
        c.active ? "Ativo" : "Inativo",
      ]),
    ]
    const csv =
      "\ufeff" +
      rows
        .map((row) =>
          row
            .map((v) => `"${v.replace(/^[=+@-]/, "'$&").replace(/"/g, '""')}"`)
            .join(";"),
        )
        .join("\n")
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    )
    const link = document.createElement("a")
    link.href = url
    link.download = "fred-clientes.csv"
    link.click()
    URL.revokeObjectURL(url)
  }
  function appointmentTable() {
    return (
      <Card className="table-card">
        <div className="table-title">
          <h3>
            {page === "painel"
              ? "Agendamentos do dia"
              : `${visibleAppointments.length} atendimentos`}
          </h3>
          {page === "painel" && (
            <Button variant="link" onClick={() => navigate("agenda")}>
              Ver agenda <Icon name="arrow" size={14} />
            </Button>
          )}
        </div>
        <div className="table-scroll">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Horário</th>
                <th>Cliente</th>
                {!isEmployee && <th>Profissional</th>}
                <th>Serviço</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Detalhes</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleAppointments.map((a) => (
                <tr
                  key={a.id}
                  className={selectedId === a.id ? "selected-row" : ""}
                >
                  <td data-label="Horário">
                    <strong>{a.time}</strong>
                  </td>
                  <td data-label="Cliente">
                    <span className="table-person">
                      <span className="avatar">
                        {a.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                      <strong>{a.name}</strong>
                    </span>
                  </td>
                  {!isEmployee && (
                    <td data-label="Profissional">
                      {team.find((p) => p.id === a.professional)?.name}
                    </td>
                  )}
                  <td data-label="Serviço">{serviceName(a.service)}</td>
                  <td data-label="Status">
                    <Badge>{a.status}</Badge>
                  </td>
                  <td data-label="Detalhes">
                    <Button
                      variant="icon"
                      aria-label={`Ver atendimento de ${a.name}`}
                      onClick={() => {
                        setSelectedId(a.id)
                        setReason("")
                      }}
                    >
                      <Icon name="right" size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleAppointments.length && (
            <div className="empty-state">
              <Icon name="calendar" size={32} />
              <h3>Nenhum atendimento por aqui.</h3>
              <p>Experimente outra data ou profissional.</p>
            </div>
          )}
        </div>
        {page === "agenda" && (
          <div className="table-footer">
            <Icon name="clock" size={16} />
            <small>13:00–14:00 · Intervalo ilustrativo</small>
          </div>
        )}
      </Card>
    )
  }
  function details() {
    if (!selected || !visibleAppointments.some((a) => a.id === selected.id))
      return (
        <Card className="detail-card">
          <Icon name="calendar" size={30} />
          <h3>Detalhes do Atendimento</h3>
          <p className="muted">
            Selecione um atendimento para ver os detalhes.
          </p>
        </Card>
      )
    return (
      <Card className="detail-card">
        <Eyebrow>
          {page === "painel"
            ? "GESTÃO DE ATENDIMENTOS"
            : "ATENDIMENTO SELECIONADO"}
        </Eyebrow>
        <h3>
          {page === "painel" ? "Cancelar horário" : "Detalhes do Atendimento"}
        </h3>
        <div className="detail-person">
          <span className="avatar avatar-large">
            {selected.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div>
            <strong>{selected.name}</strong>
            <small>
              {clients.find((c) => c.name === selected.name)?.phone ||
                "Telefone não informado"}
            </small>
          </div>
        </div>
        <hr />
        <dl>
          <div>
            <dt>Horário</dt>
            <dd>
              {displayDate(selected.date)} · {selected.time}
            </dd>
          </div>
          <div>
            <dt>Serviço</dt>
            <dd>{serviceName(selected.service)}</dd>
          </div>
          <div>
            <dt>Valor</dt>
            <dd>
              {money(
                services.find((s) => s.id === selected.service)?.price || 0,
              )}
            </dd>
          </div>
        </dl>
        {page === "agenda" && (
          <>
            <Textarea
              label="Observação"
              value={selected.note}
              onChange={(e) =>
                updateAppointment(selected.id, { note: e.target.value })
              }
              placeholder="Anotações sobre o atendimento"
            />
            <Select
              label="Status"
              value={selected.status}
              disabled={selected.status === "Cancelado"}
              onChange={(e) =>
                updateAppointment(selected.id, { status: e.target.value })
              }
            >
              {[
                "Confirmado",
                "Aguardando",
                "Em atendimento",
                "Concluído",
                ...(selected.status === "Cancelado" ? ["Cancelado"] : []),
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
            <small className="muted">
              Alterações salvas automaticamente neste navegador.
            </small>
          </>
        )}
        {selected.status === "Cancelado" ? (
          <Alert>
            <strong>Cancelamento registrado</strong>
            <p>{selected.reason}</p>
          </Alert>
        ) : (
          <div className="cancel-box">
            <h4>Cancelar agendamento</h4>
            <Textarea
              label="Motivo do cancelamento"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Conte o motivo do cancelamento"
            />
            <Button
              variant="outline"
              className="full"
              disabled={!reason.trim()}
              onClick={() => setCancelConfirm(true)}
            >
              Cancelar com motivo
            </Button>
          </div>
        )}
      </Card>
    )
  }
  return (
    <main className="admin-main">
      <div className="section-heading">
        <div>
          <Eyebrow>
            {isEmployee ? "SEU DIA, ORGANIZADO" : "ADMINISTRAÇÃO"}
          </Eyebrow>
          <h1>{heading}</h1>
          <p className="muted">
            {page === "painel"
              ? "Um olhar claro sobre o dia a dia do salão."
              : page === "agenda"
                ? "Mais organização. Mais tempo para cuidar."
                : page === "clientes"
                  ? "Cada cliente, uma história com a gente."
                  : page === "financeiro"
                    ? "Resultados e repasses em um só lugar."
                    : "Sua equipe faz a diferença."}
          </p>
        </div>
        {page === "clientes" ? (
          <Button variant="outline" onClick={exportClients}>
            <Icon name="arrow" size={16} /> Exportar lista
          </Button>
        ) : page === "funcionarios" ? (
          <Button onClick={() => navigate("novo-funcionario")}>
            + Cadastrar Funcionário
          </Button>
        ) : page === "agenda" ? (
          <div className="date-controls">
            <Button variant="outline" onClick={() => setDate(today())}>
              Hoje
            </Button>
            <Field
              label="Data da agenda"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => {
                const next = new Date(`${date}T12:00:00`)
                next.setDate(next.getDate() + 1)
                setDate(localDate(next))
              }}
            >
              Próximo dia
            </Button>
          </div>
        ) : (
          <span className="demo-label">DADOS DEMONSTRATIVOS</span>
        )}
      </div>
      {savedNotice && <Alert kind="success">{savedNotice}</Alert>}
      {page === "painel" && (
        <>
          <Card className="filter-bar">
            <Field
              label="Data"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Select
              label="Profissional"
              value={professional}
              onChange={(e) => setProfessional(e.target.value)}
            >
              <option value="">Todos os profissionais</option>
              {team.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
            <Button onClick={() => setApplied({ date, professional })}>
              Aplicar filtros
            </Button>
            <Button
              variant="link"
              onClick={() => {
                setDate(today())
                setProfessional("")
                setApplied({ date: today(), professional: "" })
              }}
            >
              Limpar
            </Button>
          </Card>
          <div className="kpi-grid">
            {[
              [
                "Total atendimentos",
                String(visibleAppointments.length),
                "calendar",
                displayDate(applied.date),
              ],
              [
                "Taxa de ocupação",
                `${Math.round((visibleAppointments.filter((a) => a.status !== "Cancelado").reduce((total, a) => total + (services.find((s) => s.id === a.service)?.duration || 0), 0) / ((applied.professional ? 1 : team.length) * 600)) * 100)}%`,
                "chart",
                "Tempo reservado no dia",
              ],
              [
                "Cancelamentos no mês",
                String(
                  appointments.filter(
                    (a) =>
                      a.status === "Cancelado" &&
                      a.date.slice(0, 7) === applied.date.slice(0, 7) &&
                      (!applied.professional ||
                        a.professional === applied.professional),
                  ).length,
                ),
                "clock",
                "No mês selecionado",
              ],
              [
                "Novos clientes",
                String(clients.filter((c) => c.visits === 0).length),
                "users",
                "Novos cadastros locais",
              ],
            ].map(([label, value, icon, foot]) => (
              <Card className="kpi" key={label}>
                <div>
                  <span>{label}</span>
                  <Icon name={icon} size={20} />
                </div>
                <strong>{value}</strong>
                <small>{foot}</small>
              </Card>
            ))}
          </div>
          <div className="analysis-grid">
            <Card>
              <div className="section-heading">
                <h3>Atendimentos por Dia da Semana</h3>
                <span className="demo-label">EXEMPLO</span>
              </div>
              <div className="bar-chart">
                {[
                  ["Ter", 18],
                  ["Qua", 26],
                  ["Qui", 22],
                  ["Sex", 34],
                  ["Sáb", 42],
                ].map(([day, value]) => (
                  <div className="bar-column" key={day}>
                    <span>{value}</span>
                    <div className={`chart-bar chart-bar-${value}`} />
                    <small>{day}</small>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3>Ocupação por profissional</h3>
              <p className="muted">Indicadores ilustrativos</p>
              {team.slice(0, 4).map((p, i) => (
                <div className="occupancy" key={p.id}>
                  <div>
                    <span>{p.name}</span>
                    <strong>{[92, 84, 76, 68][i]}%</strong>
                  </div>
                  <progress
                    max="100"
                    value={[92, 84, 76, 68][i]}
                    aria-label={`Ocupação ilustrativa de ${p.name}`}
                  />
                </div>
              ))}
            </Card>
          </div>
          <div className="operations-grid">
            {appointmentTable()}
            {details()}
          </div>
        </>
      )}
      {page === "agenda" && (
        <>
          <div className="pills">
            {[
              "Todos",
              "Confirmado",
              "Em atendimento",
              "Concluído",
              "Cancelado",
            ].map((s) => (
              <Button
                variant="outline"
                key={s}
                className={status === s ? "selected" : ""}
                onClick={() => setStatus(s)}
              >
                {s}
              </Button>
            ))}
          </div>
          {!isEmployee && (
            <div className="agenda-professional">
              <Select
                label="Profissional"
                value={professional}
                onChange={(e) => setProfessional(e.target.value)}
              >
                <option value="">Toda a equipe</option>
                {team.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <div className="operations-grid">
            {appointmentTable()}
            {details()}
          </div>
        </>
      )}
      {page === "clientes" && (
        <>
          <Card className="filter-bar client-search">
            <Field
              label="Buscar cliente"
              type="search"
              placeholder="Pesquisar por nome ou WhatsApp..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPageNumber(1)
              }}
            />
            <Select
              label="Status"
              value={active}
              onChange={(e) => {
                setActive(e.target.value)
                setPageNumber(1)
              }}
            >
              {["Todos", "Ativo", "Inativo"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
            <Button onClick={() => setPageNumber(1)}>
              <Icon name="search" size={16} />
              Buscar
            </Button>
          </Card>
          <Card className="table-card">
            <div className="table-title">
              <h3>{filteredClients.length} clientes</h3>
              <small>
                Página {Math.min(pageNumber, totalPages)} de {totalPages}
              </small>
            </div>
            <div className="table-scroll">
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>WhatsApp</th>
                    <th>E-mail</th>
                    <th>Visitas</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientsPage.map((c) => (
                    <tr key={c.id}>
                      <td data-label="Cliente">
                        <span className="table-person">
                          <span className="avatar">
                            {c.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                          <strong>{c.name}</strong>
                        </span>
                      </td>
                      <td data-label="WhatsApp">{c.phone}</td>
                      <td data-label="E-mail">{c.email}</td>
                      <td data-label="Visitas">{c.visits}</td>
                      <td data-label="Status">
                        <Badge>{c.active ? "Ativo" : "Inativo"}</Badge>
                      </td>
                      <td data-label="Ações">
                        <div className="table-actions">
                          <Button
                            variant="link"
                            onClick={() => {
                              setModalClient(c)
                              setClientAction("history")
                            }}
                          >
                            Histórico
                          </Button>
                          {!isEmployee && (
                            <>
                              <Button
                                variant="link"
                                onClick={() => {
                                  setModalClient(c)
                                  setClientAction("edit")
                                }}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="link"
                                onClick={() => {
                                  setModalClient(c)
                                  setClientAction("toggle")
                                }}
                              >
                                {c.active ? "Inativar" : "Ativar"}
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredClients.length && (
                <div className="empty-state">
                  <h3>Nenhum cliente encontrado.</h3>
                  <p>Tente outro nome ou telefone.</p>
                </div>
              )}
            </div>
            <div className="table-footer">
              <span>{filteredClients.length} resultados</span>
              <div>
                <Button
                  variant="icon"
                  aria-label="Página anterior"
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber((n) => n - 1)}
                >
                  <Icon name="left" size={16} />
                </Button>
                <span>{Math.min(pageNumber, totalPages)}</span>
                <Button
                  variant="icon"
                  aria-label="Próxima página"
                  disabled={pageNumber >= totalPages}
                  onClick={() => setPageNumber((n) => n + 1)}
                >
                  <Icon name="right" size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
      {page === "financeiro" && (
        <>
          <Card className="filter-bar">
            <Select
              label="Período de exemplo"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>Mensal</option>
              <option>Quinzenal</option>
            </Select>
            <p className="muted">
              Layout provisório conforme o MD. Todos os valores abaixo são
              ilustrativos.
            </p>
          </Card>
          <div className="kpi-grid">
            {[
              [
                "Faturamento bruto",
                money(period === "Mensal" ? 14850 : 7425),
                "wallet",
              ],
              [
                "Faturamento líquido",
                money(period === "Mensal" ? 8910 : 4455),
                "chart",
              ],
              ["Ticket médio", money(104.5), "scissors"],
              [
                "Serviços realizados",
                period === "Mensal" ? "142" : "71",
                "check",
              ],
            ].map(([label, value, icon]) => (
              <Card className="kpi" key={label}>
                <div>
                  <span>{label}</span>
                  <Icon name={icon} />
                </div>
                <strong>{value}</strong>
                <small>Exemplo · fechamento {period.toLowerCase()}</small>
              </Card>
            ))}
          </div>
          <div className="analysis-grid">
            <Card>
              <h3>Meios de pagamento</h3>
              <div className="payment-grid">
                {[
                  ["PIX", "58%"],
                  ["Cartão", "34%"],
                  ["Dinheiro", "8%"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <Icon name="wallet" size={24} />
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3>Resumo do período</h3>
              <p className="muted">
                Valores exemplificativos, sem movimentações financeiras reais.
              </p>
              <dl>
                <div>
                  <dt>Comissões ilustrativas</dt>
                  <dd>40%</dd>
                </div>
                <div>
                  <dt>Próximo fechamento</dt>
                  <dd>
                    {period === "Mensal" ? "Último dia do mês" : "Dia 15"}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
          <Card className="table-card">
            <div className="table-title">
              <h3>Extrato de repasses e comissões</h3>
              <span className="demo-label">EXEMPLO</span>
            </div>
            <div className="table-scroll">
              <table className="responsive-table">
                <thead>
                  <tr>
                    {[
                      "Profissional",
                      "Serviços realizados",
                      "Faturamento gerado",
                      "Comissão",
                      "Valor a repassar",
                      "Status",
                    ].map((label) => (
                      <th key={label}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {team.slice(0, 3).map((p, i) => {
                    const factor = period === "Mensal" ? 1 : 0.5
                    const revenue = [4800, 5250, 4800][i] * factor
                    return (
                      <tr key={p.id}>
                        <td data-label="Profissional">
                          <strong>{p.name}</strong>
                        </td>
                        <td data-label="Serviços realizados">
                          {Math.round([60, 44, 38][i] * factor)}
                        </td>
                        <td data-label="Faturamento">{money(revenue)}</td>
                        <td data-label="Comissão">40%</td>
                        <td data-label="Valor a repassar">
                          <strong>{money(revenue * 0.4)}</strong>
                        </td>
                        <td data-label="Status">
                          <Badge>Aguardando</Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
      {page === "funcionarios" && (
        <div className="staff-grid">
          {team.map((p) => (
            <Card key={p.id}>
              <img
                className="staff-avatar"
                src={p.image}
                alt={`Retrato ilustrativo de ${p.name}`}
              />
              <Badge>Ativo</Badge>
              <h3>{p.name}</h3>
              <p className="muted">{p.specialty}</p>
              <Button
                variant="outline"
                onClick={() => {
                  navigate("agenda")
                }}
              >
                Ver agenda <Icon name="calendar" size={16} />
              </Button>
            </Card>
          ))}
        </div>
      )}
      {page === "perfil" && (
        <Card className="profile-card">
          <span className="avatar avatar-large">
            {session.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </span>
          <h2>{session.name}</h2>
          <Badge>
            {session.role === "admin" ? "Administrador" : "Funcionário"}
          </Badge>
          <p>
            Perfil demonstrativo. A edição de credenciais depende da integração
            com o backend.
          </p>
          <Button variant="outline" onClick={() => navigate("agenda")}>
            Voltar à agenda
          </Button>
        </Card>
      )}
      {cancelConfirm && selected && (
        <Modal
          title="Confirmar cancelamento?"
          onClose={() => setCancelConfirm(false)}
        >
          <p>
            O atendimento de <strong>{selected.name}</strong> em{" "}
            {displayDate(selected.date)}, às {selected.time}, será cancelado.
          </p>
          <Card>
            <strong>Motivo</strong>
            <p>{reason}</p>
          </Card>
          <div className="form-actions">
            <Button variant="outline" onClick={() => setCancelConfirm(false)}>
              Manter agendamento
            </Button>
            <Button onClick={cancel}>Confirmar cancelamento</Button>
          </div>
        </Modal>
      )}
      {modalClient && (
        <Modal
          title={
            clientAction === "history"
              ? `Histórico de ${modalClient.name}`
              : clientAction === "edit"
                ? "Editar cliente"
                : `${
                    modalClient.active ? "Inativar" : "Ativar"
                  } ${modalClient.name}?`
          }
          onClose={() => setModalClient(null)}
        >
          {clientAction === "history" ? (
            <>
              {appointments
                .filter(
                  (a) =>
                    a.name === modalClient.name &&
                    (!isEmployee || a.professional === employeeProfessional),
                )
                .map((a) => (
                  <Card className="history-card" key={a.id}>
                    <div className="section-heading">
                      <h3>{serviceName(a.service)}</h3>
                      <Badge>{a.status}</Badge>
                    </div>
                    <p>
                      {displayDate(a.date)} · {a.time} ·{" "}
                      {team.find((p) => p.id === a.professional)?.name}
                    </p>
                    {a.note && <p>{a.note}</p>}
                  </Card>
                ))}
              <p className="muted">Histórico disponível na demonstração.</p>
            </>
          ) : clientAction === "edit" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const data = new FormData(e.currentTarget)
                updateClient(modalClient.id, {
                  name: String(data.get("name")),
                  phone: String(data.get("phone")),
                  email: String(data.get("email")),
                })
                setModalClient(null)
                setSavedNotice("Dados do cliente atualizados.")
              }}
            >
              <Field
                label="Nome"
                required
                name="name"
                defaultValue={modalClient.name}
              />
              <Field
                label="WhatsApp"
                required
                type="tel"
                name="phone"
                defaultValue={modalClient.phone}
              />
              <Field
                label="E-mail"
                required
                type="email"
                name="email"
                defaultValue={modalClient.email}
              />
              <Button type="submit">Salvar alterações</Button>
            </form>
          ) : (
            <>
              <p>
                A alteração mantém o histórico de agendamentos do cliente. O
                bloqueio de acesso real depende do backend.
              </p>
              <div className="form-actions">
                <Button variant="outline" onClick={() => setModalClient(null)}>
                  Voltar
                </Button>
                <Button
                  onClick={() => {
                    updateClient(modalClient.id, {
                      active: !modalClient.active,
                    })
                    setModalClient(null)
                  }}
                >
                  Confirmar {modalClient.active ? "inativação" : "ativação"}
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}
    </main>
  )
}
