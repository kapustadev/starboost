import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { UnpaidOrderAlert } from '@/components/dashboard/UnpaidOrderAlert'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  // Automatically cancel pending orders older than 30 minutes
  const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000)
  try {
    await prisma.order.updateMany({
      where: {
        userId: session.user.id,
        status: 'pending',
        createdAt: { lt: thirtyMinsAgo }
      },
      data: { status: 'cancelled' }
    })
  } catch (e) {
    console.error('Failed to auto-cancel orders', e)
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) redirect('/login')

  const totalSpent = user.orders.reduce((sum, order) => sum + (order.status !== 'cancelled' && order.status !== 'pending' ? order.totalPrice : 0), 0)
  const totalReviews = user.orders.reduce((sum, order) => sum + (order.status !== 'cancelled' && order.status !== 'pending' ? order.quantity : 0), 0)
  const activeOrders = user.orders.filter(o => o.status === 'processing').length
  const pendingOrders = user.orders.filter(o => o.status === 'pending')

  const recentOrders = user.orders.slice(0, 5)

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 style={{ marginBottom: '4px' }}>Welcome back, {user.name || 'User'}!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here is what&apos;s happening with your projects today.</p>
        </div>
        <Link href="/dashboard/order/google" className="btn btn-primary">
          + New Order
        </Link>
      </div>

      {pendingOrders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {pendingOrders.map(order => (
            <UnpaidOrderAlert key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* STATS */}
      <div className="bento-grid bento-grid-3" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Reviews Ordered</div>
          <div className="stat-card-value">{totalReviews}</div>
          <div className="stat-card-sub" style={{ color: 'var(--green)' }}>All platforms</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Active Orders</div>
          <div className="stat-card-value">{activeOrders}</div>
          <div className="stat-card-sub">In progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Total Spent</div>
          <div className="stat-card-value">${totalSpent.toFixed(2)}</div>
          <div className="stat-card-sub">Lifetime</div>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="table-wrapper">
        <div className="table-header">
          <h3 style={{ fontSize: '1.1rem' }}>Recent Orders</h3>
          <Link href="/dashboard/orders" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        {recentOrders.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="desktop-only">
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Country</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quantity</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 24px', fontWeight: 500, textTransform: 'capitalize' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {order.platform}
                          {order.isBulk && (
                            <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Bulk</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', textTransform: 'uppercase' }}>
                        {order.country}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {order.deliveredCount} / {order.quantity}
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
              {recentOrders.map(order => (
                <div key={order.id} className="order-mobile-card">
                  <div className="order-mobile-card-row">
                    <span className="order-mobile-card-label">Platform</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{order.platform}</span>
                      {order.isBulk && (
                        <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Bulk</span>
                      )}
                    </div>
                  </div>
                  <div className="order-mobile-card-row">
                    <span className="order-mobile-card-label">Country</span>
                    <span style={{ textTransform: 'uppercase' }}>{order.country}</span>
                  </div>
                  <div className="order-mobile-card-row">
                    <span className="order-mobile-card-label">Quantity</span>
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
            No orders found. <Link href="/dashboard/order/google" style={{ color: 'var(--accent)' }}>Create your first order</Link>.
          </div>
        )}
      </div>
    </>
  )
}
