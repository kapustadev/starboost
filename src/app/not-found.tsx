import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{
          fontSize: '6rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          color: 'var(--accent)',
          lineHeight: 1,
          marginBottom: '20px'
        }}>
          404
        </div>
        <h1 style={{ marginBottom: '16px', fontSize: '2rem' }}>Page Not Found</h1>
        <p style={{
          color: 'var(--text-muted)',
          maxWidth: '400px',
          marginBottom: '32px',
          fontSize: '1.1rem'
        }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary btn-lg">
          ← Back to Home
        </Link>
      </div>
      <Footer />
    </>
  )
}
