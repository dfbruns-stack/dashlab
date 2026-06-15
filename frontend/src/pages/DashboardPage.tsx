import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AlertCircle, TrendingUp, Users } from 'lucide-react'

const dashboardData = [
  { mes: 'Jan', exames: 4, pacientes: 2 },
  { mes: 'Fev', exames: 3, pacientes: 2 },
  { mes: 'Mar', exames: 2, pacientes: 1 },
  { mes: 'Abr', exames: 5, pacientes: 3 },
  { mes: 'Mai', exames: 4, pacientes: 2 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de Pacientes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
            </div>
            <div className="bg-primary-100 p-4 rounded-lg">
              <Users size={24} className="text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Exames Pendentes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
            </div>
            <div className="bg-warning-100 p-4 rounded-lg">
              <AlertCircle size={24} className="text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Valores Anormais</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
            </div>
            <div className="bg-danger-100 p-4 rounded-lg">
              <TrendingUp size={24} className="text-danger-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Atividade por Mês</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dashboardData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="exames" fill="#0ea5e9" name="Exames" />
            <Bar dataKey="pacientes" fill="#10b981" name="Pacientes" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
