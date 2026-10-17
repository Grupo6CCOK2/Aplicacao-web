import http from "node:http"
import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = Number(process.env.PORT || 3000)
const DIST_DIR = path.join(__dirname, "dist")
const PUBLIC_DIR = path.join(__dirname, "public")

function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const initialServices = [
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

function createInitialTeam() {
  return [
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
}

function createInitialClients() {
  return [
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
}

function createInitialAppointments() {
  const todayStr = getTodayStr()
  return [
    {
      id: "1",
      name: "Gabriel Costa",
      professional: "fred",
      service: "men",
      date: todayStr,
      time: "09:00",
      status: "Concluído",
      note: "Corte habitual, laterais baixas.",
    },
    {
      id: "2",
      name: "Mariana Santos",
      professional: "carla",
      service: "women",
      date: todayStr,
      time: "10:00",
      status: "Em atendimento",
      note: "Manter o comprimento.",
    },
    {
      id: "3",
      name: "Lucas Almeida",
      professional: "fred",
      service: "men",
      date: todayStr,
      time: "11:00",
      status: "Confirmado",
      note: "",
    },
    {
      id: "4",
      name: "Juliana Ribeiro",
      professional: "ana",
      service: "color",
      date: todayStr,
      time: "14:00",
      status: "Confirmado",
      note: "Coloração em tom natural.",
    },
    {
      id: "5",
      name: "Pedro Souza",
      professional: "fred",
      service: "beard",
      date: todayStr,
      time: "15:30",
      status: "Aguardando",
      note: "",
    },
  ]
}

// In-memory state for the session/prototype
let services = [...initialServices]
let team = createInitialTeam()
let clients = createInitialClients()
let appointments = createInitialAppointments()
let messages = []

const sseClients = new Set()

function broadcastUpdate() {
  const payload = `data: ${JSON.stringify({
    type: "sync",
    appointments,
    clients,
    team,
  })}\n\n`
  for (const client of sseClients) {
    try {
      client.write(payload)
    } catch {
      sseClients.delete(client)
    }
  }
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ""
    req.on("data", (chunk) => {
      body += chunk
      if (body.length > 1e6) {
        req.destroy()
        reject(new Error("Payload too large"))
      }
    })
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on("error", reject)
  })
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  })
  res.end(JSON.stringify(data))
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`)
  const pathname = parsedUrl.pathname
  const method = req.method || "GET"

  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    })
    res.end()
    return
  }

  if (pathname.startsWith("/api/")) {
    if (pathname === "/api/health") {
      return sendJson(res, 200, { status: "ok", app: "fred-cabeleireiros" })
    }

    if (pathname === "/api/data" && method === "GET") {
      return sendJson(res, 200, {
        appointments,
        clients,
        team,
        services,
      })
    }

    if (pathname === "/api/events" && method === "GET") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      })
      res.write(
        `data: ${JSON.stringify({
          type: "init",
          appointments,
          clients,
          team,
        })}\n\n`,
      )
      sseClients.add(res)
      req.on("close", () => {
        sseClients.delete(res)
      })
      return
    }

    if (pathname === "/api/appointments" && method === "GET") {
      return sendJson(res, 200, appointments)
    }

    if (pathname === "/api/appointments" && method === "POST") {
      try {
        const item = await parseJsonBody(req)
        if (!item.id) item.id = crypto.randomUUID()
        const existingIdx = appointments.findIndex((a) => a.id === item.id)
        if (existingIdx >= 0) {
          appointments[existingIdx] = { ...appointments[existingIdx], ...item }
        } else {
          appointments.push(item)
        }
        broadcastUpdate()
        return sendJson(res, 200, { success: true, appointment: item })
      } catch (e) {
        return sendJson(res, 400, { error: e.message })
      }
    }

    if (
      pathname.startsWith("/api/appointments/") &&
      (method === "PATCH" || method === "PUT")
    ) {
      const id = decodeURIComponent(pathname.replace("/api/appointments/", ""))
      try {
        const update = await parseJsonBody(req)
        const idx = appointments.findIndex((a) => a.id === id)
        if (idx >= 0) {
          appointments[idx] = { ...appointments[idx], ...update }
          broadcastUpdate()
          return sendJson(res, 200, {
            success: true,
            appointment: appointments[idx],
          })
        }
        return sendJson(res, 404, { error: "Agendamento não encontrado" })
      } catch (e) {
        return sendJson(res, 400, { error: e.message })
      }
    }

    if (pathname === "/api/clients" && method === "GET") {
      return sendJson(res, 200, clients)
    }

    if (pathname === "/api/clients" && method === "POST") {
      try {
        const client = await parseJsonBody(req)
        if (!client.id) client.id = crypto.randomUUID()
        const existingIdx = clients.findIndex(
          (c) =>
            c.id === client.id ||
            (client.email &&
              c.email.toLowerCase() === String(client.email).toLowerCase()),
        )
        if (existingIdx >= 0) {
          clients[existingIdx] = { ...clients[existingIdx], ...client }
        } else {
          clients.push(client)
        }
        broadcastUpdate()
        return sendJson(res, 200, { success: true, client })
      } catch (e) {
        return sendJson(res, 400, { error: e.message })
      }
    }

    if (
      pathname.startsWith("/api/clients/") &&
      (method === "PATCH" || method === "PUT")
    ) {
      const id = decodeURIComponent(pathname.replace("/api/clients/", ""))
      try {
        const update = await parseJsonBody(req)
        const idx = clients.findIndex((c) => c.id === id)
        if (idx >= 0) {
          const previousName = clients[idx].name
          clients[idx] = { ...clients[idx], ...update }
          if (update.name && previousName && update.name !== previousName) {
            appointments = appointments.map((a) =>
              a.name === previousName ? { ...a, name: update.name } : a,
            )
          }
          broadcastUpdate()
          return sendJson(res, 200, { success: true, client: clients[idx] })
        }
        return sendJson(res, 404, { error: "Cliente não encontrado" })
      } catch (e) {
        return sendJson(res, 400, { error: e.message })
      }
    }

    if (pathname === "/api/team" && method === "GET") {
      return sendJson(res, 200, team)
    }

    if (pathname === "/api/team" && method === "POST") {
      try {
        const member = await parseJsonBody(req)
        if (!member.id) member.id = crypto.randomUUID()
        const existingIdx = team.findIndex((p) => p.id === member.id)
        if (existingIdx >= 0) {
          team[existingIdx] = { ...team[existingIdx], ...member }
        } else {
          team.push(member)
        }
        broadcastUpdate()
        return sendJson(res, 200, { success: true, professional: member })
      } catch (e) {
        return sendJson(res, 400, { error: e.message })
      }
    }

    if (pathname === "/api/contact" && method === "POST") {
      try {
        const msg = await parseJsonBody(req)
        messages.push({ ...msg, createdAt: new Date().toISOString() })
        return sendJson(res, 200, { success: true })
      } catch (e) {
        return sendJson(res, 400, { error: e.message })
      }
    }

    if (pathname === "/api/reset" && method === "POST") {
      team = createInitialTeam()
      clients = createInitialClients()
      appointments = createInitialAppointments()
      broadcastUpdate()
      return sendJson(res, 200, {
        success: true,
        message: "Dados restaurados para o padrão.",
      })
    }

    return sendJson(res, 404, { error: "Rota da API não encontrada" })
  }

  // Static files from dist/ or public/
  const cleanPath = pathname === "/" ? "/index.html" : pathname
  let filePath = path.join(DIST_DIR, cleanPath)

  if (!fs.existsSync(filePath)) {
    const publicPath = path.join(PUBLIC_DIR, cleanPath)
    if (fs.existsSync(publicPath)) {
      filePath = publicPath
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase()
      const contentType = MIME_TYPES[ext] || "application/octet-stream"
      res.writeHead(200, { "Content-Type": contentType })
      fs.createReadStream(filePath).pipe(res)
    } else {
      const indexPath = path.join(DIST_DIR, "index.html")
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" })
          res.end(
            "Erro: Execute 'npm run build' primeiro para gerar a pasta dist.",
          )
        } else {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
          res.end(content)
        }
      })
    }
  })
})

server.listen(PORT, "127.0.0.1", () => {
  console.log(
    `[Fred Cabeleireiros] Servidor protótipo ativo em http://localhost:${PORT}`,
  )
})
