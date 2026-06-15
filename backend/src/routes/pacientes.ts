import { Router, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { AuthRequest, authenticate } from '../middleware/auth.js'
import { AppError } from '../middleware/errorHandler.js'

const router = Router()
const prisma = new PrismaClient()

const createPacienteSchema = z.object({
  nome: z.string().min(3),
  dataNascimento: z.string().datetime().or(z.string().date()),
  cpf: z.string(),
  email: z.string().email(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
})

router.get('/pacientes', authenticate, async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, search } = req.query

  const skip = (Number(page) - 1) * Number(limit)

  const where = search
    ? {
        OR: [
          { nome: { contains: String(search), mode: 'insensitive' as const } },
          { cpf: { contains: String(search), mode: 'insensitive' as const } },
        ],
      }
    : {}

  const [pacientes, total] = await Promise.all([
    prisma.paciente.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { criadoEm: 'desc' },
    }),
    prisma.paciente.count({ where }),
  ])

  res.json({
    data: pacientes,
    total,
    page: Number(page),
    limit: Number(limit),
  })
})

router.get('/pacientes/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  const paciente = await prisma.paciente.findUnique({
    where: { id },
    include: { exames: { orderBy: { dataExame: 'desc' } } },
  })

  if (!paciente) {
    throw new AppError(404, 'Paciente não encontrado')
  }

  res.json(paciente)
})

router.post('/pacientes', authenticate, async (req: AuthRequest, res: Response) => {
  const dados = createPacienteSchema.parse(req.body)

  const pacienteExistente = await prisma.paciente.findUnique({
    where: { cpf: dados.cpf },
  })

  if (pacienteExistente) {
    throw new AppError(409, 'Paciente com este CPF já existe')
  }

  const paciente = await prisma.paciente.create({
    data: {
      ...dados,
      dataNascimento: new Date(dados.dataNascimento),
      usuarioId: req.user?.id || 'unknown',
    },
  })

  res.status(201).json(paciente)
})

router.put('/pacientes/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const dados = createPacienteSchema.partial().parse(req.body)

  const paciente = await prisma.paciente.update({
    where: { id },
    data: {
      ...dados,
      dataNascimento: dados.dataNascimento ? new Date(dados.dataNascimento) : undefined,
    },
  })

  res.json(paciente)
})

router.delete('/pacientes/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  await prisma.paciente.delete({
    where: { id },
  })

  res.status(204).send()
})

export default router
