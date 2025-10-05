'use client' // Required for interactivity

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IoHomeOutline } from "react-icons/io5";
import { BsPeople } from "react-icons/bs";


export default function DashboardNav() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('Visão Geral')

  const navItems = [
    { name: 'Visão Geral', icon: <IoHomeOutline />, path: '/dashboard' },
    { name: 'Clientes', icon: <BsPeople />, path: '/dashboard/clientes' },
  ]

  const toggleNav = () => setIsOpen(!isOpen)
  const toggleMobileNav = () => setIsMobileOpen(!isMobileOpen)

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileNav}
          className="p-2 rounded-md bg-red-700 text-white"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileNav}
        />
      )}

      {/* Navigation */}
      <aside
        className={`
          ${isOpen ? 'w-64' : 'w-20'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          fixed md:relative h-screen transition-all duration-300 ease-in-out
          flex flex-col bg-red-700 text-white z-50 shadow-lg
        `}
      >
        {/* Logo/Header */}
        <header className="flex items-center justify-between h-16 px-4 border-b border-red-600">
          {isOpen ? (
            <Link href="/logo.png" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="Planeta WiFi Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-bold whitespace-nowrap">Lojas Planeta</h1>
            </Link>
          ) : (
            <Link href="/" className="mx-auto">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="Planeta Icon"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          )}

          <button
            onClick={toggleNav}
            className="hidden md:block p-1 rounded-full hover:bg-red-600 transition-colors"
            aria-label={isOpen ? 'Collapse menu' : 'Expand menu'}
          >
            {isOpen ? '◄' : '►'}
          </button>
        </header>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  onClick={() => {
                    setActiveItem(item.name)
                    setIsMobileOpen(false)
                  }}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-md 
                    ${activeItem === item.name ? 'bg-red-800' : 'hover:bg-red-600'}
                    transition-colors duration-200
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  {isOpen && (
                    <span className="ml-3 whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}