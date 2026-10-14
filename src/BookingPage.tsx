import { useState } from "react"
import {
  displayDate,
  localDate,
  money,
  services,
  type Appointment,
  type Professional,
  type Session,
} from "./data"
import { Alert, Badge, Button, Card, Eyebrow, Icon, Modal, Select } from "./ui"

type Props = {
  session: Session
  team: Professional[]
  selectedService: string
  selectedProfessional: string
  appointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
}
export default function BookingPage({
  session,
  team,
  selectedService,
  selectedProfessional,
  appointments,
  addAppointment,
}: Props) {
  const [service, setService] = useState(selectedService || "men")
  const eligible = team.filter((p) => p.services.includes(service))
  const [professional, setProfessional] = useState(
    selectedProfessional || eligible[0]?.id || "",
  )
  const [month, setMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  )
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [confirmed, setConfirmed] = useState<Appointment | null>(null)
  const [history, setHistory] = useState(false)
  const [error, setError] = useState("")
  const selected = services.find((s) => s.id === service)!
  const person = team.find((p) => p.id === professional)
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const start = (month.getDay() + 6) % 7
  const slots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ]
  const now = new Date()
  function available(slot: string) {
    if (!date || !person) return false
    const target = new Date(`${date}T${slot}:00`)
    if (
      target.getTime() - now.getTime() < 2 * 60 * 60 * 1000 ||
      target.getHours() * 60 + target.getMinutes() + selected.duration > 19 * 60
    )
      return false
    return !appointments.some((a) => {
      if (
        a.professional !== professional ||
        a.date !== date ||
        a.status === "Cancelado"
      )
        return false
      const from = new Date(`${a.date}T${a.time}:00`).getTime()
      const duration = services.find((s) => s.id === a.service)?.duration || 60
      return (
        target.getTime() < from + duration * 60000 &&
        target.getTime() + selected.duration * 60000 > from
      )
    })
  }
  function confirm() {
    if (!available(time)) {
      setError("Este horário não está mais disponível. Escolha outro horário.")
      setTime("")
      return
    }
    const appointment: Appointment = {
      id: crypto.randomUUID(),
      name: session.name,
      professional,
      service,
      date,
      time,
      status: "Confirmado",
      note: "",
    }
    addAppointment(appointment)
    setConfirmed(appointment)
    setTime("")
    setError("")
  }
  function changeMonth(delta: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1))
  }
  return (
    <main className="surface-page booking-page">
      <div className="container">
        <div className="section-heading">
          <div>
            <Eyebrow>UM TEMPO PARA VOCÊ</Eyebrow>
            <h1>Agendar atendimento</h1>
            <p>
              Escolha o serviço, seu profissional favorito e o horário ideal
              para você.
            </p>
          </div>
          <Button variant="outline" onClick={() => setHistory(true)}>
            <Icon name="calendar" size={18} /> Meus agendamentos
          </Button>
        </div>
        <div className="stepper">
          {["Profissional e Serviço", "Data e Horário", "Confirmação"].map(
            (step, i) => (
              <div
                key={step}
                className={
                  i === (confirmed ? 2 : date && time ? 2 : 1) ? "current" : ""
                }
              >
                <span className="step-number">
                  {i === 0 && person ? <Icon name="check" size={16} /> : i + 1}
                </span>
                <div>
                  <strong>{step}</strong>
                  <small>
                    {i === 0
                      ? "Escolha quem cuida de você"
                      : i === 1
                        ? "Encontre seu melhor horário"
                        : "Revise e confirme"}
                  </small>
                </div>
              </div>
            ),
          )}
        </div>
        <div className="booking-grid">
          <Card>
            <Eyebrow>ETAPA 1</Eyebrow>
            <h3>Escolha o profissional</h3>
            <Select
              label="Serviço"
              value={service}
              onChange={(e) => {
                const value = e.target.value
                setService(value)
                setProfessional(
                  team.find((p) => p.services.includes(value))?.id || "",
                )
                setTime("")
                setConfirmed(null)
              }}
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
            <div
              className="professional-options"
              role="group"
              aria-label="Profissionais disponíveis"
            >
              {eligible.map((p) => (
                <button
                  className={`professional-option ${
                    p.id === professional ? "selected" : ""
                  }`}
                  key={p.id}
                  aria-pressed={p.id === professional}
                  onClick={() => {
                    setProfessional(p.id)
                    setTime("")
                    setConfirmed(null)
                  }}
                >
                  <img src={p.image} alt="" />
                  <div>
                    <strong>{p.name}</strong>
                    <small>{p.specialty}</small>
                    <Badge>Ativo</Badge>
                  </div>
                  {p.id === professional && <Icon name="check" size={18} />}
                </button>
              ))}
            </div>
            <small className="muted">
              Profissionais que realizam o serviço escolhido.
            </small>
          </Card>
          <Card className="calendar-card">
            <Eyebrow>ETAPA 2</Eyebrow>
            <h3>Escolha data e horário</h3>
            <div className="calendar-title">
              <Button
                variant="icon"
                aria-label="Mês anterior"
                disabled={
                  month <= new Date(now.getFullYear(), now.getMonth(), 1)
                }
                onClick={() => changeMonth(-1)}
              >
                <Icon name="left" size={16} />
              </Button>
              <strong>
                {month.toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </strong>
              <Button
                variant="icon"
                aria-label="Próximo mês"
                onClick={() => changeMonth(1)}
              >
                <Icon name="right" size={16} />
              </Button>
            </div>
            <div className="calendar-grid">
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
                <small key={day}>{day}</small>
              ))}
              {Array.from({ length: start }, (_, i) => (
                <span key={`blank-${i}`} />
              ))}
              {Array.from({ length: days }, (_, i) => {
                const d = new Date(month.getFullYear(), month.getMonth(), i + 1)
                const value = localDate(d)
                const disabled =
                  value < localDate(now) || d.getDay() === 0 || d.getDay() === 1
                return (
                  <button
                    key={i}
                    className={date === value ? "selected" : ""}
                    disabled={disabled}
                    aria-label={d.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                    aria-pressed={date === value}
                    onClick={() => {
                      setDate(value)
                      setTime("")
                      setConfirmed(null)
                    }}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
            <hr />
            <h4>Horários disponíveis</h4>
            {!date && (
              <p className="muted">
                Selecione uma data para consultar os horários.
              </p>
            )}
            <div className="time-grid">
              {slots.map((slot) => (
                <Button
                  variant="outline"
                  key={slot}
                  className={time === slot ? "selected" : ""}
                  disabled={!available(slot)}
                  aria-pressed={time === slot}
                  onClick={() => setTime(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
            <small className="muted">
              Agende com pelo menos 2 horas de antecedência.
            </small>
          </Card>
          <Card className="booking-summary">
            <Eyebrow>ETAPA 3</Eyebrow>
            <h3>Resumo do agendamento</h3>
            <div className="summary-icon">
              <Icon name="scissors" size={28} />
            </div>
            <dl>
              <div>
                <dt>Profissional</dt>
                <dd>{person?.name || "Selecione"}</dd>
              </div>
              <div>
                <dt>Serviço</dt>
                <dd>{selected.name}</dd>
              </div>
              <div>
                <dt>Data</dt>
                <dd>{date ? displayDate(date) : "Selecione"}</dd>
              </div>
              <div>
                <dt>Horário</dt>
                <dd>{time || "Selecione"}</dd>
              </div>
              <div>
                <dt>Duração</dt>
                <dd>{selected.duration} min</dd>
              </div>
              <div className="summary-total">
                <dt>Valor</dt>
                <dd>{money(selected.price)}</dd>
              </div>
            </dl>
            {error && <Alert kind="error">{error}</Alert>}
            <Button
              className="full button-lg"
              disabled={!time || !date || !person}
              onClick={confirm}
            >
              Confirmar agendamento <Icon name="check" size={16} />
            </Button>
            <small className="muted">
              Você está reservando um horário na demonstração.
            </small>
            {confirmed && (
              <Alert kind="success">
                <strong>Agendamento confirmado</strong>
                <p>
                  Tudo pronto! Seu{" "}
                  {services.find((s) => s.id === confirmed.service)?.name} com{" "}
                  {team.find((p) => p.id === confirmed.professional)?.name} está
                  marcado para {displayDate(confirmed.date)}, às{" "}
                  {confirmed.time}. Já reservamos sua cadeira e te esperamos com
                  um café!
                </p>
              </Alert>
            )}
          </Card>
        </div>
        <Alert>O horário fica reservado após a confirmação.</Alert>
      </div>
      {history && (
        <Modal title="Meus agendamentos" onClose={() => setHistory(false)}>
          {appointments.filter((a) => a.name === session.name).length ? (
            appointments
              .filter((a) => a.name === session.name)
              .map((a) => (
                <Card className="history-card" key={a.id}>
                  <div className="section-heading">
                    <h3>{services.find((s) => s.id === a.service)?.name}</h3>
                    <Badge>{a.status}</Badge>
                  </div>
                  <p>
                    {team.find((p) => p.id === a.professional)?.name} ·{" "}
                    {displayDate(a.date)} às {a.time}
                  </p>
                </Card>
              ))
          ) : (
            <div className="empty-state">
              <Icon name="calendar" size={40} />
              <h3>Seu próximo estilo está esperando.</h3>
              <p>Você ainda não tem agendamentos.</p>
              <Button onClick={() => setHistory(false)}>
                Agendar meu horário
              </Button>
            </div>
          )}
        </Modal>
      )}
    </main>
  )
}
