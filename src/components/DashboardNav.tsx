export default function DashboardNav() {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col bg-red-700 text-white">
      <div className="flex items-center justify-center h-16 px-4">
        <h1 className="text-xl font-bold">Cometa WiFi</h1>
      </div>
      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          <a
            href="#"
            className="block px-4 py-2 text-sm font-medium rounded-md bg-red-800"
          >
            Visão Geral
          </a>
        </div>
      </nav>
    </div>
  )
}