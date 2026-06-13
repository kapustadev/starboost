import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 style={{ marginBottom: '4px' }}>My Orders</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track the status of your review campaigns.</p>
        </div>
        <Link href="/services/google" className="btn btn-primary">
          + New Order
        </Link>
      </div>

      <div className="table-wrapper">
        <div className="table-header">
          <h3 style={{ fontSize: '1.1rem' }}>All Orders ({orders.length})</h3>
        </div>
        {orders.length > 0 ? (
          <>
          {/* Desktop Table */}
          <div className="desktop-only">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target URL</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progress</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 500, textTransform: 'capitalize' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{order.platform} <span style={{ textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: '0.8rem' }}>({order.country})</span></span>
                      {order.isBulk && (
                        <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Bulk</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={order.targetUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                      Link
                    </a>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${(order.deliveredCount / order.quantity) * 100}%`, height: '100%', background: 'var(--green)' }} />
                      </div>
                      <span style={{ fontSize: '0.85rem' }}>{order.deliveredCount}/{order.quantity}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`badge badge-${order.status === 'completed' ? 'green' : order.status === 'processing' ? 'blue' : order.status === 'cancelled' ? 'red' : 'yellow'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 600 }}>
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {order.status !== 'pending' && order.status !== 'cancelled' && (
                      <Link href={`/dashboard/orders/${order.id}/chat`} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px' }}>
                        💬 Chat
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-only" style={{ flexDirection: 'column' }}>
            {orders.map(order => (
              <div key={order.id} className="order-mobile-card">
                <div className="order-mobile-card-row">
                  <span className="order-mobile-card-label">Date</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="order-mobile-card-row">
                  <span className="order-mobile-card-label">Platform</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>
                      {order.platform} <span style={{ textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: '0.8rem' }}>({order.country})</span>
                    </span>
                    {order.isBulk && (
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Bulk</span>
                    )}
                  </div>
                </div>
                <div className="order-mobile-card-row">
                  <span className="order-mobile-card-label">Target URL</span>
                  <a href={order.targetUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Link
                  </a>
                </div>
                <div className="order-mobile-card-row">
                  <span className="order-mobile-card-label">Progress</span>
                  <span>{order.deliveredCount} / {order.quantity}</span>
                </div>
                <div className="order-mobile-card-row">
                  <span className="order-mobile-card-label">Status</span>
                  <span className={`badge badge-${order.status === 'completed' ? 'green' : order.status === 'processing' ? 'blue' : order.status === 'cancelled' ? 'red' : 'yellow'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-mobile-card-row">
                  <span className="order-mobile-card-label">Total</span>
                  <span style={{ fontWeight: 600 }}>${order.totalPrice.toFixed(2)}</span>
                </div>
                {order.status !== 'pending' && order.status !== 'cancelled' && (
                  <div style={{ marginTop: '8px' }}>
                    <Link href={`/dashboard/orders/${order.id}/chat`} className="btn btn-secondary btn-full">
                      💬 Order Chat
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
          </>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No orders found. <Link href="/services/google" style={{ color: 'var(--accent)' }}>Create your first order</Link>.
          </div>
        )}
      </div>
    </>
  )
}
