import { Router, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { AuthRequest, authenticate } from '../middleware/auth.js'
import { AppError } from '../middleware/errorHandler.js'

const router = Router()
const prisma = new PrismaClient()

const createExameSchema = z.object({
  tipoExame: z.string(),
  dataExame: z.string().datetime().or(z.string().date()),
  laboratorio: z.string(),
  status: z.enum(['pendente', 'em_progresso', 'completo', 'cancelado']).default('pendente'),
  notas: z.string().optional(),
})

const createResultadoSchema = z.object({
  nome: z.string(),
  valor: z.number(),
  unidade: z.string(),
  minimo: z.number(),
  maximo: z.number(),
  notas: z.string().optional(),
})

// Exames
router.get('/pacientes/:pacienteId/exames', authenticate, async (req: AuthRequest, res: Response) => {
  const { pacienteId } = req.params
  const { page = 1, limit = 10 } = req.query

  const skip = (Number(page) - 1) * Number(limit)

  const [exames, total] = await Promise.all([
    prisma.exame.findMany({
      where: { pacienteId },
      skip,
      take: Number(limit),
      include: { resultados: true },
      orderBy: { dataExame: 'desc' },
    }),
    prisma.exame.count({ where: { pacienteId } }),
  ])

  res.json({
    data: exames,
    total,
    page: Number(page),
    limit: Number(limit),
  })
})

router.get('/pacientes/:pacienteId/exames/:exameId', authenticate, async (req: AuthRequest, res: Response) => {
  const { pacienteId, exameId } = req.params

  const exame = await prisma.exame.findFirst({
    where: { id: exameId, pacienteId },
    include: { resultados: true },
  })

  if (!exame) {
    throw new AppError(404, 'Exame não encontrado')
  }

  res.json(exame)
})

router.post('/pacientes/:pacienteId/exames', authenticate, async (req: AuthRequest, res: Response) => {
  const { pacienteId } = req.params
  const dados = createExameSchema.parse(req.body)

  const exame = await prisma.exame.create({
    data: {
      ...dados,
      dataExame: new Date(dados.dataExame),
      pacienteId,
    },
  })

  res.status(201).json(exame)
})

router.put('/pacientes/:pacienteId/exames/:exameId', authenticate, async (req: AuthRequest, res: Response) => {
  const { pacienteId, exameId } = req.params
  const dados = createExameSchema.partial().parse(req.body)

  const exame = await prisma.exame.findFirst({
    where: { id: exameId, pacienteId },
  })

  if (!exame) {
    throw new AppError(404, 'Exame não encontrado')
  }

  const exameAtualizado = await prisma.exame.update({
    where: { id: exameId },
    data: {
      ...dados,
      dataExame: dados.dataExame ? new Date(dados.dataExame) : undefined,
    },
  })

  res.json(exameAtualizado)
})

router.delete('/pacientes/:pacienteId/exames/:exameId', authenticate, async (req: AuthRequest, res: Response) => {
  const { pacienteId, exameId } = req.params

  const exame = await prisma.exame.findFirst({
    where: { id: exameId, pacienteId },
  })

  if (!exame) {
    throw new AppError(404, 'Exame não encontrado')
  }

  await prisma.exame.delete({
    where: { id: exameId },
  })

  res.status(204).send()
})

// Resultados
router.get('/exames/:exameId/resultados', authenticate, async (req: AuthRequest, res: Response) => {
  const { exameId } = req.params

  const resultados = await prisma.resultado.findMany({
    where: { exameId },
    orderBy: { criadoEm: 'desc' },
  })

  res.json({ data: resultados })
})

router.post('/exames/:exameId/resultados', authenticate, async (req: AuthRequest, res: Response) => {
  const { exameId } = req.params
  const dados = createResultadoSchema.parse(req.body)

  const resultado = await prisma.resultado.create({
    data: {
      ...dados,
      exameId,
      status: dados.valor < dados.minimo ? 'baixo' : dados.valor > dados.maximo ? 'alto' : 'normal',
    },
  })

  res.status(201).json(resultado)
})

router.put('/exames/:exameId/resultados/:resultadoId', authenticate, async (req: AuthRequest, res: Response) => {
  const { exameId, resultadoId } = req.params
  const dados = createResultadoSchema.partial().parse(req.body)

  const resultado = await prisma.resultado.update({
    where: { id: resultadoId },
    data: {
      ...dados,
      status: dados.valor
        ? dados.valor < (dados.minimo || 0)
          ? 'baixo'
          : dados.valor > (dados.maximo || 0)
          ? 'alto'
          : 'normal'
        : undefined,
    },
  })

  res.json(resultado)
})

router.delete('/exames/:exameId/resultados/:resultadoId', authenticate, async (req: AuthRequest, res: Response) => {
  const { exameId, resultadoId } = req.params

  await prisma.resultado.delete({
    where: { id: resultadoId },
  })

  res.status(204).send()
})

export default router
