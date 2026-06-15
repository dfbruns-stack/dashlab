import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.resultado.deleteMany({})
  await prisma.exame.deleteMany({})
  await prisma.paciente.deleteMany({})
  await prisma.usuario.deleteMany({})

  // Criar usuários de teste
  const senhaHash = await bcryptjs.hash('senha123', 10)

  const usuario1 = await prisma.usuario.create({
    data: {
      email: 'joao@example.com',
      senha: senhaHash,
      nome: 'João Silva',
      role: 'paciente',
    },
  })

  const usuario2 = await prisma.usuario.create({
    data: {
      email: 'maria@example.com',
      senha: senhaHash,
      nome: 'Maria Santos',
      role: 'paciente',
    },
  })

  const usuarioMedico = await prisma.usuario.create({
    data: {
      email: 'medico@example.com',
      senha: senhaHash,
      nome: 'Dr. Carlos',
      role: 'medico',
    },
  })

  // Criar pacientes
  const paciente1 = await prisma.paciente.create({
    data: {
      usuarioId: usuario1.id,
      nome: 'João Silva',
      dataNascimento: new Date('1990-01-15'),
      cpf: '123.456.789-00',
      email: 'joao@example.com',
      telefone: '11999999999',
      endereco: 'Rua A, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000',
    },
  })

  const paciente2 = await prisma.paciente.create({
    data: {
      usuarioId: usuario2.id,
      nome: 'Maria Santos',
      dataNascimento: new Date('1985-05-20'),
      cpf: '987.654.321-00',
      email: 'maria@example.com',
      telefone: '11988888888',
      endereco: 'Av. B, 456',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '20000-000',
    },
  })

  // Criar exames
  const exame1 = await prisma.exame.create({
    data: {
      pacienteId: paciente1.id,
      tipoExame: 'Sangue',
      dataExame: new Date('2024-01-10'),
      laboratorio: 'Lab Centro',
      status: 'completo',
      notas: 'Jejum de 8 horas',
    },
  })

  const exame2 = await prisma.exame.create({
    data: {
      pacienteId: paciente1.id,
      tipoExame: 'Sangue',
      dataExame: new Date('2024-01-20'),
      laboratorio: 'Lab Centro',
      status: 'completo',
    },
  })

  // Criar resultados para exame1
  await prisma.resultado.create({
    data: {
      exameId: exame1.id,
      nome: 'Hemoglobina',
      valor: 14.5,
      unidade: 'g/dL',
      minimo: 12.0,
      maximo: 17.0,
      status: 'normal',
    },
  })

  await prisma.resultado.create({
    data: {
      exameId: exame1.id,
      nome: 'Glicose',
      valor: 120,
      unidade: 'mg/dL',
      minimo: 70,
      maximo: 100,
      status: 'alto',
      notas: 'Acima do normal',
    },
  })

  // Criar resultados para exame2
  await prisma.resultado.create({
    data: {
      exameId: exame2.id,
      nome: 'Hemoglobina',
      valor: 14.8,
      unidade: 'g/dL',
      minimo: 12.0,
      maximo: 17.0,
      status: 'normal',
    },
  })

  await prisma.resultado.create({
    data: {
      exameId: exame2.id,
      nome: 'Glicose',
      valor: 95,
      unidade: 'mg/dL',
      minimo: 70,
      maximo: 100,
      status: 'normal',
    },
  })

  console.log('✅ Seed concluído com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
