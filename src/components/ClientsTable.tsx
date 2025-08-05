'use client'

import { useState, useMemo } from 'react'
import { Client } from '@/lib/supabase'
import { FaSpinner, FaFilePdf, FaFileExcel, FaFileCsv } from 'react-icons/fa'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { GoTriangleDown } from 'react-icons/go'
import { TbFileExport } from "react-icons/tb";

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
  const [searchCPF, setSearchCPF] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('Todos')
  const TIME_FILTERS = ['Todos', 'Últimos 7 dias', 'Últimos 30 dias']

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const filteredClients = useMemo(() => {
    const now = new Date()

    return clients.filter(client => {
      const nomeMatch = client.Nome?.toLowerCase().includes(searchNome.toLowerCase())
      const emailMatch = client.Email?.toLowerCase().includes(searchEmail.toLowerCase())
      const ddd = client.Telefone?.match(/\((\d{2,3})\)/)?.[1] || ''
      const dddMatch = ddd.includes(searchDDD)
      const cpfMatch = client.cpf?.replace(/\D/g, '').includes(searchCPF.replace(/\D/g, ''))

      const createdDate = new Date(client.created_at)
      const diffDays = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)

      const timeMatch =
        selectedTime === 'Todos' ||
        (selectedTime === 'Últimos 7 dias' && diffDays <= 7) ||
        (selectedTime === 'Últimos 30 dias' && diffDays <= 30)

      return nomeMatch && emailMatch && dddMatch && cpfMatch && timeMatch
    })
  }, [clients, searchNome, searchEmail, searchDDD, searchCPF, selectedTime])

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text('Relatório de Clientes', 14, 16)

    const headers = [['Nome', 'E-mail', 'Telefone', 'Nascimento', 'CPF', 'Data Cadastro']]
    const data = filteredClients.map(client => [
      client.Nome,
      client.Email || '-',
      client.Telefone || '-',
      client.nascimento || '-',
      client.cpf || '-',
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

  function formatCPF(cpf: string): string {
    const cleaned = cpf.replace(/\D/g, '')
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredClients.map(client => ({
        Nome: client.Nome,
        Email: client.Email || '-',
        Telefone: client.Telefone || '-',
        Nascimento: client.nascimento || '-',
        CPF: client.cpf || '-',
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
        client.nascimento || '-',
        client.cpf || '-',
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="flex gap-2 flex-wrap col-span-full">
          {TIME_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedTime(filter)}
              className={`text-gray-800 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-4 py-2 flex items-center gap-1
                ${selectedTime === filter ? 'ring-2 ring-blue-300 bg-gray-200' : ''}
              `}
            >
              {filter}
            </button>
          ))}
        </div>

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
          type="text"
          placeholder="Filtrar por CPF"
          value={searchCPF}
          onChange={e => setSearchCPF(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
      </div>

      {/* Botão de exportação dropdown */}
      <div className="relative mb-4 text-right">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded inline-flex items-center"
        >
          <TbFileExport /> <GoTriangleDown className="ml-2" title='Exportar'/>
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

      {/* Tabela para telas maiores (md para cima) */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-mail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nascimento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPF</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Cadastro</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map(client => (
              <tr key={client.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{client.Nome}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{client.Email || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{client.Telefone || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{client.nascimento || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{client.cpf ? formatCPF(client.cpf) : '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(client.created_at).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards para telas pequenas (md para baixo) */}
      <div className="md:hidden space-y-4">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="space-y-2">
              <div>
                <h3 className="font-medium text-gray-900">{client.Nome}</h3>
                <p className="text-sm text-gray-500">{client.Email || '-'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium text-gray-500">Telefone</p>
                  <p>{client.Telefone || '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Nascimento</p>
                  <p>{client.nascimento || '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">CPF</p>
                  <p>{client.cpf ? formatCPF(client.cpf) : '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Cadastro</p>
                  <p>{new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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