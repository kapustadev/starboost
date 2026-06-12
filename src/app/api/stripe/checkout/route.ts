import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized. Please log in.' }, { status: 401 })
    }

    const body = await req.json()
    const {
      platform,
      country,
      quantity,
      textOption,
      frequency,
      targetUrl,
      businessName,
      notes,
      pricePerReview,
      totalPrice
    } = body

    if (!platform || !country || !quantity || !targetUrl || !totalPrice) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Create Order in DB
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        platform,
        country,
        quantity,
        textOption,
        frequency,
        targetUrl,
        businessName,
        notes,
        pricePerReview,
        totalPrice,
        status: 'pending'
      }
    })

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
              name: `${quantity} ${platform.charAt(0).toUpperCase() + platform.slice(1)} Reviews (${country.toUpperCase()})`,
              description: `Frequency: ${frequency.replace('1/', '1 per ')} | Text: ${textOption}`,
            },
            unit_amount: Math.round(totalPrice * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/orders?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/services/${platform}?canceled=true`,
    })

    if (!stripeSession.url) {
      throw new Error('Failed to create stripe session url')
    }

    return NextResponse.json({ url: stripeSession.url })
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error)
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 })
  }
}
