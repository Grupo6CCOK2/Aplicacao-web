import { useEffect, useState, type FormEvent } from "react"
import { type Client, type Professional, type Session } from "./data"
import {
  Alert,
  Brand,
  Button,
  Check,
  Eyebrow,
  Field,
  Icon,
  Modal,
  Select,
} from "./ui"

type Props = {
  page: string
  navigate: (page: string) => void
  login: (session: Session) => void
  addProfessional: (professional: Professional) => void
  addClient: (client: Client) => void
}
export default function AuthPages({
  page,
  navigate,
  login,
  addProfessional,
  addClient,
}: Props) {
  const register = page === "cadastro"
  const staff = page === "equipe"
  const employee = page === "novo-funcionario"
  const recovery = page === "recuperar-senha"
  const [dependent, setDependent] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [terms, setTerms] = useState(false)
  const [specialties, setSpecialties] = useState([
    "Corte",
    "Barba",
    "Coloração",
  ])
  const [addSpecialty, setAddSpecialty] = useState(false)
  const [newSpecialty, setNewSpecialty] = useState("")
  const [role, setRole] = useState<"employee" | "admin">("employee")
  useEffect(() => {
    if (!countdown) return
    const timer = setTimeout(() => setCountdown((n) => n - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])
  const title = register
    ? "Criar conta"
    : staff
      ? "Área do Funcionário"
      : employee
        ? "Cadastrar Funcionário"
        : recovery
          ? "Recuperar senha"
          : "Acessar minha conta"
  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ].filter(Boolean).length
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setError("")
    if (recovery) {
      setSent(true)
      setCountdown(60)
      return
    }
    if (register || employee) {
      if (password.length < 8) {
        setError("Use uma senha com pelo menos 8 caracteres.")
        return
      }
      if (password !== form.get("confirmation")) {
        setError("As senhas não coincidem. Verifique a confirmação.")
        return
      }
    }
    if (employee) {
      const selected = form.getAll("specialty").map(String)
      if (!selected.length) {
        setError("Selecione pelo menos uma especialidade.")
        return
      }
      const name = `${form.get("name")} ${form.get("surname")}`
      addProfessional({
        id: crypto.randomUUID(),
        name,
        specialty: selected.join(" · "),
        initials: name
          .split(" ")
          .map((s) => s[0])
          .slice(0, 2)
          .join(""),
        image: "/images/fred.jpg",
        services: selected.includes("Coloração")
          ? ["color", "women", "treatment"]
          : selected.includes("Corte")
            ? ["men", "women", "beard"]
            : ["beard"],
      })
      navigate("funcionarios")
      return
    }
    if (register) {
      addClient({
        id: crypto.randomUUID(),
        name: `${form.get("name")} ${form.get("surname")}`,
        email: String(form.get("email")),
        phone: String(form.get("phone")),
        birth: String(form.get("birth")),
        dependent: dependent ? String(form.get("dependent")) : undefined,
        visits: 0,
        active: true,
      })
    }
    login({
      name: register
        ? `${form.get("name")} ${form.get("surname")}`
        : staff
          ? role === "admin"
            ? "Fred"
            : "Carla Soares"
          : "Gabriel Costa",
      role: staff ? role : "client",
    })
  }
  return (
    <main className="auth-layout">
      <aside className="auth-welcome">
        <Brand onClick={() => navigate("inicio")} />
        <div className="auth-photo">
          <img
            src="/images/salon.jpg"
            alt="Interior ilustrativo de um salão de cabeleireiros"
          />
          <span>A EXPERIÊNCIA FRED</span>
        </div>
        <Eyebrow>
          {employee || staff
            ? "NOSSA EQUIPE, NOSSO TALENTO"
            : "SEU MOMENTO COMEÇA AQUI"}
        </Eyebrow>
        <h2>
          {register
            ? "Crie sua conta e agende em segundos, sem filas e com confirmação automática."
            : staff || employee
              ? "Organização para cuidar de quem importa."
              : "Bom ter você por aqui."}
        </h2>
        <p>
          {staff || employee
            ? "Uma agenda organizada. Mais tempo para cada cliente."
            : "Seu serviço favorito, com quem você confia, no horário que combina com você."}
        </p>
        <div className="welcome-foot">
          <Icon name="scissors" size={18} />
          <span>Seu estilo. Nosso cuidado.</span>
        </div>
      </aside>
      <section
        className={`auth-form ${register || employee ? "auth-form-wide" : ""}`}
      >
        <div className="auth-form-inner">
          {staff && <Alert>ACESSO RESTRITO À EQUIPE</Alert>}
          <Eyebrow>
            {register
              ? "BEM-VINDO AO FRED"
              : employee
                ? "NOVO TALENTO"
                : recovery
                  ? "VAMOS AJUDAR"
                  : "BEM-VINDO DE VOLTA"}
          </Eyebrow>
          <h1>{title}</h1>
          <p className="muted">
            {register
              ? "Um cadastro rápido para cuidar do seu próximo estilo."
              : recovery
                ? "Digite seu e-mail cadastrado para receber o link de redefinição."
                : employee
                  ? "Preencha os dados do novo integrante da equipe."
                  : "Entre para continuar a sua experiência."}
          </p>
          <form onSubmit={submit}>
            {(register || employee) && (
              <>
                {employee && <Eyebrow>DADOS BÁSICOS</Eyebrow>}
                <div className="form-grid">
                  <Field
                    label="Nome"
                    name="name"
                    required
                    autoComplete="given-name"
                    placeholder="Seu nome"
                  />
                  <Field
                    label="Sobrenome"
                    name="surname"
                    required
                    autoComplete="family-name"
                    placeholder="Seu sobrenome"
                  />
                </div>
                <div className="form-grid">
                  {register ? (
                    <Field
                      label="Data de nascimento"
                      name="birth"
                      required
                      type="date"
                      max={new Date().toISOString().slice(0, 10)}
                    />
                  ) : (
                    <Field
                      label="CPF"
                      name="cpf"
                      required
                      placeholder="XXX.XXX.XXX-XX"
                      pattern="[0-9.\\-]{11,14}"
                    />
                  )}
                  <Field
                    label={register ? "Telefone / WhatsApp" : "Telefone"}
                    type="tel"
                    name="phone"
                    required
                    placeholder="(11) 98765-4321"
                    pattern={"[\\d\\s\\(\\)\\+\\-]{10,20}"}
                    autoComplete="tel"
                  />
                </div>
                {register && (
                  <>
                    <small className="muted">
                      Vamos te enviar um lembrete do corte por aqui para você
                      não esquecer.
                    </small>
                    <Check
                      label="Adicionar dependente"
                      checked={dependent}
                      onChange={(e) => setDependent(e.target.checked)}
                    />
                    {dependent && (
                      <Field
                        label="Nome do dependente"
                        required
                        name="dependent"
                        placeholder="Nome completo"
                      />
                    )}
                  </>
                )}
                {employee && (
                  <>
                    <hr />
                    <Eyebrow>CREDENCIAIS DE ACESSO</Eyebrow>
                  </>
                )}
              </>
            )}
            <Field
              label={staff ? "E-mail / Usuário" : "E-mail"}
              name="email"
              type={staff ? "text" : "email"}
              required
              placeholder={staff ? "Seu e-mail ou usuário" : "voce@exemplo.com"}
              autoComplete="email"
            />
            {!recovery && (
              <div className={register || employee ? "form-grid" : ""}>
                <Field
                  label={employee ? "Senha temporária" : "Senha"}
                  required
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    register || employee ? "new-password" : "current-password"
                  }
                  placeholder="Sua senha"
                  minLength={register || employee ? 8 : undefined}
                />
                {(register || employee) && (
                  <Field
                    label="Confirmar senha"
                    required
                    name="confirmation"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repita sua senha"
                  />
                )}
              </div>
            )}
            {register && (
              <>
                <div
                  className="password-strength"
                  aria-label={`Força da senha: ${["Não informada", "Fraca", "Regular", "Boa", "Forte"][strength]}`}
                >
                  {[1, 2, 3, 4].map((n) => (
                    <span key={n} className={strength >= n ? "filled" : ""} />
                  ))}
                </div>
                <small className="muted">
                  Senha:{" "}
                  {
                    ["não informada", "fraca", "regular", "boa", "forte"][
                      strength
                    ]
                  }
                  . Use 8 caracteres ou mais.
                </small>
                <Check
                  required
                  label={
                    <>
                      Li e aceito os termos{" "}
                      <Button variant="link" onClick={() => setTerms(true)}>
                        Consultar
                      </Button>
                    </>
                  }
                />
              </>
            )}
            {employee && (
              <>
                <hr />
                <Eyebrow>ESPECIALIDADES *</Eyebrow>
                <div className="specialty-checks">
                  {specialties.map((s) => (
                    <Check label={s} name="specialty" value={s} key={s} />
                  ))}
                </div>
                <Button variant="link" onClick={() => setAddSpecialty(true)}>
                  + Adicionar especialidade
                </Button>
              </>
            )}
            {!register && !employee && !recovery && (
              <div className="login-options">
                {staff ? (
                  <span className="muted">
                    <Icon name="shield" size={14} /> Sessão demonstrativa
                  </span>
                ) : (
                  <Check label="Lembrar de mim" />
                )}
                <Button
                  variant="link"
                  onClick={() => navigate("recuperar-senha")}
                >
                  Esqueci minha senha
                </Button>
              </div>
            )}
            {staff && (
              <Select
                label="Perfil de demonstração"
                value={role}
                onChange={(e) => setRole(e.target.value as typeof role)}
              >
                <option value="employee">Funcionário</option>
                <option value="admin">Administrador</option>
              </Select>
            )}
            {error && <Alert kind="error">{error}</Alert>}
            <div className="form-actions">
              {employee && (
                <Button
                  variant="outline"
                  onClick={() => navigate("funcionarios")}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                className="full button-lg"
                disabled={recovery && countdown > 0}
              >
                {register
                  ? "Criar minha conta"
                  : employee
                    ? "Salvar"
                    : recovery
                      ? "Enviar link de recuperação"
                      : staff
                        ? "Acessar agenda"
                        : "Entrar"}
                <Icon name="arrow" size={18} />
              </Button>
            </div>
            {recovery && sent && (
              <>
                <Alert kind="success">
                  <strong>Solicitação demonstrativa registrada</strong>
                  <p>
                    Nenhum e-mail foi enviado. O link de recuperação depende da
                    integração com o backend.
                  </p>
                </Alert>
                <div className="login-options">
                  <small>
                    Reenviar em 00:{String(countdown).padStart(2, "0")}
                  </small>
                  <Button
                    variant="link"
                    disabled={countdown > 0}
                    onClick={() => {
                      setCountdown(60)
                      setSent(true)
                    }}
                  >
                    Reenviar
                  </Button>
                </div>
              </>
            )}
          </form>
          {!employee &&
            (recovery ? (
              <Button
                variant="outline"
                className="full"
                onClick={() => navigate("entrar")}
              >
                Voltar para o login
              </Button>
            ) : register ? (
              <p className="auth-bottom">
                Já tem uma conta?{" "}
                <Button variant="link" onClick={() => navigate("entrar")}>
                  Fazer login
                </Button>
              </p>
            ) : (
              !staff && (
                <>
                  <div className="divider">
                    <span>OU</span>
                  </div>
                  <Button
                    variant="outline"
                    className="full"
                    onClick={() => navigate("cadastro")}
                  >
                    Criar conta
                  </Button>
                  <p className="auth-bottom">
                    Ainda não tem conta? Cadastre-se em 1 minuto.
                  </p>
                </>
              )
            ))}
          <div className="demo-note">
            <Icon name="shield" size={16} />
            <span>
              Protótipo de front-end. Use dados fictícios.{" "}
              {recovery
                ? "Envio de e-mail não conectado."
                : "Acesso demonstrativo, sem autenticação real."}
            </span>
          </div>
        </div>
      </section>
      {terms && (
        <Modal
          title="Termos de uso — conteúdo pendente"
          onClose={() => setTerms(false)}
        >
          <p>
            Os termos de uso e a política de privacidade ainda precisam ser
            fornecidos pelo salão. Este cadastro é apenas uma demonstração; não
            use dados pessoais reais.
          </p>
          <Button onClick={() => setTerms(false)}>Entendi</Button>
        </Modal>
      )}
      {addSpecialty && (
        <Modal
          title="Adicionar especialidade"
          onClose={() => setAddSpecialty(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (
                newSpecialty.trim() &&
                !specialties.includes(newSpecialty.trim())
              )
                setSpecialties([...specialties, newSpecialty.trim()])
              setAddSpecialty(false)
              setNewSpecialty("")
            }}
          >
            <Field
              label="Nome da especialidade"
              required
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
            />
            <Button type="submit">Adicionar</Button>
          </form>
        </Modal>
      )}
    </main>
  )
}
