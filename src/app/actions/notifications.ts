'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function getNotifications() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return []

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  })
  if (!user) return []

  return await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 20
  })
}

export async function markNotificationsAsRead() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { error: 'Unauthorized' }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  })
  if (!user) return { error: 'User not found' }

  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true }
  })

  return { success: true }
}
