'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchClients, logout, getCurrentUser } from '@/lib/supabase'
import { Client } from '@/lib/supabase'
import ClientsTable from '@/components/ClientsTable'
import ClientsChart from '@/components/ClientsChart'
import StatsCards from '@/components/StatsCards'
import { FaSpinner } from 'react-icons/fa'

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/login')
        return
      }
      loadData()
    }

    checkAuth()
  }, [router])

  const loadData = async () => {
    try {
      const { data } = await fetchClients()
      if (data) setClients(data)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Cabeçalho */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sair
        </button>
      </header>

      {/* Cards de estatísticas */}
      <StatsCards clients={clients} />

      {/* Gráfico de clientes */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Gráfico de Clientes</h2>
        <ClientsChart clients={clients} />
      </div>

      {/* Tabela de clientes */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Lista de Clientes</h2>
        <ClientsTable clients={clients} />
      </div>
    </div>
  )
}
