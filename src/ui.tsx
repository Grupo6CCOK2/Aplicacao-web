import {
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react"

type IconProps = {
  name: string
  size?: number
}
export function Icon({ name, size = 20 }: IconProps) {
  const paths: Record<string, ReactNode> = {
    arrow: (
      <>
        <path d="M4 12h16M14 6l6 6-6 6" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 11h18M8 15h2M14 15h2" />
      </>
    ),
    scissors: (
      <>
        <circle cx="5" cy="6" r="3" />
        <circle cx="5" cy="18" r="3" />
        <path d="m8 8 13 13M8 16 21 3M11 11l2 2" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3ZM20 2v4M18 4h4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    phone: (
      <path d="M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c0 2-2 3-4 2A22 22 0 0 1 3 7c-1-2 0-4 2-4Z" />
    ),
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 13a6 6 0 0 1 3 5v3" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18M7 16v-5M12 16V7M17 16v-8" />
      </>
    ),
    wallet: (
      <>
        <rect x="3" y="6" width="18" height="15" rx="2" />
        <path d="M3 8V4l14-2v4M21 12h-6v5h6" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    left: <path d="m15 5-7 7 7 7" />,
    right: <path d="m9 5 7 7-7 7" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    search: (
      <>
        <circle cx="10" cy="10" r="7" />
        <path d="m15 15 6 6" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H4v16h6M14 8l4 4-4 4M8 12h12" />
      </>
    ),
    heart: (
      <path d="M12 21S2 14 2 7a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 7-10 14-10 14Z" />
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.sparkle}
    </svg>
  )
}
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "link" | "dark" | "icon"
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={`button button-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
export function Field({
  label,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
}) {
  const id = useId()
  return (
    <label className="field" htmlFor={id}>
      <span>
        {label}
        {props.required && " *"}
      </span>
      <input id={id} {...props} />
      {hint && <small>{hint}</small>}
    </label>
  )
}
export function Select({
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  children: ReactNode
}) {
  const id = useId()
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} {...props}>
        {children}
      </select>
    </label>
  )
}
export function Textarea({
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const id = useId()
  return (
    <label className="field" htmlFor={id}>
      <span>
        {label}
        {props.required && " *"}
      </span>
      <textarea id={id} {...props} />
    </label>
  )
}
export function Check({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }) {
  return (
    <label className="checkbox">
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  )
}
export function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className="brand"
      onClick={onClick}
      aria-label="Fred Cabeleireiros — início"
    >
      <span>
        FRED<span className="brand-dot">.</span>
      </span>
      <small>CABELEIREIROS</small>
    </button>
  )
}
export function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`card ${className}`}>{children}</div>
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>
}
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className={`badge ${
        children === "Cancelado" || children === "Inativo"
          ? "badge-muted"
          : children === "Em atendimento" || children === "Aguardando"
            ? "badge-info"
            : "badge-success"
      }`}
    >
      {children}
    </span>
  )
}
export function Alert({
  children,
  kind = "info",
}: {
  children: ReactNode
  kind?: "info" | "success" | "error"
}) {
  return (
    <div
      className={`alert alert-${kind}`}
      role={kind === "error" ? "alert" : "status"}
    >
      <Icon name={kind === "success" ? "check" : "shield"} />
      <div>{children}</div>
    </div>
  )
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const id = useId()
  useEffect(() => {
    const previous = document.activeElement as HTMLElement
    const el = ref.current
    el?.focus()
    const old = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current()
      if (event.key === "Tab") {
        const focusable = el?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), input, select, textarea, a[href]",
        )
        if (!focusable?.length) return
        const first = focusable[0],
          last = focusable[focusable.length - 1]
        if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === el)
        ) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", key)
    return () => {
      document.body.style.overflow = old
      document.removeEventListener("keydown", key)
      previous?.focus()
    }
  }, [])
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="section-heading">
          <h2 id={id}>{title}</h2>
          <Button variant="icon" aria-label="Fechar" onClick={onClose}>
            <Icon name="close" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
export default Button
