'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: any) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return { error: 'Unauthorized' }
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name,
        phone: data.phone,
        company: data.company,
        country: data.country,
        emailNotifications: data.emailNotifications,
        orderUpdates: data.orderUpdates,
        ticketReplies: data.ticketReplies,
        marketing: data.marketing,
      }
    })

    revalidatePath('/dashboard/profile')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to update profile:', error)
    return { error: 'Failed to update profile' }
  }
}
