'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Client } from '@/lib/supabase'
import { GoTriangleDown } from 'react-icons/go'
import { IoIosSettings } from 'react-icons/io'
import { FaCheck } from 'react-icons/fa'

interface ClientsChartProps {
  clients: Client[]
}

const COLORS = ['#6366F1', '#22D3EE', '#FCD34D', '#FB7185', '#10B981', '#A78BFA']

export default function ClientsCardChart({ clients }: ClientsChartProps) {
  const [selectedDomain, setSelectedDomain] = useState('Todos')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const allDomains = Array.from(
    new Set(clients.map(c => c.Email?.split('@')[1] || 'Sem e-mail'))
  )

  const filteredClients = selectedDomain === 'Todos'
    ? clients
    : clients.filter(c => c.Email?.includes(selectedDomain))

  const domainData = filteredClients.reduce((acc, client) => {
    const domain = client.Email?.split('@')[1] || 'Sem e-mail'
    acc[domain] = (acc[domain] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(domainData).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <div className="p-6 bg-white text-gray-900 rounded-2xl shadow-lg w-full relative border border-gray-200">
      {/* Filtro por domínio */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-gray-800 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-4 py-2 flex items-center gap-1"
        >
          <IoIosSettings className="w-5 h-5" />
          <GoTriangleDown />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 z-10 bg-white border border-gray-200 rounded-2xl shadow-md w-44">
            <ul className="py-2 text-sm text-gray-800">
              <li>
                <button
                  onClick={() => {
                    setSelectedDomain('Todos')
                    setDropdownOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                >
                  Todos
                  {selectedDomain === 'Todos' && <FaCheck className="text-green-500 ml-2" />}
                </button>
              </li>
              {allDomains.map((domain, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      setSelectedDomain(domain)
                      setDropdownOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                  >
                    {domain}
                    {selectedDomain === domain && <FaCheck className="text-green-500 ml-2" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Título e total */}
      <h2 className="text-2xl font-bold text-center mb-2">Clientes por Domínio</h2>
      <p className="text-sm text-center text-gray-500 mb-4">
        Total: {filteredClients.length} cliente(s)
      </p>

      {/* Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Gráfico */}
        <div className="w-full md:w-2/3 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                label
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda */}
        <div className="md:w-1/3 flex flex-col items-start mt-6 md:mt-0 md:pl-4">
          <h3 className="text-lg font-semibold mb-3">Legenda</h3>
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center mb-2 text-sm">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span>{entry.name} ({entry.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
