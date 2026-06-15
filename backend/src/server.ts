import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import 'express-async-errors'
import dotenv from 'dotenv'
import { logger } from './utils/logger.js'
import authRoutes from './routes/auth.js'
import pacientesRoutes from './routes/pacientes.js'
import examesRoutes from './routes/exames.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3000

// Middlewares globais
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// Rotas
app.use('/api/auth', authRoutes)
app.use('/api/pacientes', pacientesRoutes)
app.use('/api', examesRoutes)

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Rota não encontrada
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

// Error handler
app.use(errorHandler)

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando na porta ${PORT}`)
  logger.info(`🌍 URL: http://localhost:${PORT}`)
})

export default app
