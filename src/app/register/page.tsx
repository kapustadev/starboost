'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Registration failed')
        setLoading(false)
        return
      }

      // Automatically sign in after register
      const signInRes = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      })

      if (signInRes?.error) {
        setError('Login after registration failed')
        setLoading(false)
      } else {
        window.location.href = '/dashboard'
      }
    } catch (err) {
      setError('An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-logo" style={{ textDecoration: 'none' }}>
          Stars<span>Boost</span>
        </Link>

        <h2 style={{ textAlign: 'center', marginBottom: '6px', fontSize: '1.4rem' }}>Create your account</h2>
        <p style={{ textAlign: 'center', marginBottom: '28px', fontSize: '0.9rem' }}>Start boosting your reviews today</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '4px' }}>
          <button className="btn btn-google btn-full" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>
          <button className="btn btn-facebook btn-full" onClick={() => signIn('facebook', { callbackUrl: '/dashboard' })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Sign up with Facebook
          </button>
        </div>

        <div className="auth-divider">or register with email</div>

        {error && (
          <div style={{ background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '16px', fontSize: '0.88rem', color: 'var(--red)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="John Smith"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} required/>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" placeholder="you@company.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required/>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Min 8 characters"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={8}/>
          </div>
          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '4px', height: '46px' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          By registering you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--accent)' }}>Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', fontWeight: '600' }}>Sign in →</Link>
        </p>
      </div>
    </div>
  )
}
