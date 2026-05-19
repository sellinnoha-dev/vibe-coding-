'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface User {
  email: string
  name: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    // Decode JWT to get user info
    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        const decoded = JSON.parse(atob(parts[1]))
        // In a real app, you'd fetch user data from an API
        setUser({
          email: decoded.userId,
          name: decoded.userId.split('@')[0],
        })
      }
    } catch (error) {
      console.error('Error decoding token:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('auth-token')
    window.location.href = '/'
  }

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <section className="min-h-screen bg-gradient-to-br from-primary to-slate-800 pt-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Dashboard
                </h1>
                <p className="text-slate-300">
                  Welcome back, <span className="text-accent">{user?.name}</span>!
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-slate-900/50 border border-slate-700 rounded-xl"
            >
              <div className="text-4xl mb-2">📧</div>
              <h3 className="text-white font-bold mb-2">Email</h3>
              <p className="text-slate-300 text-sm">{user?.email}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-slate-900/50 border border-slate-700 rounded-xl"
            >
              <div className="text-4xl mb-2">📊</div>
              <h3 className="text-white font-bold mb-2">Account Status</h3>
              <p className="text-accent text-sm">✓ Active</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-slate-900/50 border border-slate-700 rounded-xl"
            >
              <div className="text-4xl mb-2">🔐</div>
              <h3 className="text-white font-bold mb-2">Security</h3>
              <p className="text-slate-300 text-sm">Secure login</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-slate-900/50 border border-slate-700 rounded-xl"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Quick Links</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/#services"
                className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors"
              >
                ← Back to Services
              </Link>
              <Link
                href="/#portfolio"
                className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors"
              >
                View Portfolio →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  )
}
