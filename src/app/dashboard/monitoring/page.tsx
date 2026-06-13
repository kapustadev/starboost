import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export default async function MonitoringDashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      ratingTrackers: {
        orderBy: { updatedAt: 'desc' }
      }
    }
  })

  if (!user) redirect('/login')

  return (
    <div>
      <div className="dashboard-header">
        <h1>Reputation Monitoring</h1>
      </div>

      <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '600px' }}>
        Track your average rating over time. When you buy reviews, our system takes a snapshot of your rating and updates it as new reviews are delivered.
      </p>

      {user.ratingTrackers.length === 0 ? (
        <div className="bento-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
          <h3>No trackers active</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            When you place an order, a rating tracker will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="bento-grid bento-grid-2">
          {user.ratingTrackers.map(tracker => {
            const difference = (tracker.currentRating - tracker.initialRating).toFixed(1)
            const isPositive = Number(difference) >= 0

            return (
              <div key={tracker.id} className="bento-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{tracker.platform}</h3>
                    <a href={tracker.targetUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'underline' }}>
                      View Page
                    </a>
                  </div>
                  <span className={`badge ${isPositive ? 'badge-green' : 'badge-red'}`}>
                    {isPositive ? '+' : ''}{difference}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Initial</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                      {tracker.initialRating.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--yellow)' }}>★</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>→</div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                      {tracker.currentRating.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--yellow)' }}>★</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Chart Line for aesthetics */}
                <div style={{ marginTop: '24px', height: '60px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                  <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                    <path 
                      d={isPositive ? "M0,30 L20,25 L40,28 L60,15 L80,10 L100,5" : "M0,10 L20,12 L40,15 L60,15 L80,20 L100,25"} 
                      fill="none" 
                      stroke={isPositive ? "var(--green)" : "var(--red)"} 
                      strokeWidth="2" 
                      vectorEffect="non-scaling-stroke"
                    />
                    <path 
                      d={isPositive ? "M0,30 L20,25 L40,28 L60,15 L80,10 L100,5 L100,30 L0,30 Z" : "M0,10 L20,12 L40,15 L60,15 L80,20 L100,25 L100,30 L0,30 Z"} 
                      fill={isPositive ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)"} 
                    />
                  </svg>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
