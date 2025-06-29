import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import express from 'express'
import {
  authRoutes,
  deckRoutes,
  cardRoutes,
  definitionRoutes,
  wordRoutes,
  userRoutes,
  srsRoutes,
} from './src/routes'
import { connectDB } from './db'
import { checkAuth, notFoundMiddleware } from './src/middlewares'
import cookieParser from 'cookie-parser'

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
app.use(cookieParser())

app.use(checkAuth)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/decks', deckRoutes)
app.use('/api/cards', cardRoutes)
app.use('/api/words', wordRoutes)
app.use('/api/definitions', definitionRoutes)
app.use('/api/srs', srsRoutes)

app.use(notFoundMiddleware)

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
