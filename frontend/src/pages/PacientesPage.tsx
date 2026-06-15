import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import { pacientesService } from '../services/pacientesService'

export default function PacientesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['pacientes', page, search],
    queryFn: () => pacientesService.listar(page, 10, search),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Paciente
        </button>
      </div>

      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome ou CPF..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="input-field pl-10"
        />
      </div>

      {/* Tabela */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="text-center py-8 text-gray-600">Carregando pacientes...</div>
        ) : error ? (
          <div className="text-center py-8 text-danger-600">Erro ao carregar pacientes</div>
        ) : data?.data && data.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">CPF</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.data.map((paciente) => (
                  <tr key={paciente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{paciente.nome}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paciente.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paciente.telefone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paciente.cpf}</td>
                    <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                      <button className="p-2 hover:bg-primary-50 rounded-lg text-primary-600 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 hover:bg-danger-50 rounded-lg text-danger-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">Nenhum paciente encontrado</div>
        )}
      </div>
    </div>
  )
}
