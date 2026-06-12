import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | StarsBoost',
}

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '24px' }}>Terms of Service</h1>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p><strong>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>

            <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the StarsBoost website and services.</p>

            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>

            <h2>2. Service Description</h2>
            <p>StarsBoost provides reputation management services, specifically the generation and placement of reviews on third-party platforms (like Google and Facebook) for businesses. We guarantee that the reviews provided will remain active for at least 30 days. If a review drops within this period, it will be refilled at no extra cost.</p>

            <h2>3. User Obligations</h2>
            <p>You agree not to use the service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright or trademark laws).</p>
            <p>You are responsible for ensuring that the URLs and business details provided during the order process are accurate.</p>

            <h2>4. Payments and Billing</h2>
            <p>All payments are processed securely via third-party payment gateways (e.g., Stripe). You agree to provide current, complete, and accurate purchase and account information for all purchases made on our website. Prices for our products are subject to change without notice.</p>

            <h2>5. Disclaimer of Liability</h2>
            <p>StarsBoost operates independently and is not affiliated with Google, Facebook, Trustpilot, or any other third-party platform. We do not guarantee specific outcomes related to search engine rankings or business revenue as a result of using our services. The use of our service is at your sole risk.</p>

            <h2>6. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your responsibility to check this page periodically for changes.</p>

            <h2>7. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us via the support ticketing system in your dashboard or at support@starsboost.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
