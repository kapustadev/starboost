import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy | StarsBoost',
}

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '24px' }}>Refund Policy</h1>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p><strong>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>

            <p>At StarsBoost, we strive to ensure that our customers are completely satisfied with the services we provide. We understand that sometimes things don't go as planned, and we've outlined our refund policy below to ensure transparency.</p>

            <h2>1. 30-Day Drop Protection Guarantee</h2>
            <p>All our review services come with a 30-day drop protection guarantee. If any of the reviews we provide drop or are removed by the platform within 30 days of delivery, we will replace them completely free of charge. You must open a support ticket in your dashboard to request a refill.</p>

            <h2>2. Eligibility for Refunds</h2>
            <p>Refunds are only issued under the following circumstances:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>Non-Delivery:</strong> If we fail to initiate your order within the promised timeframe and you wish to cancel before the service begins.</li>
              <li><strong>Incomplete Service:</strong> If we are unable to fully complete your order and deliver the requested number of reviews, a partial refund will be issued for the undelivered portion.</li>
            </ul>

            <h2>3. Non-Refundable Scenarios</h2>
            <p>We do not issue refunds for the following situations:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Change of mind after the order has already been processed and delivery has started.</li>
              <li>Issues arising from incorrect information provided by the user (e.g., providing the wrong business URL).</li>
              <li>Reviews dropping after the 30-day guarantee period has expired.</li>
              <li>Your business listing getting suspended or penalized by the platform (our reviews are safe, but we cannot control other factors regarding your listing).</li>
            </ul>

            <h2>4. Requesting a Refund</h2>
            <p>To request a refund, please open a support ticket in your dashboard or email our billing department with your order ID. We will investigate the issue and process eligible refunds within 5-7 business days.</p>

            <h2>5. Contact Us</h2>
            <p>If you have any questions or concerns regarding our Refund Policy, please contact us at support@starsboost.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
