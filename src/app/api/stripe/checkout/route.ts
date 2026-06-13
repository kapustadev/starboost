import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
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
      totalPrice,
      promoCode,
      email,
      createAccount,
      password,
      name,
      contactSocial
    } = body

    if (!platform || !country || !quantity || !targetUrl || !totalPrice || (!session && !email)) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    let finalUserId = session?.user?.id
    const finalEmail = session?.user?.email || email

    if (!session && createAccount && password) {
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return NextResponse.json({ message: 'User already exists. Please log in.' }, { status: 400 })
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        }
      })
      finalUserId = newUser.id
    }

    let actualTotalPrice = totalPrice
    let discountAmount = 0
    let promoCodeId = null

    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode.toUpperCase() } })
      if (promo && promo.active) {
        promoCodeId = promo.id
        discountAmount = totalPrice * (promo.discountPercentage / 100)
        actualTotalPrice = Math.max(0, totalPrice - discountAmount)
      }
    }

    // Create Order in DB
    const order = await prisma.order.create({
      data: {
        userId: finalUserId || null,
        guestEmail: finalUserId ? null : finalEmail,
        platform,
        country,
        quantity,
        textOption,
        frequency,
        targetUrl,
        businessName,
        notes,
        contactName: name || null,
        contactSocial: contactSocial || null,
        pricePerReview,
        totalPrice: actualTotalPrice,
        promoCodeId,
        discountAmount,
        status: 'pending'
      }
    })

    // Create Stripe Session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      client_reference_id: order.id,
      customer_email: finalEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${quantity} ${platform.charAt(0).toUpperCase() + platform.slice(1)} Reviews (${country.toUpperCase()})`,
              description: `Frequency: ${frequency.replace('1/', '1 per ')} | Text: ${textOption}`,
            },
            unit_amount: Math.round(actualTotalPrice * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      invoice_creation: { enabled: true },
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${finalUserId ? '/dashboard/orders?success=true' : '/?checkout_success=true'}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout?platform=${platform}&qty=${quantity}&country=${country}&textOption=${textOption}&frequency=${encodeURIComponent(frequency)}`,
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
