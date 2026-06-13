import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { BookOpen, ShoppingCart, UserPlus, BarChart, ShieldAlert } from 'lucide-react'

export const metadata = {
  title: 'Help Center | StarsBoost Dashboard Guide',
  description: 'Learn how to use your StarsBoost dashboard, manage orders, track rating monitoring, and utilize partner programs.',
}

export default function HelpCenterPage() {
  return (
    <>
      <Navbar />
      <main className="section" style={{ paddingTop: '120px', minHeight: 'calc(100vh - 300px)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="section-eyebrow">Documentation</span>
            <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Dashboard Guide</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Everything you need to know to get the most out of your StarsBoost account.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Orders & Tracking */}
            <div className="bento-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '10px', color: 'var(--accent)' }}>
                  <ShoppingCart size={24} />
                </div>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Managing Orders</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                The <strong>Orders</strong> tab is your main control center. Here you can view the real-time progress of your review campaigns. 
                Each order displays how many reviews have been delivered versus the total quantity ordered.
              </p>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Chat Support:</strong> Next to each order, there is a Chat button. Use this to speak directly to the support agent assigned to your specific campaign.</li>
                <li><strong>Status:</strong> Orders start as <em>Pending</em>, move to <em>Processing</em> while reviews are being drip-fed, and become <em>Completed</em> once the exact quantity is reached.</li>
              </ul>
            </div>

            {/* Monitoring */}
            <div className="bento-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '10px', color: 'var(--blue)' }}>
                  <BarChart size={24} />
                </div>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Rating Monitoring</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The <strong>Monitoring</strong> tab provides a visual overview of your reputation growth over time. 
                You will see dynamic charts showing how your rating has improved from the day you started using StarsBoost to the present day. This is the best place to measure your Return on Investment (ROI).
              </p>
            </div>

            {/* Affiliate */}
            <div className="bento-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '10px', color: 'var(--green)' }}>
                  <UserPlus size={24} />
                </div>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Affiliate Program</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Earn a <strong>15% commission</strong> on every payment made by customers you refer.
              </p>
              <ol style={{ color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Go to the <strong>Affiliate</strong> tab.</li>
                <li>Copy your unique referral link.</li>
                <li>Share it on your blog, social media, or directly with clients.</li>
                <li>When someone registers through your link, they are locked to your account. You earn 15% of all their future orders, forever.</li>
              </ol>
            </div>

            {/* Reseller */}
            <div className="bento-card accent-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white' }}>
                  <ShieldAlert size={24} />
                </div>
                <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>Reseller Portal</h2>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, marginBottom: '16px' }}>
                Exclusive to approved agency partners. The Reseller Portal allows you to manage reputation campaigns for multiple clients simultaneously with a permanent <strong>20% discount</strong>.
              </p>
              <ul style={{ color: 'rgba(255,255,255,0.9)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Bulk Checkout:</strong> Paste up to 50 URLs at once. The system will automatically create individual sub-orders for each link and deduct the discounted total from your account balance.</li>
                <li><strong>White-Label Reports:</strong> Generate public, unbranded progress links for each order. You can send these links to your clients so they can track progress without ever knowing you use StarsBoost.</li>
              </ul>
            </div>

          </div>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Still have questions?</p>
            <Link href="/dashboard/tickets" className="btn btn-primary">
              Open a Support Ticket
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
