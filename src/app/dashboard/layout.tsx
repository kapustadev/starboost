'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { label: 'Overview', href: '/dashboard', icon: '◈' },
  { label: 'My Orders', href: '/dashboard/orders', icon: '📦' },
  { label: 'Support Tickets', href: '/dashboard/tickets', icon: '🎫' },
  { label: 'Billing', href: '/dashboard/billing', icon: '💳' },
  { label: 'Profile', href: '/dashboard/profile', icon: '👤' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          Stars<span>Boost</span>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-section-label">Menu</span>
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
            >
              <span style={{fontSize:'1rem'}}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="sidebar-section" style={{marginTop:'16px'}}>
          <span className="sidebar-section-label">Quick Order</span>
          <Link href="/services/google" className="sidebar-link">
            <span>🅖</span> Google Reviews
          </Link>
          <Link href="/services/facebook" className="sidebar-link">
            <span>📘</span> Facebook Reviews
          </Link>
          <Link href="/services/trustpilot" className="sidebar-link">
            <span>⭐</span> Trustpilot Reviews
          </Link>
        </div>

        <div className="sidebar-bottom">
          <Link href="/" className="sidebar-link">
            <span>←</span> Back to Site
          </Link>
          <button className="sidebar-link btn-ghost" style={{width:'100%',textAlign:'left',border:'none',background:'none',color:'var(--red)',marginTop:'4px'}}>
            <span>⏻</span> Sign Out
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
