'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password === 'sanvicente2026') {
      document.cookie = 'sv_admin_session=authenticated; path=/; max-age=86400; SameSite=Strict'
      router.push('/gestion-sv/dashboard')
    } else {
      setError('Contraseña incorrecta')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ width: '100%', maxWidth: '360px', padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              backgroundColor: '#111111',
              borderRadius: '12px',
              marginBottom: '20px',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L26 8V20L14 26L2 20V8L14 2Z" stroke="white" strokeWidth="2" fill="none" />
              <path d="M14 8L20 11V17L14 20L8 17V11L14 8Z" fill="white" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#111111',
              letterSpacing: '-0.5px',
              margin: '0 0 4px 0',
            }}
          >
            San Vicente
          </h1>
          <p style={{ fontSize: '13px', color: '#888888', margin: 0 }}>
            Panel de administración
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#444444',
                marginBottom: '8px',
              }}
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: error ? '1.5px solid #ef4444' : '1.5px solid #e5e5e5',
                borderRadius: '10px',
                outline: 'none',
                backgroundColor: '#fafafa',
                color: '#111111',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = '#111111'
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = '#e5e5e5'
              }}
            />
            {error && (
              <p
                style={{
                  fontSize: '13px',
                  color: '#ef4444',
                  margin: '8px 0 0 0',
                }}
              >
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              padding: '13px',
              backgroundColor: loading || !password ? '#cccccc' : '#111111',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '10px',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s',
              letterSpacing: '0.2px',
            }}
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
