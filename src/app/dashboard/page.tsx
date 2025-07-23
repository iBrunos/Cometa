import { fetchClients } from '@/lib/supabase'
import ClientsTable from '@/components/ClientsTable'
import ClientsChart from '@/components/ClientsChart'

export default async function DashboardPage() {
  const { data: clients } = await fetchClients()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard de Clientes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <ClientsChart clients={clients || []} />
        </div>
        
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lista de Clientes</h2>
          <ClientsTable clients={clients || []} />
        </div>
      </div>
    </div>
  )
}