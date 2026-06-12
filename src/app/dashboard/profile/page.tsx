import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProfileClient } from './ProfileClient'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) redirect('/login')

  const initialProfile = {
    name: user.name || '',
    email: user.email || '',
    phone: '',
    company: '',
    country: 'us',
    emailNotifications: true,
    orderUpdates: true,
    ticketReplies: true,
    marketing: false,
  }

  return <ProfileClient initialProfile={initialProfile} />
}
