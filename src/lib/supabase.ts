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

// Função original para buscar clientes
export const fetchClients = async () => {
  const { data, error } = await supabase
    .from('Clientes')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}