'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { PLATFORMS } from '@/lib/data'
import { useSession } from 'next-auth/react'
import { Calculator } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
            Stars<span>Boost</span>
          </Link>

          <ul className="navbar-nav">
            <li style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setServicesOpen(v => !v)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: servicesOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: servicesOpen ? 'var(--bg-card)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                Services
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: servicesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {servicesOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '8px',
                  minWidth: '240px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200,
                }}>
                  {PLATFORMS.map(p => (
                    <Link
                      key={p.id}
                      href={`/services/${p.id}`}
                      onClick={() => setServicesOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        transition: 'background 0.15s',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Image src={p.icon} alt={p.name} width={24} height={24} style={{ borderRadius: '6px' }} />
                      {p.name}
                    </Link>
                  ))}
                  <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
                  <Link
                    href="/tools/rating-calculator"
                    onClick={() => setServicesOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      transition: 'background 0.15s',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-glow)', borderRadius: '6px' }}>
                      <Calculator size={14} color="var(--accent)" />
                    </div>
                    Rating Calculator
                  </Link>
                </div>
              )}
            </li>

            <li><Link href="/#pricing">Pricing</Link></li>
            <li><Link href="/#how">How it works</Link></li>
            <li><Link href="/#faq">FAQ</Link></li>
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="navbar-actions">
              {status === 'loading' ? (
                <div style={{ width: '180px' }}></div>
              ) : session ? (
                <Link href="/dashboard" className="btn btn-primary btn-sm mobile-hidden">Go to Dashboard</Link>
              ) : (
                <>
                  <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                  <Link href="/register" className="btn btn-primary btn-sm mobile-hidden">Get Started</Link>
                </>
              )}
            </div>

            <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`}>
        <Link href="/#pricing" onClick={() => setMobileOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 500 }}>Pricing</Link>
        <Link href="/#how" onClick={() => setMobileOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 500 }}>How it works</Link>
        <Link href="/#faq" onClick={() => setMobileOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 500 }}>FAQ</Link>
        
        <div style={{ margin: '16px 0', height: '1px', background: 'var(--border)' }} />
        
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Services</div>
        {PLATFORMS.map(p => (
          <Link key={p.id} href={`/services/${p.id}`} onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem' }}>
            <Image src={p.icon} alt={p.name} width={24} height={24} style={{ borderRadius: '6px' }} />
            {p.name}
          </Link>
        ))}
        <Link href="/tools/rating-calculator" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem' }}>
          <Calculator size={20} color="var(--accent)" /> Rating Calculator
        </Link>
        
        <div style={{ margin: '16px 0', height: '1px', background: 'var(--border)' }} />
        
        {session ? (
          <Link href="/dashboard" className="btn btn-primary btn-full" onClick={() => setMobileOpen(false)}>Go to Dashboard</Link>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/login" className="btn btn-secondary btn-full" onClick={() => setMobileOpen(false)}>Sign In</Link>
            <Link href="/register" className="btn btn-primary btn-full" onClick={() => setMobileOpen(false)}>Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
