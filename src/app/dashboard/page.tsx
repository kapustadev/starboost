'use client'

import Link from 'next/link'

const MOCK_ORDERS = [
  { id: 'ORD-001', platform: 'Google', country: '🇺🇸 USA', qty: 25, price: 250, status: 'completed', delivered: 25, date: '2025-06-08' },
  { id: 'ORD-002', platform: 'Facebook', country: '🇵🇱 Poland', qty: 10, price: 60, status: 'processing', delivered: 6, date: '2025-06-10' },
  { id: 'ORD-003', platform: 'Google', country: '🇩🇪 Germany', qty: 50, price: 525, status: 'pending', delivered: 0, date: '2025-06-12' },
]

const MOCK_TICKETS = [
  { id: 'TKT-001', subject: 'Question about delivery timeline', status: 'open', date: '2025-06-11' },
  { id: 'TKT-002', subject: 'Review replacement request', status: 'resolved', date: '2025-06-05' },
]

const STATUS_COLORS: Record<string, string> = {
  completed: 'badge-green',
  processing: 'badge-blue',
  pending: 'badge-yellow',
  partial: 'badge-yellow',
  cancelled: 'badge-red',
  open: 'badge-yellow',
  in_progress: 'badge-blue',
  resolved: 'badge-green',
  closed: 'badge-muted',
}

export default function DashboardPage() {
  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Good morning 👋</h1>
          <p style={{color:'var(--text-muted)',fontSize:'0.9rem',marginTop:'4px'}}>Here&apos;s your account overview</p>
        </div>
        <Link href="/services/google" className="btn btn-primary">
          + New Order
        </Link>
      </div>

      {/* STATS */}
      <div className="bento-grid bento-grid-4" style={{marginBottom:'24px'}}>
        <div className="stat-card">
          <div className="stat-card-label">📦 Total Orders</div>
          <div className="stat-card-value">3</div>
          <div className="stat-card-sub">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">⭐ Reviews Delivered</div>
          <div className="stat-card-value">31</div>
          <div className="stat-card-sub">Across all platforms</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">💳 Total Spent</div>
          <div className="stat-card-value">$835</div>
          <div className="stat-card-sub">USD</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">🎫 Open Tickets</div>
          <div className="stat-card-value">1</div>
          <div className="stat-card-sub">
            <Link href="/dashboard/tickets" style={{color:'var(--accent)'}}>View →</Link>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="table-wrapper" style={{marginBottom:'24px'}}>
        <div className="table-header">
          <h3>Recent Orders</h3>
          <Link href="/dashboard/orders" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Platform</th>
              <th>Country</th>
              <th>Qty</th>
              <th>Progress</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.map(o => (
              <tr key={o.id}>
                <td><span style={{fontWeight:600,color:'var(--accent)'}}>{o.id}</span></td>
                <td>{o.platform}</td>
                <td>{o.country}</td>
                <td>{o.qty}</td>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',minWidth:'120px'}}>
                    <div className="progress-bar" style={{flex:1}}>
                      <div
                        className={`progress-fill ${o.status === 'completed' ? 'green' : ''}`}
                        style={{width:`${(o.delivered/o.qty)*100}%`}}
                      />
                    </div>
                    <span style={{fontSize:'0.8rem',color:'var(--text-muted)',whiteSpace:'nowrap'}}>
                      {o.delivered}/{o.qty}
                    </span>
                  </div>
                </td>
                <td><span style={{fontWeight:600}}>${o.price}</span></td>
                <td>
                  <span className={`badge ${STATUS_COLORS[o.status]}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BOTTOM GRID */}
      <div className="bento-grid" style={{gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
        {/* Recent Tickets */}
        <div className="table-wrapper">
          <div className="table-header">
            <h3>Support Tickets</h3>
            <Link href="/dashboard/tickets" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'10px'}}>
            {MOCK_TICKETS.map(t => (
              <Link key={t.id} href={`/dashboard/tickets/${t.id}`} className="ticket-card">
                <div className="ticket-icon">🎫</div>
                <div className="ticket-content">
                  <div className="ticket-subject">{t.subject}</div>
                  <div className="ticket-meta">
                    <span>{t.id}</span>
                    <span>{t.date}</span>
                  </div>
                </div>
                <span className={`badge ${STATUS_COLORS[t.status]}`}>{t.status}</span>
              </Link>
            ))}
            <Link href="/dashboard/tickets/new" className="btn btn-secondary btn-sm" style={{marginTop:'4px',justifyContent:'center'}}>
              + Open New Ticket
            </Link>
          </div>
        </div>

        {/* Quick Order Card */}
        <div className="bento-card accent-card">
          <h3 style={{marginBottom:'8px'}}>Quick Order</h3>
          <p style={{fontSize:'0.88rem',marginBottom:'24px'}}>
            Need more reviews? Order directly from your dashboard.
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <Link href="/services/google" className="btn btn-primary btn-full" style={{justifyContent:'center'}}>
              🅖 Google Reviews
            </Link>
            <Link href="/services/facebook" className="btn btn-secondary btn-full" style={{justifyContent:'center'}}>
              📘 Facebook Reviews
            </Link>
            <Link href="/services/trustpilot" className="btn btn-secondary btn-full" style={{justifyContent:'center'}}>
              ⭐ Trustpilot Reviews
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
