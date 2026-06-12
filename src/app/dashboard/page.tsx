import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PayNowButton } from '@/components/dashboard/PayNowButton'
import { OrderTimer } from '@/components/dashboard/OrderTimer'
import { AlertTriangle } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  // Automatically cancel pending orders older than 30 minutes
  const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000)
  await prisma.order.updateMany({
    where: {
      userId: session.user.id,
      status: 'pending',
      createdAt: { lt: thirtyMinsAgo }
    },
    data: { status: 'cancelled' }
  })

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
            <div key={order.id} style={{
              background: 'var(--accent-glow)',
              border: '1px solid var(--accent)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlertTriangle color="var(--yellow)" size={28} />
                <div>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    You have an unpaid order
                    <OrderTimer createdAt={order.createdAt} />
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                    {order.quantity} {order.platform} reviews ({order.country.toUpperCase()}) for ${order.totalPrice}. Complete payment to start the campaign.
                  </p>
                </div>
              </div>
              <PayNowButton orderId={order.id} />
            </div>
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
              {recentOrders.map(order => (
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
            No orders found. <Link href="/dashboard/order/google" style={{ color: 'var(--accent)' }}>Create your first order</Link>.
          </div>
        )}
      </div>
    </>
  )
}
