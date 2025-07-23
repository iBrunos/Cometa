import { useState } from 'react'
import { FaUsers, FaEnvelope, FaPhone } from 'react-icons/fa'
import { Client } from '@/lib/supabase'
import { addDays, isAfter } from 'date-fns'

interface StatsCardsProps {
  clients: Client[]
}

const filters = [
  { label: 'Todos', value: 0 },
  { label: 'Últimos 7 dias', value: 7 },
  { label: 'Últimos 30', value: 30 },
  
]

export default function StatsCards({ clients }: StatsCardsProps) {
  const [days, setDays] = useState(0)

  const filteredClients = clients.filter((client) => {
    if (days === 0) return true
    const createdDate = new Date(client.created_at)
    const fromDate = addDays(new Date(), -days)
    return isAfter(createdDate, fromDate)
  })

  const totalClients = filteredClients.length
  const withEmail = filteredClients.filter(c => c.Email).length
  const withPhone = filteredClients.filter(c => c.Telefone).length

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
      percentage: totalClients ? Math.round((withEmail / totalClients) * 100) : 0,
    },
    {
      name: 'Com Telefone',
      value: withPhone,
      icon: <FaPhone className="h-6 w-6 text-blue-500" />,
      percentage: totalClients ? Math.round((withPhone / totalClients) * 100) : 0,
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setDays(filter.value)}
            className={`text-gray-800 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-4 py-2 flex items-center gap-1
              ${days === filter.value ? 'ring-2 ring-blue-300 bg-gray-200' : ''}
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>

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
            {stat.percentage !== undefined && (
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
    </div>
  )
}
