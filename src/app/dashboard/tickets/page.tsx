import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { TicketsClient } from './TicketsClient'

export default async function TicketsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const tickets = await prisma.ticket.findMany({
    where: { userId: session.user.id },
    include: { messages: true },
    orderBy: { createdAt: 'desc' },
  })

  return <TicketsClient initialTickets={tickets} />
}
