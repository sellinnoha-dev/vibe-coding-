'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

export function AuthForm({ type }: { type: 'login' | 'signup' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const payload =
        type === 'login'
          ? { email: formData.email, password: formData.password }
          : formData

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      const data = await response.json()
      localStorage.setItem('auth-token', data.token)
      setSuccess(true)

      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4"
    >
      {type === 'signup' && (
        <div>
          <label className="block text-sm font-medium text-primary dark:text-white mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-accent"
            placeholder="John Doe"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-primary dark:text-white mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-accent"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary dark:text-white mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-accent"
          placeholder="••••••"
        />
      </div>

      {type === 'signup' && (
        <div>
          <label className="block text-sm font-medium text-primary dark:text-white mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-accent"
            placeholder="••••••"
          />
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm"
        >
          ✓ {type === 'login' ? 'Login' : 'Account created'} successfully! Redirecting...
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-accent text-primary font-bold rounded-lg hover:bg-cyan-300 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : type === 'login' ? 'Login' : 'Create Account'}
      </motion.button>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400">
        {type === 'login' ? (
          <>
            Don't have an account?{' '}
            <Link href="/signup" className="text-accent hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:underline">
              Login
            </Link>
          </>
        )}
      </div>
    </motion.form>
  )
}
