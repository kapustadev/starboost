import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { OrderChatClient } from './OrderChatClient'

export default async function OrderChatPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const { id } = await params

  // Verify the order belongs to the user
  const order = await prisma.order.findUnique({
    where: { id },
  })

  if (!order || order.userId !== session.user.id) {
    redirect('/dashboard/orders')
  }

  // Fetch the ticket for this order
  let ticket = await prisma.ticket.findFirst({
    where: { orderId: id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  // If no ticket exists, create one lazily, but ONLY if the order is actually paid
  if (!ticket) {
    if (order.status === 'pending' || order.status === 'cancelled') {
      redirect('/dashboard/orders')
    }

    const newTicket = await prisma.ticket.create({
      data: {
        userId: session.user.id,
        orderId: id,
        subject: `Order #${id.slice(-8)} Chat`,
        status: 'open',
        priority: 'normal',
      }
    })
    
    await prisma.ticketMessage.create({
      data: {
        ticketId: newTicket.id,
        content: `System: Chat created for order #${id.slice(-8)}. A support agent will review your order shortly.`,
        isStaff: true
      }
    })
    
    ticket = await prisma.ticket.findFirst({
      where: { orderId: id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })
  }

  return <OrderChatClient ticket={ticket} orderId={id} />
}
