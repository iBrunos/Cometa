import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Clientes Planeta',
  description: 'Dashboard para as Lojas Planeta ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" className='h-full'>
      <link rel="icon" href="/icon?<generated>" type="image/png" sizes="32x32" />
      <body className={`${inter.className} h-full bg-slate-800`}>{children}</body>
    </html>
  )
}
