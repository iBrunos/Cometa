'use client'

import { IoMdExit } from 'react-icons/io'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchClients, logout, getCurrentUser } from '@/lib/supabase'
import { Client } from '@/lib/supabase'
import ClientsChart from '@/components/ClientsChart'
import StatsCards from '@/components/StatsCards'
import { FaSpinner } from 'react-icons/fa'

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const { data, error } = await fetchClients(1, 1000) // busca até 1000 clientes
        if (error) {
          console.error('Erro ao buscar clientes:', error)
        } else {
          setClients(data || [])
        }
      } catch (err) {
        console.error('Erro inesperado:', err)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoad()
  }, [router])

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
          title="Sair"
        >
          <IoMdExit className="text-xl" />
        </button>
      </header>

      {/* Cards de estatísticas */}
      <StatsCards clients={clients} />

      {/* Gráfico de clientes */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Gráfico de Clientes</h2>
        <ClientsChart clients={clients} />
      </div>
    </div>
  )
}
