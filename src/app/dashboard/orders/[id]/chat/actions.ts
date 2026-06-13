'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function sendChatMessage(ticketId: string, content: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { error: 'Unauthorized' }
  }

  // Verify that the user owns the ticket
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  })

  if (!ticket || ticket.userId !== session.user.id) {
    return { error: 'Ticket not found or unauthorized' }
  }

  if (ticket.status === 'closed') {
    return { error: 'Cannot send message to a closed ticket' }
  }

  try {
    const message = await prisma.ticketMessage.create({
      data: {
        ticketId,
        content,
        isStaff: false,
      }
    })

    // If orderId is present, we can revalidate the specific chat path
    if (ticket.orderId) {
      revalidatePath(`/dashboard/orders/${ticket.orderId}/chat`)
    }
    revalidatePath(`/dashboard/tickets`)

    return { success: true, message }
  } catch (error) {
    console.error('Failed to send message:', error)
    return { error: 'Failed to send message' }
  }
}
