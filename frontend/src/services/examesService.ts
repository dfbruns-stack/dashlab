import api from './api'
import { Exame, Resultado, PaginatedResponse } from '../types'

export const examesService = {
  listar: async (pacienteId: string, page = 1, limit = 10) => {
    const response = await api.get<PaginatedResponse<Exame>>(
      `/pacientes/${pacienteId}/exames`,
      { params: { page, limit } }
    )
    return response.data
  },

  obter: async (pacienteId: string, exameId: string) => {
    const response = await api.get<Exame>(`/pacientes/${pacienteId}/exames/${exameId}`)
    return response.data
  },

  criar: async (pacienteId: string, dados: Omit<Exame, 'id' | 'criado_em' | 'atualizado_em' | 'pacienteId'>) => {
    const response = await api.post<Exame>(`/pacientes/${pacienteId}/exames`, dados)
    return response.data
  },

  atualizar: async (pacienteId: string, exameId: string, dados: Partial<Exame>) => {
    const response = await api.put<Exame>(`/pacientes/${pacienteId}/exames/${exameId}`, dados)
    return response.data
  },

  deletar: async (pacienteId: string, exameId: string) => {
    await api.delete(`/pacientes/${pacienteId}/exames/${exameId}`)
  },

  listarResultados: async (exameId: string) => {
    const response = await api.get<{ data: Resultado[] }>(`/exames/${exameId}/resultados`)
    return response.data.data
  },

  criarResultado: async (exameId: string, dados: Omit<Resultado, 'id' | 'exameId' | 'criado_em'>) => {
    const response = await api.post<Resultado>(`/exames/${exameId}/resultados`, dados)
    return response.data
  },

  atualizarResultado: async (exameId: string, resultadoId: string, dados: Partial<Resultado>) => {
    const response = await api.put<Resultado>(
      `/exames/${exameId}/resultados/${resultadoId}`,
      dados
    )
    return response.data
  },

  deletarResultado: async (exameId: string, resultadoId: string) => {
    await api.delete(`/exames/${exameId}/resultados/${resultadoId}`)
  },
}
