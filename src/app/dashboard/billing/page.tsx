'use client'

const PAYMENTS = [
  { id: 'PAY-001', orderId: 'ORD-001', platform: 'Google', amount: 250, status: 'paid', date: '2025-06-08', method: '•••• 4242' },
  { id: 'PAY-002', orderId: 'ORD-002', platform: 'Facebook', amount: 60, status: 'paid', date: '2025-06-10', method: '•••• 4242' },
  { id: 'PAY-003', orderId: 'ORD-003', platform: 'Google', amount: 525, status: 'paid', date: '2025-06-12', method: '•••• 4242' },
  { id: 'PAY-004', orderId: 'ORD-004', platform: 'Trustpilot', amount: 165, status: 'paid', date: '2025-05-28', method: 'PayPal' },
]

const STATUS_STYLES: Record<string, string> = {
  paid: 'badge-green',
  pending: 'badge-yellow',
  failed: 'badge-red',
  refunded: 'badge-muted',
}

export default function BillingPage() {
  const total = PAYMENTS.reduce((s, p) => s + p.amount, 0)

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Billing</h1>
          <p style={{color:'var(--text-muted)',fontSize:'0.9rem',marginTop:'4px'}}>Payment history and invoices</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bento-grid bento-grid-3" style={{marginBottom:'24px'}}>
        <div className="stat-card">
          <div className="stat-card-label">💳 Total Spent</div>
          <div className="stat-card-value">${total}</div>
          <div className="stat-card-sub">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">🧾 Invoices</div>
          <div className="stat-card-value">{PAYMENTS.length}</div>
          <div className="stat-card-sub">Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">📅 Last Payment</div>
          <div className="stat-card-value">$525</div>
          <div className="stat-card-sub">Jun 12, 2025</div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bento-card" style={{marginBottom:'24px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
          <h3>Payment Methods</h3>
          <button className="btn btn-secondary btn-sm">+ Add Card</button>
        </div>
        <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
          <div style={{
            background:'var(--bg-secondary)',
            border:'1px solid var(--accent)',
            borderRadius:'var(--radius-lg)',
            padding:'16px 20px',
            display:'flex',
            alignItems:'center',
            gap:'14px',
            minWidth:'220px',
          }}>
            <span style={{fontSize:'1.6rem'}}>💳</span>
            <div>
              <div style={{fontWeight:600,fontSize:'0.9rem'}}>Visa •••• 4242</div>
              <div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>Expires 12/27 · Default</div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="table-wrapper">
        <div className="table-header">
          <h3>Payment History</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Order</th>
              <th>Platform</th>
              <th>Date</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map(p => (
              <tr key={p.id}>
                <td><span style={{fontWeight:600,color:'var(--accent)'}}>{p.id}</span></td>
                <td style={{color:'var(--text-secondary)'}}>{p.orderId}</td>
                <td>{p.platform}</td>
                <td style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>{p.date}</td>
                <td style={{fontSize:'0.85rem',color:'var(--text-secondary)'}}>{p.method}</td>
                <td><strong>${p.amount}</strong></td>
                <td><span className={`badge ${STATUS_STYLES[p.status]}`}>{p.status}</span></td>
                <td>
                  <button className="btn btn-ghost btn-sm" style={{fontSize:'0.8rem',color:'var(--accent)'}}>
                    📄 PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
