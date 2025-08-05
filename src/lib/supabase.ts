import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos
export interface User {
  id: string
  email: string
}

export interface Client {
  id: string
  Nome: string
  Email: string
  Telefone: string
  created_at: string
  nascimento: string
  cpf: string
}

// Funções de autenticação
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { user: data.user, error }
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const fetchClients = async (page: number, pageSize = 10) => {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('Clientes')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = count ? Math.ceil(count / pageSize) : 1

  return { data, error, totalPages }
}


export const deleteClient = async (id: string) => {
  const { error } = await supabase.from('Clientes').delete().eq('id', id)
  return { error }
}
