'use client'

import { Client } from '@/lib/supabase'
import { FaSpinner, FaFilePdf, FaFileExcel, FaFileCsv } from 'react-icons/fa'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

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
  onPageChange = () => {},
}: ClientsTableProps) {
  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text('Relatório de Clientes', 14, 16)

    const headers = [['Nome', 'E-mail', 'Telefone', 'Data Cadastro']]
    const data = clients.map(client => [
      client.Nome,
      client.Email || '-',
      client.Telefone || '-',
      new Date(client.created_at).toLocaleDateString('pt-BR'),
    ])

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 20,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
      },
    })

    doc.save(`clientes_${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      clients.map(client => ({
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
      ...clients.map(client => [
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
    <div className="overflow-x-auto relative">
      {/* Export buttons */}
      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={exportToPDF}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          <FaFilePdf className="mr-2" /> PDF
        </button>
        <button
          onClick={exportToExcel}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <FaFileExcel className="mr-2" /> Excel
        </button>
        <button
          onClick={exportToCSV}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaFileCsv className="mr-2" /> CSV
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <FaSpinner className="animate-spin h-8 w-8 text-indigo-600" />
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              E-mail
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Telefone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data Cadastro
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map(client => (
            <tr key={client.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {client.Nome}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.Email || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.Telefone || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(client.created_at).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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
