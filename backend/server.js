import "dotenv/config"
import express from "express"
import cors from "cors"
import aiRoutes from "./routes/aiRoutes.js"

const app = express()
const PORT = process.env.PORT || 5000

// Parse JSON bodies (meeting notes can be large).
app.use(express.json({ limit: "1mb" }))

// Restrict CORS to the configured frontend origin(s).
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (no origin) and any whitelisted origin.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
  }),
)

// Basic security header.
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff")
  next()
})

// Health check (used by Render).
app.get("/health", (req, res) => res.json({ status: "ok" }))

// Feature routes.
app.use("/", aiRoutes)

// Centralized error handler.
app.use((err, req, res, next) => {
  console.error("[backend] error:", err.message)
  res.status(500).json({ error: "Something went wrong while processing your request." })
})

app.listen(PORT, () => {
  console.log(`[backend] AI Productivity Assistant API running on port ${PORT}`)
})
