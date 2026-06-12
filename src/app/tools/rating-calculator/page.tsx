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

        <div style={{ maxWidth: '800px', margin: '60px auto 0', padding: '40px', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Why You Need a Rating Calculator</h2>
          <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p><strong>Online reputation is everything.</strong> Your business's average star rating is often the first thing potential customers see when they find you on Google Maps, Facebook, or Trustpilot. But improving that rating isn't always straightforward.</p>
            
            <p>Our <strong>Review Rating Calculator</strong> takes the guesswork out of reputation management. Instead of blindly trying to get "more reviews," you can use this tool to calculate exactly how many 5-star ratings you need to offset older negative feedback and achieve your target score.</p>
            
            <p>For example, if you currently have a 4.2 rating from 150 reviews and want to reach a 4.5, our algorithm instantly determines the precise mathematical requirement. This allows you to plan your review acquisition strategy effectively, whether you're collecting organic feedback or using services like StarsBoost to accelerate your growth.</p>
            
            <p><strong>A 0.1 increase matters.</strong> Studies show that a seemingly small bump in your overall rating can increase conversion rates by up to 25%. Don't leave your reputation to chance—calculate your goal and take action today.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
