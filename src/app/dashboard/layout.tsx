'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, ShoppingBag, Ticket, CreditCard, User, ArrowLeft, LogOut } from 'lucide-react'
import Image from 'next/image'
import { PLATFORMS } from '@/lib/data'

import { useState } from 'react'

const NAV = [
  { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'My Orders', href: '/dashboard/orders', icon: <ShoppingBag size={18} /> },
  { label: 'Support Tickets', href: '/dashboard/tickets', icon: <Ticket size={18} /> },
  { label: 'Billing', href: '/dashboard/billing', icon: <CreditCard size={18} /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <User size={18} /> },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <div className="dashboard-mobile-header">
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Stars<span style={{ color: 'var(--accent)' }}>Boost</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          {mobileOpen ? <LogOut size={24} style={{ transform: 'rotate(45deg)' }} /> : <LayoutDashboard size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="sidebar-logo">
            Stars<span>Boost</span>
          </div>
        </Link>

        <div className="sidebar-section">
          <span className="sidebar-section-label">Menu</span>
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="sidebar-section" style={{marginTop:'16px'}}>
          <span className="sidebar-section-label">Quick Order</span>
          {PLATFORMS.map(p => (
            <Link key={p.id} href={`/dashboard/order/${p.id}`} className="sidebar-link" onClick={() => setMobileOpen(false)}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Image src={p.icon} alt={p.name} width={18} height={18} style={{ borderRadius: '4px' }} />
              </span>
              {p.shortName} Reviews
            </Link>
          ))}
        </div>

        <div className="sidebar-bottom">
          <Link href="/" className="sidebar-link">
            <span style={{ display: 'flex', alignItems: 'center' }}><ArrowLeft size={18} /></span> Back to Site
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="sidebar-link btn-ghost" style={{width:'100%',textAlign:'left',border:'none',background:'none',color:'var(--red)',marginTop:'4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px'}}>
            <span style={{ display: 'flex', alignItems: 'center' }}><LogOut size={18} /></span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  )
}
