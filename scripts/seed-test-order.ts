import { prisma } from '../src/lib/prisma'

async function main() {
  // Find a user to attach the order to
  const user = await prisma.user.findFirst()
  if (!user) {
    console.log('No user found in the database. Please register a user first.')
    return
  }

  console.log(`Adding test order for user: ${user.email} (ID: ${user.id})`)

  // Create an order
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      platform: 'google',
      country: 'us',
      quantity: 10,
      pricePerReview: 5,
      totalPrice: 50,
      status: 'processing', // Paid successfully
      targetUrl: 'https://maps.google.com/test-business',
      businessName: 'Test Business',
    }
  })

  // Create a payment for the order
  await prisma.payment.create({
    data: {
      userId: user.id,
      orderId: order.id,
      stripeSessionId: `mock_session_${Date.now()}`,
      amount: 50,
      status: 'paid'
    }
  })

  // Create a chat ticket for the order
  const ticket = await prisma.ticket.create({
    data: {
      userId: user.id,
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

  console.log(`Successfully created Test Order ID: ${order.id} and associated Chat.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
