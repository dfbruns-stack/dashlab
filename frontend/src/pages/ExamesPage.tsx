import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function ExamesPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Exames</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Exame
        </button>
      </div>

      {/* Placeholder */}
      <div className="card text-center py-12">
        <p className="text-gray-600 text-lg">Selecione um paciente para visualizar seus exames</p>
      </div>
    </div>
  )
}
