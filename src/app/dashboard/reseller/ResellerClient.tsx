'use client'

import { useState, useTransition } from 'react'
import { PlusCircle, List, Key } from 'lucide-react'
import { COUNTRIES } from '@/lib/data'
import { placeBulkOrder } from '@/app/actions/reseller'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function ResellerClient({ user, orders }: { user: any, orders: any[] }) {
  const [activeTab, setActiveTab] = useState('new')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // Bulk order state
  const [platform, setPlatform] = useState('google')
  const [country, setCountry] = useState('us')
  const [reviewsPerLink, setReviewsPerLink] = useState(10)
  const [urls, setUrls] = useState('')

  // Derived state
  const urlList = urls.split('\n').map(u => u.trim()).filter(u => u.length > 0)
  const totalReviews = urlList.length * reviewsPerLink
  // Let's assume base price is from our data or fallback
  const basePrice = platform === 'google' ? 5 : platform === 'trustpilot' ? 6 : 4
  const subtotal = totalReviews * basePrice
  const discount = subtotal * 0.20
  const total = subtotal - discount

  const handleCheckout = () => {
    if (urlList.length === 0) return
    
    startTransition(async () => {
      const res = await placeBulkOrder({
        platform,
        country,
        reviewsPerLink,
        urls: urlList,
        totalCost: total
      })

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`Successfully created ${urlList.length} orders!`)
        setUrls('')
        setActiveTab('orders')
        router.refresh()
      }
    })
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1>Reseller Portal</h1>
      </div>

      <div className="bento-grid bento-grid-2" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-card-label">Your Discount</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--green)' }}>
            20% OFF
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Automatically applied to all bulk orders.
          </p>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-label">Total Sub-Orders</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            {orders.length}
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Active and completed orders across your clients.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button 
          onClick={() => setActiveTab('new')}
          style={{ background: 'none', border: 'none', color: activeTab === 'new' ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <PlusCircle size={18} /> New Bulk Order
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{ background: 'none', border: 'none', color: activeTab === 'orders' ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <List size={18} /> Client Orders
        </button>
      </div>

      {activeTab === 'new' && (
        <div className="bento-card accent-card">
          <h3>Create Bulk Order</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Paste multiple URLs. We will automatically create separate tracking orders for each link.
          </p>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Platform</label>
              <select className="form-input" value={platform} onChange={e => setPlatform(e.target.value)}>
                <option value="google">Google Maps</option>
                <option value="facebook">Facebook</option>
                <option value="trustpilot">Trustpilot</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <select className="form-input" value={country} onChange={e => setCountry(e.target.value)}>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reviews per Link</label>
              <input type="number" className="form-input" value={reviewsPerLink} onChange={e => setReviewsPerLink(parseInt(e.target.value) || 0)} min={1} />
            </div>

            <div className="form-group">
              <label className="form-label">Target URLs (One per line)</label>
              <textarea 
                className="form-input" 
                placeholder={`https://g.page/r/...\nhttps://g.page/r/...\n...`}
                rows={6}
                value={urls}
                onChange={e => setUrls(e.target.value)}
              />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'right' }}>
                Detected {urlList.length} valid links
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Reviews ({urlList.length} × {reviewsPerLink})</span>
                <span>{totalReviews}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--green)' }}>
                <span>Reseller Discount (20%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '1.2rem', fontWeight: 800 }}>
                <span>Total Cost</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-primary btn-lg" 
              style={{ marginTop: '10px' }} 
              disabled={urlList.length === 0 || isPending} 
              onClick={handleCheckout}
            >
              {isPending ? 'Processing...' : 'Proceed to Bulk Checkout'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bento-card">
          <h3>Client Orders</h3>
          {orders.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>You have no bulk orders yet.</p>
          ) : (
            <div style={{ marginTop: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 0' }}>URL</th>
                    <th>Status</th>
                    <th>Platform</th>
                    <th>Progress</th>
                    <th>White-Label Link</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 0', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <a href={order.targetUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                          {order.targetUrl}
                        </a>
                      </td>
                      <td><span className={`badge badge-${order.status === 'completed' ? 'green' : 'blue'}`}>{order.status}</span></td>
                      <td style={{ textTransform: 'capitalize' }}>{order.platform}</td>
                      <td>{order.deliveredCount} / {order.quantity}</td>
                      <td>
                        {order.whiteLabelReport ? (
                          <a href={`/report/${order.whiteLabelReport.token}`} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '0.85rem' }}>
                            View Report
                          </a>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Not generated</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
