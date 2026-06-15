import api from './api'
import { Paciente, PaginatedResponse } from '../types'

export const pacientesService = {
  listar: async (page = 1, limit = 10, search?: string) => {
    const response = await api.get<PaginatedResponse<Paciente>>('/pacientes', {
      params: { page, limit, search },
    })
    return response.data
  },

  obter: async (id: string) => {
    const response = await api.get<Paciente>(`/pacientes/${id}`)
    return response.data
  },

  criar: async (dados: Omit<Paciente, 'id' | 'criado_em' | 'atualizado_em'>) => {
    const response = await api.post<Paciente>('/pacientes', dados)
    return response.data
  },

  atualizar: async (id: string, dados: Partial<Paciente>) => {
    const response = await api.put<Paciente>(`/pacientes/${id}`, dados)
    return response.data
  },

  deletar: async (id: string) => {
    await api.delete(`/pacientes/${id}`)
  },
}
