import { Router, Response } from 'express'
import { z } from 'zod'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { AuthRequest, authenticate } from '../middleware/auth.js'
import { AppError } from '../middleware/errorHandler.js'

const router = Router()
const prisma = new PrismaClient()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nome: z.string().min(3),
  role: z.enum(['paciente', 'medico', 'admin']).default('paciente'),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

router.post('/register', async (req: AuthRequest, res: Response) => {
  const { email, password, nome, role } = registerSchema.parse(req.body)

  const usuarioExistente = await prisma.usuario.findUnique({ where: { email } })
  if (usuarioExistente) {
    throw new AppError(409, 'Email já cadastrado')
  }

  const senhaHash = await bcryptjs.hash(password, 10)

  const usuario = await prisma.usuario.create({
    data: {
      email,
      senha: senhaHash,
      nome,
      role,
    },
  })

  if (role === 'paciente') {
    await prisma.paciente.create({
      data: {
        usuarioId: usuario.id,
        nome,
        email,
        dataNascimento: new Date(),
        cpf: '',
      },
    })
  }

  const token = jwt.sign({ id: usuario.id, email: usuario.email, role: usuario.role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  })

  const refreshToken = jwt.sign({ id: usuario.id }, process.env.REFRESH_TOKEN_SECRET || 'refresh-secret', {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d',
  })

  res.status(201).json({
    token,
    refreshToken,
    user: {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
    },
  })
})

router.post('/login', async (req: AuthRequest, res: Response) => {
  const { email, password } = loginSchema.parse(req.body)

  const usuario = await prisma.usuario.findUnique({ where: { email } })
  if (!usuario) {
    throw new AppError(401, 'Email ou senha incorretos')
  }

  const senhaValida = await bcryptjs.compare(password, usuario.senha)
  if (!senhaValida) {
    throw new AppError(401, 'Email ou senha incorretos')
  }

  const token = jwt.sign({ id: usuario.id, email: usuario.email, role: usuario.role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  })

  const refreshToken = jwt.sign({ id: usuario.id }, process.env.REFRESH_TOKEN_SECRET || 'refresh-secret', {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d',
  })

  res.json({
    token,
    refreshToken,
    user: {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
    },
  })
})

router.post('/refresh', (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    throw new AppError(400, 'Refresh token não fornecido')
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'refresh-secret')

    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRE || '24h',
    })

    const newRefreshToken = jwt.sign({ id: decoded.id }, process.env.REFRESH_TOKEN_SECRET || 'refresh-secret', {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d',
    })

    res.json({
      token: newToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    throw new AppError(401, 'Refresh token inválido')
  }
})

export default router
