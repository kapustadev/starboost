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
      referrals: true,
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

      <div className="bento-card accent-card">
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
    </div>
  )
}
