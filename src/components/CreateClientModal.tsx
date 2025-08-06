'use client'

import { useState } from 'react'
import { addClient } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function CreateClientModal({
  isOpen,
  onClose,
  onClientCreated
}: {
  isOpen: boolean
  onClose: () => void
  onClientCreated: () => void
}) {
  const [formData, setFormData] = useState({
    Nome: '',
    Email: '',
    Telefone: '',
    nascimento: '',
    cpf: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    Nome: '',
    Email: '',
    Telefone: '',
    cpf: ''
  })

  // Máscara CPF: 000.000.000-00
const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
}
  // Máscara Telefone: (00) 00000-0000
  const formatTelefone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 10) {
      // (00) 0000-0000
      return digits
        .replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
        .trimEnd()
    } else {
      // (00) 00000-0000
      return digits
        .replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
        .trimEnd()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target

    if (name === 'cpf') value = formatCPF(value)
    else if (name === 'Telefone') value = formatTelefone(value)

    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validações
  const validarCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, '')
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

    let soma = 0
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i)
    let resto = 11 - (soma % 11)
    if (resto >= 10) resto = 0
    if (resto !== parseInt(cpf.charAt(9))) return false

    soma = 0
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i)
    resto = 11 - (soma % 11)
    if (resto >= 10) resto = 0
    return resto === parseInt(cpf.charAt(10))
  }

  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validarTelefone = (telefone: string) => {
    const digits = telefone.replace(/\D/g, '')
    return digits.length >= 10 && digits.length <= 11
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const newErrors = {
      Nome: '',
      Email: '',
      Telefone: '',
      cpf: ''
    }
    let isValid = true

    if (!formData.Nome.trim()) {
      newErrors.Nome = 'O nome é obrigatório'
      isValid = false
    }

    if (!formData.Email.trim()) {
      newErrors.Email = 'O email é obrigatório'
      isValid = false
    } else if (!validarEmail(formData.Email)) {
      newErrors.Email = 'Email inválido'
      isValid = false
    }

    if (!formData.Telefone.trim()) {
      newErrors.Telefone = 'O telefone é obrigatório'
      isValid = false
    } else if (!validarTelefone(formData.Telefone)) {
      newErrors.Telefone = 'Telefone inválido (DDD + número)'
      isValid = false
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'O CPF é obrigatório'
      isValid = false
    } else if (!validarCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido'
      isValid = false
    }

    setErrors(newErrors)
    if (!isValid) {
      setLoading(false)
      return
    }

    try {
      const { error } = await addClient({
        ...formData,
        Telefone: formData.Telefone.replace(/\D/g, ''),
        cpf: formData.cpf.replace(/\D/g, '')
      })

      if (error) throw error

      toast.success('Cliente criado com sucesso!')
      onClientCreated()
      onClose()
      setFormData({
        Nome: '',
        Email: '',
        Telefone: '',
        nascimento: '',
        cpf: ''
      })
      setErrors({
        Nome: '',
        Email: '',
        Telefone: '',
        cpf: ''
      })
    } catch (error) {
      toast.error(
        `Erro ao criar cliente: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        }`
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Adicionar Novo Cliente</h3>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {[
              {
                label: 'Nome',
                name: 'Nome',
                type: 'text',
                required: true,
                placeholder: ''
              },
              {
                label: 'Email',
                name: 'Email',
                type: 'email',
                required: true,
                placeholder: ''
              },
              {
                label: 'Telefone',
                name: 'Telefone',
                type: 'text',
                required: true,
                placeholder: '(00) 00000-0000',
                maxLength: 15
              },
              {
                label: 'Data de Nascimento',
                name: 'nascimento',
                type: 'date',
                required: false,
                placeholder: '',
                max: new Date().toISOString().split('T')[0]
              },
              {
                label: 'CPF',
                name: 'cpf',
                type: 'text',
                required: true,
                placeholder: '000.000.000-00',
                maxLength: 14
              }
            ].map(({ label, name, type, required, placeholder, max }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors[name as keyof typeof errors]
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  required={required}
                  placeholder={placeholder}
                  max={max}
                  maxLength={
                    name === 'cpf' ? 14 : name === 'Telefone' ? 15 : undefined
                  }
                />
                {errors[name as keyof typeof errors] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors[name as keyof typeof errors]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Salvando...
                </span>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}