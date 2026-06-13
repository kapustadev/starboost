'use client'

import { useState } from 'react'
import { BookOpen, ShoppingCart, BarChart, CreditCard, UserPlus, ShieldAlert, CheckCircle2, AlertTriangle, Info, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
  { id: 'orders', label: 'Orders & Tracking', icon: ShoppingCart },
  { id: 'monitoring', label: 'Rating Monitoring', icon: BarChart },
  { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
  { id: 'affiliate', label: 'Affiliate Program', icon: UserPlus },
  { id: 'reseller', label: 'Reseller Portal', icon: ShieldAlert },
]

export default function DocsClient() {
  const [activeCategory, setActiveCategory] = useState('getting-started')

  return (
    <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }} className="docs-layout">
      {/* Sidebar Navigation */}
      <aside 
        style={{ 
          width: '280px', 
          flexShrink: 0, 
          position: 'sticky', 
          top: '100px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px'
        }}
        className="docs-sidebar"
      >
        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', paddingLeft: '12px' }}>Categories</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} />
                {cat.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Content Area */}
      <div style={{ flex: 1, minWidth: 0, paddingBottom: '60px' }}>
        
        {activeCategory === 'getting-started' && (
          <div className="docs-content fade-in">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <BookOpen className="text-accent" size={32} />
              Getting Started
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
              Welcome to StarsBoost! Our dashboard is designed to be intuitive, allowing you to manage your online reputation across Google, Facebook, and Trustpilot from one centralized location.
            </p>

            <div className="bento-card" style={{ marginBottom: '32px' }}>
              <h3>Creating an Account</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                If you haven't already, sign up by providing your email and creating a secure password. You will be instantly redirected to the main Dashboard view.
              </p>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                <li>Your account is completely free. You only pay when you order reviews or use the bulk checkout.</li>
                <li>You can access the dashboard from any device; it is fully mobile-responsive.</li>
              </ul>
            </div>

            <div className="bento-card" style={{ marginBottom: '32px' }}>
              <h3>Navigating the Dashboard</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                The left sidebar contains all the essential tools you need:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px' }}>
                  <strong>Orders</strong>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>Track the progress of your active review campaigns.</p>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px' }}>
                  <strong>Monitoring</strong>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>Visualize your rating growth over time.</p>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px' }}>
                  <strong>Billing</strong>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>Download PDF invoices and manage cards.</p>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '20px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <Info color="#38bdf8" size={24} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#38bdf8' }}>Pro Tip: Support Tickets</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  If you ever encounter an issue that isn't covered in this documentation, you can always open a general Support Ticket using the <strong>Tickets</strong> tab in your dashboard sidebar.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'orders' && (
          <div className="docs-content fade-in">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ShoppingCart className="text-accent" size={32} />
              Orders & Tracking
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
              The Orders page is your mission control. Here you can buy new reviews, track delivery progress, and communicate directly with the delivery team.
            </p>

            <div className="bento-card" style={{ marginBottom: '32px' }}>
              <h3>How to Place a New Order</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                To purchase new reviews, click the <strong>New Order</strong> tab.
              </p>
              <ol style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><strong>Select Platform:</strong> Choose between Google Maps, Facebook, or Trustpilot.</li>
                <li><strong>Provide URL:</strong> Paste the exact link to your business profile.</li>
                <li><strong>Select Quantity & Country:</strong> Choose how many reviews you want and where the reviewers should be located. <em>Prices automatically adjust based on geography.</em></li>
                <li><strong>Custom vs. Random Text:</strong> You can either paste a list of custom review texts for us to post, or allow our team to generate natural, relevant comments based on your business category.</li>
                <li><strong>Delivery Speed:</strong> We use a proprietary Drip-Feed system (1-3 reviews per day) to ensure maximum safety and SEO benefit.</li>
              </ol>
            </div>

            <div className="bento-card" style={{ marginBottom: '32px' }}>
              <h3>Understanding Order Statuses</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <span className="badge badge-yellow" style={{ width: '100px', justifyContent: 'center' }}>Pending</span>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Your payment is being processed or the order is awaiting manual review by our team.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <span className="badge badge-blue" style={{ width: '100px', justifyContent: 'center' }}>Processing</span>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Reviews are currently being drip-fed to your profile. You will see the progress bar update (e.g., 5/20 delivered).</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <span className="badge badge-green" style={{ width: '100px', justifyContent: 'center' }}>Completed</span>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>All reviews have been successfully posted and verified.</p>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '24px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <MessageCircle className="text-accent" size={24} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>Order-Specific Chat</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Next to every active order in your table, you will see a <strong>Chat</strong> button. Clicking this opens a dedicated support channel specifically for that URL. If you need to pause delivery, change a custom text, or ask a question about the progress, use this chat!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'monitoring' && (
          <div className="docs-content fade-in">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <BarChart className="text-accent" size={32} />
              Rating Monitoring
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
              The Monitoring tab is the ultimate tool for visualizing the Return on Investment (ROI) of your reputation campaigns.
            </p>

            <div className="bento-card" style={{ marginBottom: '32px' }}>
              <h3>How to Add a Tracker</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                You can track any business profile, even if you haven't ordered reviews for it yet.
              </p>
              <ol style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>Navigate to the <strong>Monitoring</strong> tab.</li>
                <li>Click the <strong>Add Tracker</strong> button.</li>
                <li>Select the Platform (Google Maps, Trustpilot, etc.) and paste the URL.</li>
                <li>Our system will fetch the current rating (e.g., 3.8 stars) and the total number of reviews.</li>
              </ol>
            </div>

            <div className="bento-card">
              <h3>Reading the Charts</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                Once a tracker is added, we snapshot your rating periodically. The chart displays your rating on the Y-axis and time on the X-axis. 
                As our drip-feed system delivers 5-star reviews, you will see the line graph trend upwards, proving the effectiveness of the campaign.
              </p>
            </div>
          </div>
        )}

        {activeCategory === 'billing' && (
          <div className="docs-content fade-in">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <CreditCard className="text-accent" size={32} />
              Billing & Payments
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
              Manage your payment history, download invoices for accounting, and update your credit card information securely via Stripe.
            </p>

            <div className="bento-card" style={{ marginBottom: '32px' }}>
              <h3>Payment History & Invoices</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                In the <strong>Billing</strong> tab, you will see a complete table of all your past transactions.
              </p>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Status:</strong> Shows whether a payment succeeded, failed, or was refunded.</li>
                <li><strong>Amount:</strong> The total amount charged in USD.</li>
                <li><strong>Download PDF:</strong> Next to every successful payment is an "Invoice" column. Click the PDF button to download a formal, tax-compliant invoice generated directly by Stripe.</li>
              </ul>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '20px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <AlertTriangle color="#ef4444" size={24} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Important: Payment Security</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  StarsBoost does not store your credit card details. All payments are processed through our secure Stripe integration. To update your card details, click the <strong>Manage Billing</strong> button, which will redirect you to the Stripe Customer Portal.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'affiliate' && (
          <div className="docs-content fade-in">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <UserPlus className="text-accent" size={32} />
              Affiliate Program
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
              Turn your network into a passive income stream. Earn a massive <strong>15% commission</strong> on every single order placed by customers you refer.
            </p>

            <div className="bento-card" style={{ marginBottom: '32px' }}>
              <h3>How It Works</h3>
              <ol style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><strong>Copy Your Link:</strong> Navigate to the <strong>Affiliate</strong> tab and click the "Copy" button next to your unique <code>?ref=</code> link.</li>
                <li><strong>Share:</strong> Post this link on your blog, YouTube channel, or email it to clients who need reputation management.</li>
                <li><strong>Cookie Tracking:</strong> When a user clicks your link, a 30-day tracking cookie is placed on their browser. If they register an account within 30 days, they are permanently locked to your profile.</li>
                <li><strong>Earn Forever:</strong> Every time that referred user places an order—whether it's today or two years from now—15% of the total order value is instantly credited to your Affiliate Balance.</li>
              </ol>
            </div>

            <div className="bento-grid bento-grid-2">
              <div className="stat-card">
                <div className="stat-card-label">Commission Rate</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green)' }}>15%</div>
                <div className="stat-card-sub">On all referred orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Cookie Duration</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>30 Days</div>
                <div className="stat-card-sub">To register an account</div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'reseller' && (
          <div className="docs-content fade-in">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ShieldAlert className="text-accent" size={32} />
              Reseller Portal (Agencies)
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
              The Reseller Portal is an exclusive feature built for Marketing Agencies and SEO professionals managing reputation campaigns for dozens of clients simultaneously.
            </p>

            <div className="bento-card" style={{ marginBottom: '32px' }}>
              <h3>Gaining Access</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                By default, new accounts do not have access to the Reseller Portal. To unlock it, you must open a Support Ticket and request an account upgrade. We typically approve agencies with a proven track record or a minimum initial deposit.
              </p>
            </div>

            <div className="bento-card" style={{ marginBottom: '32px' }}>
              <h3>Bulk Checkout & Pricing</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                Instead of checking out one order at a time, the Reseller Portal allows you to submit up to 50 URLs in a single action.
              </p>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>20% Lifetime Discount:</strong> All orders processed through the bulk portal automatically receive a 20% discount off the base price.</li>
                <li><strong>Balance Deduction:</strong> Bulk orders do not require a credit card at checkout. Instead, they deduct the total cost directly from your pre-funded <em>Account Balance</em>.</li>
                <li><strong>Auto-Splitting:</strong> If you paste 10 URLs, the system will automatically generate 10 separate sub-orders in the "Client Orders" tab so you can track them individually.</li>
              </ul>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '24px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <CheckCircle2 className="text-accent" size={24} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>White-Label Reporting</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  One of the most powerful reseller features is the White-Label Report. For every sub-order you create, the system generates a unique, unbranded tracking link. You can send this link to your client so they can monitor the delivery of their reviews in real-time, without ever knowing that you are using StarsBoost to fulfill the service.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .docs-layout {
          flex-direction: column;
        }
        @media (min-width: 900px) {
          .docs-layout {
            flex-direction: row;
          }
        }
        @media (max-width: 899px) {
          .docs-sidebar {
            width: 100% !important;
            position: relative !important;
            top: 0 !important;
            margin-bottom: 30px;
          }
        }
        .fade-in {
          animation: fadeIn 0.4s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  )
}
