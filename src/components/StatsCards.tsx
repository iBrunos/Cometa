import { FaUsers, FaEnvelope, FaPhone } from 'react-icons/fa'
import { Client } from '@/lib/supabase'

interface StatsCardsProps {
  clients: Client[]
}

export default function StatsCards({ clients }: StatsCardsProps) {
  const totalClients = clients.length
  const withEmail = clients.filter(c => c.E_mail).length
  const withPhone = clients.filter(c => c.Telefone).length

  const stats = [
    {
      name: 'Total de Clientes',
      value: totalClients,
      icon: <FaUsers className="h-6 w-6 text-indigo-500" />,
    },
    {
      name: 'Com E-mail',
      value: withEmail,
      icon: <FaEnvelope className="h-6 w-6 text-green-500" />,
      percentage: Math.round((withEmail / totalClients) * 100)
    },
    {
      name: 'Com Telefone',
      value: withPhone,
      icon: <FaPhone className="h-6 w-6 text-blue-500" />,
      percentage: Math.round((withPhone / totalClients) * 100)
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          {stat.percentage && (
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="font-medium text-green-600">
                  {stat.percentage}%
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}