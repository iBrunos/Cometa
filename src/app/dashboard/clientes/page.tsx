'use client'

import { useState, useEffect } from 'react'
import ClientsTable from '@/components/ClientsTable'
import { useRouter } from 'next/navigation'
import { fetchClients, Client, logout, fetchAllClients } from '@/lib/supabase'
import { FaArrowLeft, FaArrowRight, FaPlus } from 'react-icons/fa'
import { IoMdExit } from 'react-icons/io'
import CreateClientModal from '@/components/CreateClientModal'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [allClients, setAllClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const router = useRouter()

  // Carrega os clientes da página atual
  const loadPaginatedClients = async () => {
    setLoading(true)
    try {
      const { data, error, totalPages } = await fetchClients(currentPage)
      if (error) {
        console.error('Erro ao buscar clientes:', error)
      } else {
        setClients(data || [])
        setTotalPages(totalPages)
      }
    } catch (error) {
      console.error('Erro inesperado:', error)
    } finally {
      setLoading(false)
    }
  }

  // Carrega TODOS os clientes para exportação
  const loadAllClients = async () => {
    try {
      const { data } = await fetchAllClients()
      setAllClients(data || [])
    } catch (error) {
      console.error('Erro ao carregar todos os clientes:', error)
    }
  }

  useEffect(() => {
    loadPaginatedClients()
    loadAllClients() // Carrega todos os clientes apenas uma vez
  }, [currentPage])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const handleClientCreated = () => {
    // Recarrega ambos os conjuntos de dados
    loadPaginatedClients()
    loadAllClients()
    setIsCreateModalOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Lista de Clientes</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <FaPlus /> Novo Cliente
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                title="Sair"
              >
                <IoMdExit className="text-xl" />
              </button>
            </div>
          </div>

          <CreateClientModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onClientCreated={handleClientCreated}
          />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <>
              <ClientsTable
                allClients={allClients}
                clients={clients}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </main>
    </div>
  )
}