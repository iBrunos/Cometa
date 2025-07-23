import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface Client {
  id: string
  Nome: string
  E_mail: string
  Telefone: string
  created_at: string
}

export const fetchClients = async (): Promise<{ data: Client[] | null, error: any }> => {
  console.log('Fetching clients from Supabase...')
  const { data, error } = await supabase
    .from('Clientes')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}