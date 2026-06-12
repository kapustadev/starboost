'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PLATFORMS, COUNTRIES, calculatePrice, getPricePerReview } from '@/lib/data'

export default function ServicePage({ params }: { params: { platform: string } }) {
  const platform = PLATFORMS.find(p => p.id === params.platform)

  const [selectedCountry, setSelectedCountry] = useState('us')
  const [selectedQty, setSelectedQty] = useState(10)
  const [targetUrl, setTargetUrl] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [notes, setNotes] = useState('')

  if (!platform) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-primary)'}}>
        <div style={{textAlign:'center'}}>
          <h1>Platform not found</h1>
          <Link href="/" className="btn btn-primary" style={{marginTop:'16px',display:'inline-flex'}}>← Back to Home</Link>
        </div>
      </div>
    )
  }

  const country = COUNTRIES.find(c => c.code === selectedCountry)!
  const pricePerReview = getPricePerReview(platform.id, selectedCountry)
  const totalPrice = calculatePrice(platform.id, selectedCountry, selectedQty)

  const platformEmoji: Record<string, string> = {
    google: '🅖',
    facebook: '📘',
    trustpilot: '⭐',
  }

  const urlPlaceholder: Record<string, string> = {
    google: 'https://maps.google.com/?cid=123456… or your Google Maps business URL',
    facebook: 'https://facebook.com/your-page-name',
    trustpilot: 'https://trustpilot.com/review/yourwebsite.com',
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar scrolled">
        <div className="container">
          <div className="navbar-inner">
            <Link href="/" className="navbar-logo">Stars<span>Boost</span></Link>
            <div className="navbar-actions">
              <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <div style={{paddingTop:'80px',minHeight:'100vh',background:'var(--bg-primary)'}}>
        <div className="container" style={{paddingTop:'48px',paddingBottom:'80px'}}>

          {/* Breadcrumb */}
          <div style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:'32px'}}>
            <Link href="/" style={{color:'var(--text-muted)'}}>Home</Link>
            <span>›</span>
            <Link href="/#pricing" style={{color:'var(--text-muted)'}}>Services</Link>
            <span>›</span>
            <span style={{color:'var(--text-primary)'}}>{platform.name}</span>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 420px',gap:'32px',alignItems:'start'}}>
            {/* Left — Info */}
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'24px'}}>
                <div className={`platform-icon ${platform.id}`} style={{margin:0,fontSize:'2rem'}}>
                  {platformEmoji[platform.id]}
                </div>
                <div>
                  <h1 style={{fontSize:'2rem',marginBottom:'4px'}}>{platform.name}</h1>
                  <p style={{fontSize:'0.9rem',color:'var(--text-muted)'}}>{platform.description}</p>
                </div>
              </div>

              {/* Key facts */}
              <div className="bento-grid bento-grid-3" style={{marginBottom:'32px'}}>
                <div className="bento-card" style={{padding:'20px',textAlign:'center'}}>
                  <div style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:'800',color:'var(--accent)',marginBottom:'4px'}}>
                    ${platform.basePrice}
                  </div>
                  <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>from / review (US)</div>
                </div>
                <div className="bento-card" style={{padding:'20px',textAlign:'center'}}>
                  <div style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:'800',color:'var(--green)',marginBottom:'4px'}}>
                    {platform.deliveryDays}d
                  </div>
                  <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>Delivery time</div>
                </div>
                <div className="bento-card" style={{padding:'20px',textAlign:'center'}}>
                  <div style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:'800',color:'var(--yellow)',marginBottom:'4px'}}>
                    5★
                  </div>
                  <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>All reviews rated</div>
                </div>
              </div>

              {/* Features */}
              <div className="bento-card" style={{marginBottom:'24px'}}>
                <h3 style={{marginBottom:'20px'}}>What&apos;s Included</h3>
                <ul className="feature-list">
                  {platform.features.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>

              {/* Packages table */}
              <div className="bento-card">
                <h3 style={{marginBottom:'20px'}}>Packages — United States</h3>
                <table style={{width:'100%'}}>
                  <thead>
                    <tr>
                      <th style={{padding:'10px 0',textAlign:'left',fontSize:'0.78rem',color:'var(--text-muted)',borderBottom:'1px solid var(--border)'}}>
                        Reviews
                      </th>
                      <th style={{padding:'10px 0',textAlign:'left',fontSize:'0.78rem',color:'var(--text-muted)',borderBottom:'1px solid var(--border)'}}>
                        Per Review
                      </th>
                      <th style={{padding:'10px 0',textAlign:'left',fontSize:'0.78rem',color:'var(--text-muted)',borderBottom:'1px solid var(--border)'}}>
                        Total
                      </th>
                      <th style={{padding:'10px 0',borderBottom:'1px solid var(--border)'}}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {platform.packages.map(qty => (
                      <tr key={qty}>
                        <td style={{padding:'12px 0',fontWeight:600}}>{qty} reviews</td>
                        <td style={{padding:'12px 0',color:'var(--text-muted)'}}>${platform.basePrice}</td>
                        <td style={{padding:'12px 0',fontWeight:800,fontSize:'1.05rem'}}>
                          ${(platform.basePrice * qty).toFixed(2)}
                        </td>
                        <td style={{padding:'12px 0'}}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setSelectedQty(qty)}
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right — Order Form */}
            <div style={{position:'sticky',top:'96px'}}>
              <div className="bento-card accent-card" style={{marginBottom:'16px'}}>
                <h3 style={{marginBottom:'24px'}}>Configure Your Order</h3>

                {/* Qty */}
                <div style={{marginBottom:'20px'}}>
                  <label className="form-label" style={{marginBottom:'10px',display:'block'}}>
                    Number of Reviews
                  </label>
                  <div className="package-selector">
                    {platform.packages.map(qty => (
                      <button
                        key={qty}
                        className={`package-btn ${selectedQty === qty ? 'active' : ''}`}
                        onClick={() => setSelectedQty(qty)}
                      >
                        {qty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Country */}
                <div style={{marginBottom:'20px'}}>
                  <label className="form-label" style={{marginBottom:'10px',display:'block'}}>
                    Country of Reviews
                  </label>
                  <select
                    className="form-input"
                    value={selectedCountry}
                    onChange={e => setSelectedCountry(e.target.value)}
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} — ${getPricePerReview(platform.id, c.code)}/review
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target URL */}
                <div style={{marginBottom:'20px'}}>
                  <label className="form-label" style={{marginBottom:'8px',display:'block'}}>
                    Your Business URL *
                  </label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder={urlPlaceholder[platform.id]}
                    value={targetUrl}
                    onChange={e => setTargetUrl(e.target.value)}
                  />
                  <div style={{fontSize:'0.78rem',color:'var(--text-muted)',marginTop:'6px'}}>
                    Your {platform.name.replace(' Reviews','')} business profile link
                  </div>
                </div>

                {/* Business Name */}
                <div style={{marginBottom:'20px'}}>
                  <label className="form-label" style={{marginBottom:'8px',display:'block'}}>
                    Business Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. The Coffee House NYC"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                  />
                </div>

                {/* Notes */}
                <div style={{marginBottom:'24px'}}>
                  <label className="form-label" style={{marginBottom:'8px',display:'block'}}>
                    Notes (optional)
                  </label>
                  <textarea
                    className="form-input"
                    placeholder="Any specific instructions, keywords to include in reviews…"
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>

                {/* Summary */}
                <div style={{
                  background:'var(--bg-primary)',
                  borderRadius:'var(--radius-lg)',
                  padding:'16px',
                  marginBottom:'20px',
                }}>
                  <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.88rem'}}>
                      <span style={{color:'var(--text-muted)'}}>Platform</span>
                      <span style={{fontWeight:600}}>{platform.name}</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.88rem'}}>
                      <span style={{color:'var(--text-muted)'}}>Country</span>
                      <span style={{fontWeight:600}}>{country.flag} {country.name}</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.88rem'}}>
                      <span style={{color:'var(--text-muted)'}}>Qty × Price</span>
                      <span>{selectedQty} × ${pricePerReview}</span>
                    </div>
                    <div style={{height:'1px',background:'var(--border)',margin:'4px 0'}}/>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <span style={{fontWeight:700}}>Total</span>
                      <span style={{fontFamily:'var(--font-display)',fontSize:'1.6rem',fontWeight:'800',color:'var(--text-primary)'}}>
                        ${totalPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <Link href="/register" className="btn btn-primary btn-full btn-lg" style={{justifyContent:'center'}}>
                  Proceed to Payment →
                </Link>

                <div style={{display:'flex',flexDirection:'column',gap:'8px',marginTop:'16px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'0.8rem',color:'var(--text-muted)'}}>
                    <span>🔒</span> Secure checkout powered by Stripe
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'0.8rem',color:'var(--text-muted)'}}>
                    <span>🛡️</span> {platform.guarantee}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
