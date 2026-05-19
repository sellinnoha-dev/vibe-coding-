'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function Navigation() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('auth-token')
    setIsLoggedIn(!!token)
  }, [])

  const navItems = [
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 w-full bg-white/10 dark:bg-slate-900/10 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-700"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-accent">
          Vibe Pro
        </Link>

        <div className="flex items-center gap-8">
          <ul className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-slate-600 dark:text-slate-300 hover:text-accent transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {mounted && (
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-accent hover:text-cyan-300 transition-colors font-bold"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('auth-token')
                      setIsLoggedIn(false)
                      window.location.reload()
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-slate-600 dark:text-slate-300 hover:text-accent transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-cyan-300 transition-colors font-bold"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
