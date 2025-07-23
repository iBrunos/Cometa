'use client'

import { useState, useMemo } from 'react'
import { Client } from '@/lib/supabase'
import { FaSpinner, FaFilePdf, FaFileExcel, FaFileCsv } from 'react-icons/fa'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { GoTriangleDown } from 'react-icons/go'

interface ClientsTableProps {
  clients: Client[]
  loading?: boolean
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export default function ClientsTable({
  clients,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => { },
}: ClientsTableProps) {
  const [searchNome, setSearchNome] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [searchDDD, setSearchDDD] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const nomeMatch = client.Nome?.toLowerCase().includes(searchNome.toLowerCase())
      const emailMatch = client.Email?.toLowerCase().includes(searchEmail.toLowerCase())
      const ddd = client.Telefone?.match(/\((\d{2,3})\)/)?.[1] || ''
      const dddMatch = ddd.includes(searchDDD)

      const createdAt = new Date(client.created_at)
      const afterStart = startDate ? createdAt >= new Date(startDate) : true
      const beforeEnd = endDate ? createdAt <= new Date(endDate) : true

      return nomeMatch && emailMatch && dddMatch && afterStart && beforeEnd
    })
  }, [clients, searchNome, searchEmail, searchDDD, startDate, endDate])


  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text('Relatório de Clientes', 14, 16)

    const headers = [['Nome', 'E-mail', 'Telefone', 'Data Cadastro']]
    const data = filteredClients.map(client => [
      client.Nome,
      client.Email || '-',
      client.Telefone || '-',
      new Date(client.created_at).toLocaleDateString('pt-BR'),
    ])

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 20,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    })

    doc.save(`clientes_${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredClients.map(client => ({
        Nome: client.Nome,
        Email: client.Email || '-',
        Telefone: client.Telefone || '-',
        'Data Cadastro': new Date(client.created_at).toLocaleDateString('pt-BR'),
      }))
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes')
    XLSX.writeFile(workbook, `clientes_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Nome', 'E-mail', 'Telefone', 'Data Cadastro'],
      ...filteredClients.map(client => [
        client.Nome,
        client.Email || '-',
        client.Telefone || '-',
        new Date(client.created_at).toLocaleDateString('pt-BR'),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `clientes_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="overflow-x-auto relative bg-white p-4 rounded-lg shadow border border-gray-200">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Filtrar por nome"
          value={searchNome}
          onChange={e => setSearchNome(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          placeholder="Filtrar por e-mail"
          value={searchEmail}
          onChange={e => setSearchEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          placeholder="Filtrar por DDD"
          value={searchDDD}
          onChange={e => setSearchDDD(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
          placeholder="Data inicial"
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
          placeholder="Data final"
        />
      </div>

      {/* Botão de exportação dropdown */}
      <div className="relative mb-4 text-right">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded inline-flex items-center"
        >
          Exportar <GoTriangleDown className="ml-2" />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
            <ul className="text-sm text-gray-700">
              <li>
                <button
                  onClick={() => {
                    exportToPDF()
                    setDropdownOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                >
                  <FaFilePdf className="mr-2 text-red-500" /> PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    exportToExcel()
                    setDropdownOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                >
                  <FaFileExcel className="mr-2 text-green-500" /> Excel
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    exportToCSV()
                    setDropdownOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                >
                  <FaFileCsv className="mr-2 text-blue-500" /> CSV
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-mail</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Cadastro</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredClients.map(client => (
            <tr key={client.id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{client.Nome}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{client.Email || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{client.Telefone || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(client.created_at).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}