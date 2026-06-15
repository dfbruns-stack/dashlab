export interface User {
  id: string
  email: string
  nome: string
  role: 'paciente' | 'medico' | 'admin'
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
}

export interface Paciente {
  id: string
  nome: string
  dataNascimento: string
  cpf: string
  email: string
  telefone: string
  criado_em: string
  atualizado_em: string
}

export interface Exame {
  id: string
  pacienteId: string
  tipoExame: string
  dataExame: string
  laboratorio: string
  status: 'pendente' | 'em_progresso' | 'completo' | 'cancelado'
  notas?: string
  criado_em: string
  atualizado_em: string
  resultados?: Resultado[]
}

export interface Resultado {
  id: string
  exameId: string
  nome: string
  valor: number
  unidade: string
  minimo: number
  maximo: number
  status: 'normal' | 'baixo' | 'alto'
  criado_em: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
