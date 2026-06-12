import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  })

  if (!user) redirect('/login')

  const totalSpent = user.orders.reduce((sum, order) => sum + (order.status !== 'cancelled' ? order.totalPrice : 0), 0)
  const totalReviews = user.orders.reduce((sum, order) => sum + (order.status !== 'cancelled' ? order.quantity : 0), 0)
  const activeOrders = user.orders.filter(o => o.status === 'processing' || o.status === 'pending').length

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 style={{ marginBottom: '4px' }}>Welcome back, {user.name || 'User'}!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here is what&apos;s happening with your projects today.</p>
        </div>
        <Link href="/services/google" className="btn btn-primary">
          + New Order
        </Link>
      </div>

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
        {user.orders.length > 0 ? (
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Country</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quantity</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {user.orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 500, textTransform: 'capitalize' }}>
                    {order.platform}
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
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No orders found. <Link href="/services/google" style={{ color: 'var(--accent)' }}>Create your first order</Link>.
          </div>
        )}
      </div>
    </>
  )
}
