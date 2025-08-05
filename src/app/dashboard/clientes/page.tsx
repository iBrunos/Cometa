'use client'

import { useState, useEffect } from 'react'
import ClientsTable from '@/components/ClientsTable'
import { fetchClients, Client } from '@/lib/supabase'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const loadData = async () => {
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

    loadData()
  }, [currentPage])

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Lista de Clientes</h2>
            <div className="text-sm text-gray-500">
              {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'} encontrados
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <>
              <ClientsTable
                clients={clients}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  <FaArrowLeft />
                  Anterior
                </button>

                <span className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Próxima
                  <FaArrowRight />
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
