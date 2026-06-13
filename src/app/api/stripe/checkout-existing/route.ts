import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await req.json()
    if (!orderId) {
      return NextResponse.json({ message: 'Missing orderId' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ message: 'Order not found or unauthorized' }, { status: 404 })
    }

    if (order.status !== 'pending') {
      return NextResponse.json({ message: 'Order is already paid or cancelled' }, { status: 400 })
    }

    // Create Stripe Session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      client_reference_id: order.id,
      customer_email: session.user.email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${order.quantity} ${order.platform.charAt(0).toUpperCase() + order.platform.slice(1)} Reviews (${order.country.toUpperCase()})`,
              description: `Frequency: ${order.frequency.replace('1/', '1 per ')} | Text: ${order.textOption}`,
            },
            unit_amount: Math.round(order.totalPrice * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      invoice_creation: { enabled: true },
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/orders?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`,
    })

    if (!stripeSession.url) {
      throw new Error('Failed to create stripe session url')
    }

    return NextResponse.json({ url: stripeSession.url })
  } catch (error: any) {
    console.error('Stripe Existing Checkout Error:', error)
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await req.json()
    if (!orderId) {
      return NextResponse.json({ message: 'Missing orderId' }, { status: 400 })
    }

    // Must belong to user and be pending
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order || order.userId !== session.user.id || order.status !== 'pending') {
      return NextResponse.json({ message: 'Not found or invalid' }, { status: 400 })
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Cancel order error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
