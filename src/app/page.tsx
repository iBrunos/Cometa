import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase'

export default async function Home() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  } else {
    redirect('/dashboard')
  }
}