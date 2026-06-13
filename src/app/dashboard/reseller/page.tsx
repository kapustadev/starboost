import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function ResellerDashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) redirect('/login')

  if (user.role !== 'RESELLER' && user.role !== 'ADMIN') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You need a Reseller account to view this page.</p>
        <p style={{ marginTop: '20px' }}>Contact support to upgrade your account.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1>Reseller Portal</h1>
      </div>

      <div className="bento-grid bento-grid-2" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-card-label">Your Discount</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--green)' }}>
            20% OFF
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Automatically applied to all bulk orders.
          </p>
        </div>
      </div>

      <div className="bento-card accent-card">
        <h3>Bulk Order</h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Submit multiple links at once. We will create separate orders for each link in your dashboard.
        </p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Platform</label>
            <select className="form-input">
              <option value="google">Google Maps</option>
              <option value="facebook">Facebook</option>
              <option value="trustpilot">Trustpilot</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Reviews per Link</label>
            <input type="number" className="form-input" defaultValue={10} min={1} />
          </div>

          <div className="form-group">
            <label className="form-label">Target URLs (One per line)</label>
            <textarea 
              className="form-input" 
              placeholder="https://g.page/r/...\nhttps://g.page/r/...\n..."
              rows={6}
            />
          </div>

          <button type="button" className="btn btn-primary btn-lg" style={{ marginTop: '10px' }}>
            Calculate Bulk Price
          </button>
        </form>
      </div>
    </div>
  )
}
