'use client'


import { useEffect, useState } from 'react'
import { fetchClients, Client } from '@/lib/supabase'
import ClientsTable from '@/components/ClientsTable'
import ClientsCardChart from '@/components/ClientsChats'
import StatsCards from '@/components/StatsCards'
import { FaSpinner } from 'react-icons/fa'

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const loadData = async () => {
    try {
      setLoading(true)
      const { data } = await fetchClients()
      if (data) {
        setClients(data)
        setLastUpdated(new Date().toLocaleTimeString())
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Carrega os dados imediatamente
    loadData()

    // Configura o intervalo para atualização a cada 30 minutos
    const interval = setInterval(loadData, 30 * 60 * 1000) // 30 minutos em milissegundos

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval)
  }, [])

  if (loading && clients.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        <header className="pb-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard de Clientes</h1>
              <p className="mt-2 text-gray-600">Dados atualizados automaticamente</p>
            </div>
            <div className="text-sm text-gray-500">
              Última atualização: {lastUpdated || 'Carregando...'}
            </div>
          </div>
        </header>

        {/* Cards de Estatísticas */}
        <StatsCards clients={clients} />
        {/* Tabela de Clientes */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Lista de Clientes</h2>
              <p className="mt-1 text-sm text-gray-500">
                {clients.length} clientes cadastrados
              </p>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Atualizando...' : 'Atualizar Agora'}
            </button>
          </div>
          <ClientsTable clients={clients} loading={loading} />
        </div>
        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <ClientsCardChart clients={clients} />
          </div>
        </div>


      </div>
    </div>
  )
}