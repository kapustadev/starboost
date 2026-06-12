'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, ShoppingBag, Ticket, CreditCard, User, ArrowLeft, LogOut } from 'lucide-react'
import Image from 'next/image'
import { PLATFORMS } from '@/lib/data'

const NAV = [
  { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'My Orders', href: '/dashboard/orders', icon: <ShoppingBag size={18} /> },
  { label: 'Support Tickets', href: '/dashboard/tickets', icon: <Ticket size={18} /> },
  { label: 'Billing', href: '/dashboard/billing', icon: <CreditCard size={18} /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <User size={18} /> },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
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
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="sidebar-section" style={{marginTop:'16px'}}>
          <span className="sidebar-section-label">Quick Order</span>
          {PLATFORMS.map(p => (
            <Link key={p.id} href={`/dashboard/order/${p.id}`} className="sidebar-link">
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
