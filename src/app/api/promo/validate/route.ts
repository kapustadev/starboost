import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ message: 'No code provided' }, { status: 400 })
  }

  try {
    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!promo || !promo.active) {
      return NextResponse.json({ valid: false, message: 'Invalid or expired promo code' })
    }

    return NextResponse.json({
      valid: true,
      discountPercentage: promo.discountPercentage,
      code: promo.code
    })
  } catch (err) {
    console.error('Promo Code Error:', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
