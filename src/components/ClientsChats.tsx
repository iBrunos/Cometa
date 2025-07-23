'use client'

import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Client } from '@/lib/supabase'
import { FaSpinner } from 'react-icons/fa'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

interface ClientsChartProps {
  clients: Client[]
}

export default function ClientsChart({ clients }: ClientsChartProps) {
  // Agrupa clientes por domínio de e-mail
  const domainData = clients.reduce((acc, client) => {
    const domain = client.E_mail?.split('@')[1] || 'Sem e-mail'
    acc[domain] = (acc[domain] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const chartData = {
    labels: Object.keys(domainData),
    datasets: [
      {
        label: 'Clientes por Domínio',
        data: Object.values(domainData),
        backgroundColor: [
          'rgba(79, 70, 229, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(129, 140, 248, 0.7)',
          'rgba(167, 139, 250, 0.7)',
          'rgba(196, 181, 253, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Distribuição de Clientes por Domínio de E-mail
      </h3>
      <div className="h-64">
        <Pie 
          data={chartData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
              },
            },
          }} 
        />
      </div>
    </div>
  )
}