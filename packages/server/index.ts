import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import express from "express"
// import your routes here
import { connectDB } from "./db"
// import your controllers here

// Docker will automatically pass the config in production
const envConfig =
  process.env.NODE_ENV === 'development'
    ? { path: path.resolve(__dirname, '../../../.env') }
    : undefined

dotenv.config(envConfig)

const app = express()
const PORT = Number(process.env.SERVER_PORT || 3001)

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? `http://localhost:${process.env.CLIENT_PORT}`
        : process.env.ORIGIN_PROD_URL,
    credentials: true,
  })
)
app.use(express.json())

// routes here
// app.use('/api/topics', topicRoutes)

async function startServer() {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to database:', error)
    process.exit(1)
  }
}

startServer()
