import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DocsClient from './DocsClient'

export const metadata = {
  title: 'Documentation | StarsBoost',
  description: 'Comprehensive guide to using the StarsBoost dashboard, tracking orders, and managing your affiliate and reseller accounts.',
}

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="section" style={{ paddingTop: '120px', minHeight: 'calc(100vh - 300px)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="section-eyebrow">Documentation</span>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '16px' }}>Dashboard Guide</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Everything you need to know to master the StarsBoost platform.
            </p>
          </div>
          
          <DocsClient />
          
        </div>
      </main>
      <Footer />
    </>
  )
}
