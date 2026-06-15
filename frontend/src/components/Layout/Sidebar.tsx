import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Users, Activity, TrendingUp, X } from 'lucide-react'
import clsx from 'clsx'

interface SidebarProps {
  open: boolean
}

const menuItems = [
  { label: 'Dashboard', path: '/', icon: BarChart3 },
  { label: 'Pacientes', path: '/pacientes', icon: Users },
  { label: 'Exames', path: '/pacientes', icon: Activity },
  { label: 'Comparação', path: '/comparacao', icon: TrendingUp },
]

export default function Sidebar({ open }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden" />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed md:relative w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300 z-40',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary-600">DashLab</h2>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-100 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
