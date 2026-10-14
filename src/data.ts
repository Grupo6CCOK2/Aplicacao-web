export const services = [
  {
    id: "color",
    name: "Coloração Premium",
    category: "Coloração",
    description:
      "Uma nova cor, com cuidado e personalidade. Tons que realçam a sua beleza.",
    duration: 120,
    price: 280,
    image: "/images/color.jpg",
  },
  {
    id: "women",
    name: "Corte Feminino",
    category: "Cortes",
    description: "Leveza, movimento e um corte pensado para combinar com você.",
    duration: 60,
    price: 120,
    image: "/images/women.jpg",
  },
  {
    id: "men",
    name: "Corte Masculino",
    category: "Cortes",
    description:
      "Do clássico ao moderno, precisão em cada detalhe do seu estilo.",
    duration: 45,
    price: 80,
    image: "/images/men.jpg",
  },
  {
    id: "beard",
    name: "Barba e acabamento",
    category: "Barba",
    description: "Desenho e acabamento para uma barba bem cuidada.",
    duration: 30,
    price: 50,
    image: "/images/men.jpg",
  },
  {
    id: "treatment",
    name: "Tratamento capilar",
    category: "Tratamentos",
    description: "Um momento de cuidado para recuperar brilho e maciez.",
    duration: 60,
    price: 150,
    image: "/images/women.jpg",
  },
]
export const initialTeam = [
  {
    id: "fred",
    name: "Fred",
    specialty: "Barbeiro Master",
    initials: "FR",
    services: ["men", "beard"],
    image: "/images/fred.jpg",
  },
  {
    id: "carla",
    name: "Carla Soares",
    specialty: "Cortes e finalização",
    initials: "CS",
    services: ["women", "treatment"],
    image: "/images/carla.jpg",
  },
  {
    id: "ana",
    name: "Ana Oliveira",
    specialty: "Colorista",
    initials: "AO",
    services: ["color", "women", "treatment"],
    image: "/images/ana.jpg",
  },
]
export type Professional = typeof initialTeam[number]
export type Session = {
  name: string
  role: "client" | "employee" | "admin"
}
export type Appointment = {
  id: string
  name: string
  professional: string
  service: string
  date: string
  time: string
  status: string
  note: string
  reason?: string
  canceledAt?: string
}
export type Client = {
  id: string
  name: string
  phone: string
  email: string
  visits: number
  active: boolean
  birth?: string
  dependent?: string
}
export const today = () => localDate(new Date())
export function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}
export function displayDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR")
}
export const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
export const initialClients: Client[] = [
  {
    id: "1",
    name: "Gabriel Costa",
    phone: "(11) 98765-4321",
    email: "gabriel@exemplo.com",
    visits: 12,
    active: true,
  },
  {
    id: "2",
    name: "Mariana Santos",
    phone: "(11) 98876-5432",
    email: "mariana@exemplo.com",
    visits: 8,
    active: true,
  },
  {
    id: "3",
    name: "Lucas Almeida",
    phone: "(11) 97765-1234",
    email: "lucas@exemplo.com",
    visits: 5,
    active: true,
  },
  {
    id: "4",
    name: "Juliana Ribeiro",
    phone: "(11) 96654-3210",
    email: "juliana@exemplo.com",
    visits: 18,
    active: true,
  },
  {
    id: "5",
    name: "Pedro Souza",
    phone: "(11) 95543-2109",
    email: "pedro@exemplo.com",
    visits: 3,
    active: false,
  },
]
export const initialAppointments: Appointment[] = [
  {
    id: "1",
    name: "Gabriel Costa",
    professional: "fred",
    service: "men",
    date: today(),
    time: "09:00",
    status: "Concluído",
    note: "Corte habitual, laterais baixas.",
  },
  {
    id: "2",
    name: "Mariana Santos",
    professional: "carla",
    service: "women",
    date: today(),
    time: "10:00",
    status: "Em atendimento",
    note: "Manter o comprimento.",
  },
  {
    id: "3",
    name: "Lucas Almeida",
    professional: "fred",
    service: "men",
    date: today(),
    time: "11:00",
    status: "Confirmado",
    note: "",
  },
  {
    id: "4",
    name: "Juliana Ribeiro",
    professional: "ana",
    service: "color",
    date: today(),
    time: "14:00",
    status: "Confirmado",
    note: "Coloração em tom natural.",
  },
  {
    id: "5",
    name: "Pedro Souza",
    professional: "fred",
    service: "beard",
    date: today(),
    time: "15:30",
    status: "Aguardando",
    note: "",
  },
]
export function loadSaved<T>(key: string, initial: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initial
  } catch {
    return initial
  }
}
