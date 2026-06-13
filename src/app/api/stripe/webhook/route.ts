import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('Stripe-Signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as any

  if (event.type === 'checkout.session.completed') {
    const orderId = session.client_reference_id
    const stripePaymentId = session.payment_intent as string

    if (orderId) {
      // Update order status to processing
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'processing',
          stripePaymentId,
        },
      })

      // Fetch invoice PDF if exists
      let invoicePdfUrl = null
      if (session.invoice) {
        try {
          const invoice = await stripe.invoices.retrieve(session.invoice as string)
          invoicePdfUrl = invoice.invoice_pdf || invoice.hosted_invoice_url
        } catch (e) {
          console.error('Failed to retrieve invoice', e)
        }
      }

      // Create Payment record
      const order = await prisma.order.findUnique({ 
        where: { id: orderId },
        include: { user: true }
      })
      if (order) {
        await prisma.payment.create({
          data: {
            userId: order.userId,
            orderId: order.id,
            stripeSessionId: session.id,
            amount: session.amount_total / 100,
            status: 'paid',
            invoicePdfUrl
          }
        })

        // Create Chat Ticket for this order
        const ticket = await prisma.ticket.create({
          data: {
            userId: order.userId!,
            orderId: order.id,
            subject: `Order #${order.id.slice(-8)} Chat`,
            status: 'open',
            priority: 'normal',
          }
        })
        
        await prisma.ticketMessage.create({
          data: {
            ticketId: ticket.id,
            content: `System: Order paid successfully. A support agent will review your order shortly.`,
            isStaff: true
          }
        })

        // Send Telegram notification
        import('@/lib/telegram').then(({ sendTelegramMessage }) => {
          sendTelegramMessage(
            `💰 <b>New Order Paid! (StarsBoost)</b>\n` +
            `🛒 <b>Service:</b> ${order.platform}\n` +
            `📦 <b>Quantity:</b> ${order.quantity}\n` +
            `🔗 <b>Target URL:</b> ${order.targetUrl}\n` +
            `💵 <b>Amount:</b> $${(session.amount_total / 100).toFixed(2)}\n` +
            `✉️ <b>User:</b> ${order.user?.email || 'Unknown'}`
          )
        })
      }
    }
  }

  return new NextResponse('Webhook OK', { status: 200 })
}
