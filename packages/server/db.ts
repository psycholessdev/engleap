import { Sequelize } from 'sequelize-typescript'
import {
  Card,
  CardDefinition,
  CardTargetWord,
  Deck,
  Definition,
  User,
  UserCardProgress,
  UserDeck,
  Word,
  ServiceResponseCacheModel,
} from './src/models'

import dotenv from 'dotenv'
import path from 'path'
import * as console from 'node:console'

// Docker will automatically pass the config in production
const envConfig =
  process.env.NODE_ENV === 'development'
    ? { path: path.resolve(__dirname, '../../.env') }
    : undefined

dotenv.config(envConfig)

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT } = process.env
const POSTGRES_HOST = process.env.NODE_ENV === 'development' ? 'localhost' : 'postgres'

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT || 5432),
  database: POSTGRES_DB,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  models: [
    Card,
    CardDefinition,
    CardTargetWord,
    Deck,
    Definition,
    User,
    UserCardProgress,
    UserDeck,
    Word,
    ServiceResponseCacheModel,
  ],
})

export const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connected to PostgreSQL')
    await sequelize.sync({ alter: true }) // use { force: true } to drop and recreate tables
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    throw error
  }
}
