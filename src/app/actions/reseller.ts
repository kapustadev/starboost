'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function placeBulkOrder({ platform, country, reviewsPerLink, urls, totalCost }: {
  platform: string,
  country: string,
  reviewsPerLink: number,
  urls: string[],
  totalCost: number
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return { error: 'Not authenticated' }
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || (user.role !== 'RESELLER' && user.role !== 'ADMIN')) {
    return { error: 'Not authorized' }
  }

  if (user.balance < totalCost) {
    return { error: 'Insufficient balance. Please top up your account to place this order.' }
  }

  if (urls.length === 0) {
    return { error: 'No URLs provided' }
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Deduct balance
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: totalCost } }
      })

      // Generate White Label Token
      const token = crypto.randomBytes(16).toString('hex')

      // Create orders
      for (const url of urls) {
        const order = await tx.order.create({
          data: {
            userId: user.id,
            platform,
            country,
            quantity: reviewsPerLink,
            pricePerReview: 0, // Bulk pricing
            totalPrice: totalCost / urls.length, // Distribute cost
            status: 'processing',
            targetUrl: url,
            isBulk: true,
          }
        })

        // Create white label report for this specific order
        // (If they want one report per link)
        await tx.whiteLabelReport.create({
          data: {
            orderId: order.id,
            token: crypto.randomBytes(12).toString('hex'),
          }
        })
      }
    })

    return { success: true }
  } catch (error: any) {
    console.error('Bulk order error:', error)
    return { error: 'Failed to process bulk order. Please contact support.' }
  }
}
