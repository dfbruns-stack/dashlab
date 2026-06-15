import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { logger } from '../utils/logger.js'

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message)

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message })
  }

  if (err instanceof ZodError) {
    return res.status(400).json({ error: err.errors })
  }

  res.status(500).json({ error: 'Erro interno do servidor' })
}
