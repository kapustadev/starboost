import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ManageBillingButton } from '@/components/dashboard/ManageBillingButton'

const STATUS_STYLES: Record<string, string> = {
  paid: 'badge-green',
  pending: 'badge-yellow',
  failed: 'badge-red',
  refunded: 'badge-muted',
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const payments = await prisma.payment.findMany({
    where: { userId: session.user.id },
    include: { order: true },
    orderBy: { createdAt: 'desc' },
  })

  const total = payments.reduce((s, p) => s + p.amount, 0)
  const lastPayment = payments.length > 0 ? payments[0].amount : 0

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
          <div className="stat-card-value">${total.toFixed(2)}</div>
          <div className="stat-card-sub">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">🧾 Invoices</div>
          <div className="stat-card-value">{payments.length}</div>
          <div className="stat-card-sub">Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">📅 Last Payment</div>
          <div className="stat-card-value">${lastPayment.toFixed(2)}</div>
          <div className="stat-card-sub">{payments.length > 0 ? new Date(payments[0].createdAt).toLocaleDateString() : 'N/A'}</div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bento-card" style={{marginBottom:'24px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h3 style={{marginBottom: '4px'}}>Payment Methods & Subscriptions</h3>
            <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Manage your cards and billing settings via Stripe</p>
          </div>
          <ManageBillingButton />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="table-wrapper">
        <div className="table-header">
          <h3>Payment History</h3>
        </div>
        {payments.length > 0 ? (
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{p.orderId.slice(-8)}</td>
                  <td style={{ padding: '16px 24px', textTransform: 'capitalize' }}>{p.order.platform}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 24px' }}><strong>${p.amount.toFixed(2)}</strong></td>
                  <td style={{ padding: '16px 24px' }}><span className={`badge ${STATUS_STYLES[p.status]}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No payments found.
          </div>
        )}
      </div>
    </>
  )
}
