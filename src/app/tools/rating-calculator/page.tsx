import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { RatingCalculatorClient } from './RatingCalculatorClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Google Review Rating Calculator | StarsBoost',
  description: 'Calculate exactly how many 5-star reviews your business needs to achieve your desired average rating on Google Maps.',
}

export default function RatingCalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Rating Calculator</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Enter your current rating and review count to find out how many 5-star reviews you need to reach your goal.
          </p>
        </div>
        
        <RatingCalculatorClient />
      </main>
      <Footer />
    </>
  )
}
