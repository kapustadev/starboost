import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ResellerClient from './ResellerClient'

export default async function ResellerDashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        where: { isBulk: true },
        orderBy: { createdAt: 'desc' },
        include: { whiteLabelReport: true }
      }
    }
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

  return <ResellerClient user={user} orders={user.orders} />
}

