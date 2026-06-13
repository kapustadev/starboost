import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import CopyLinkButton from '@/components/CopyLinkButton'

export default async function AffiliateDashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      referrals: {
        include: {
          orders: {
            include: { payment: true }
          }
        }
      },
    }
  })

  if (!user) redirect('/login')

  // Generate code if it doesn't exist
  if (!user.referralCode) {
    const code = `ref_${user.id.slice(0, 8)}`
    await prisma.user.update({
      where: { id: user.id },
      data: { referralCode: code }
    })
    revalidatePath('/dashboard/affiliate')
    // Safe to redirect to self to reload
    redirect('/dashboard/affiliate')
  }

  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?ref=${user.referralCode}`

  return (
    <div>
      <div className="dashboard-header">
        <h1>Affiliate Program</h1>
      </div>

      <div className="bento-grid bento-grid-2" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-card-label">Your Balance</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            ${user.balance.toFixed(2)}
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Earn 10% on all orders made by your referrals.
          </p>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-label">Total Referrals</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            {user.referrals.length}
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Active users signed up with your link.
          </p>
        </div>
      </div>

      <div className="bento-card accent-card" style={{ marginBottom: '32px' }}>
        <h3>Your Referral Link</h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Share this link with your audience, clients, or friends. When they register and buy reviews, you earn 10% of their order value.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            readOnly 
            value={referralLink} 
            className="form-input" 
            style={{ fontFamily: 'monospace', fontSize: '1rem', background: 'var(--bg-primary)' }}
          />
          <CopyLinkButton link={referralLink} />
        </div>
      </div>

      <div className="bento-card">
        <h3>Referred Users</h3>
        {user.referrals.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>You haven't referred anyone yet.</p>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <div className="desktop-only" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 0' }}>User</th>
                    <th>Joined Date</th>
                    <th>Total Spent</th>
                    <th>Earned Commission (10%)</th>
                  </tr>
                </thead>
                <tbody>
                  {user.referrals.map((refUser) => {
                    const totalSpent = refUser.orders.reduce((acc, order) => {
                      return acc + (order.payment?.status === 'paid' ? order.payment.amount : 0)
                    }, 0)
                    const commission = totalSpent * 0.10

                    return (
                      <tr key={refUser.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {(refUser.email || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{refUser.name || 'Anonymous User'}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{refUser.email}</div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{new Date(refUser.createdAt).toLocaleDateString()}</td>
                        <td style={{ fontWeight: 500 }}>${totalSpent.toFixed(2)}</td>
                        <td style={{ color: 'var(--green)', fontWeight: 600 }}>${commission.toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="mobile-only" style={{ flexDirection: 'column' }}>
              {user.referrals.map((refUser) => {
                const totalSpent = refUser.orders.reduce((acc, order) => {
                  return acc + (order.payment?.status === 'paid' ? order.payment.amount : 0)
                }, 0)
                const commission = totalSpent * 0.10

                return (
                  <div key={refUser.id} className="order-mobile-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {(refUser.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{refUser.name || 'Anonymous User'}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{refUser.email}</div>
                      </div>
                    </div>
                    <div className="order-mobile-card-row">
                      <span className="order-mobile-card-label">Joined Date</span>
                      <span>{new Date(refUser.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="order-mobile-card-row">
                      <span className="order-mobile-card-label">Total Spent</span>
                      <span style={{ fontWeight: 500 }}>${totalSpent.toFixed(2)}</span>
                    </div>
                    <div className="order-mobile-card-row">
                      <span className="order-mobile-card-label">Commission (10%)</span>
                      <span style={{ color: 'var(--green)', fontWeight: 600 }}>${commission.toFixed(2)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
