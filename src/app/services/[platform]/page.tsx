'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PLATFORMS, COUNTRIES, calculatePrice, getPricePerReview } from '@/lib/data'
import type { TextOption } from '@/lib/data'

const URL_PLACEHOLDER: Record<string, string> = {
  google: 'https://maps.google.com/?cid=123456 or your Google Maps business link',
  facebook: 'https://facebook.com/your-page-name',
  trustpilot: 'https://trustpilot.com/review/yourwebsite.com',
}

export default function ServicePage({ params }: { params: { platform: string } }) {
  const platform = PLATFORMS.find(p => p.id === params.platform)

  const [selectedCountry, setSelectedCountry] = useState('us')
  const [selectedQty, setSelectedQty] = useState(10)
  const [customQty, setCustomQty] = useState('')
  const [textOption, setTextOption] = useState<TextOption>('none')
  const [targetUrl, setTargetUrl] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [notes, setNotes] = useState('')

  if (!platform) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Platform not found</h1>
          <Link href="/" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>← Back to Home</Link>
        </div>
      </div>
    )
  }

  const effectiveQty = customQty !== '' ? (parseInt(customQty) || 0) : selectedQty
  const country = COUNTRIES.find(c => c.code === selectedCountry)!
  const pricePerReview = getPricePerReview(platform.id, selectedCountry, textOption)
  const totalPrice = calculatePrice(platform.id, selectedCountry, effectiveQty, textOption)

  return (
    <>
      {/* Navbar */}
      <nav className="navbar scrolled">
        <div className="container">
          <div className="navbar-inner">
            <Link href="/" className="navbar-logo">Stars<span>Boost</span></Link>
            <ul className="navbar-nav">
              {PLATFORMS.map(p => (
                <li key={p.id}>
                  <Link href={`/services/${p.id}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Image src={p.icon} alt={p.name} width={16} height={16} style={{ borderRadius: '3px' }} />
                    {p.shortName}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="navbar-actions">
              <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
            <Link href="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
            <span>›</span>
            <span style={{ color: 'var(--text-primary)' }}>{platform.name}</span>
          </div>

          {/* Hero */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '48px' }}>
            <Image src={platform.icon} alt={platform.name} width={64} height={64} style={{ borderRadius: '16px' }} />
            <div>
              <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>{platform.name}</h1>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{platform.description}</p>
            </div>
          </div>

          {/* Key Facts */}
          <div className="bento-grid bento-grid-3" style={{ marginBottom: '40px' }}>
            <div className="bento-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '4px' }}>
                from ${platform.basePrice}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>per review (US)</div>
            </div>
            <div className="bento-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--green)', marginBottom: '4px' }}>
                {platform.deliveryDays}d
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Delivery time</div>
            </div>
            <div className="bento-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--yellow)', marginBottom: '4px' }}>
                5★
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{platform.guarantee}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: '32px', alignItems: 'start' }}>
            {/* LEFT — Info + features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="bento-card">
                <h3 style={{ marginBottom: '20px' }}>What&apos;s Included</h3>
                <ul className="feature-list">
                  {platform.features.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>

              <div className="bento-card">
                <h3 style={{ marginBottom: '20px' }}>Packages (US pricing)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Reviews', 'Per Review', 'No Text', 'Our Text', ''].map(h => (
                        <th key={h} style={{ padding: '10px 0', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {platform.packages.map(qty => (
                      <tr key={qty}>
                        <td style={{ padding: '12px 0', fontWeight: 600 }}>{qty} reviews</td>
                        <td style={{ padding: '12px 0', color: 'var(--text-muted)' }}>${platform.basePrice}</td>
                        <td style={{ padding: '12px 0', fontWeight: 700 }}>${(platform.basePrice * qty).toFixed(0)}</td>
                        <td style={{ padding: '12px 0', fontWeight: 700, color: 'var(--yellow)' }}>${(platform.basePrice * qty + 2 * qty).toFixed(0)}</td>
                        <td style={{ padding: '12px 0' }}>
                          <button className="btn btn-primary btn-sm" onClick={() => { setSelectedQty(qty); setCustomQty('') }}>Select</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT — Order Form */}
            <div style={{ position: 'sticky', top: '96px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="bento-card accent-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <Image src={platform.icon} alt={platform.name} width={36} height={36} style={{ borderRadius: '8px' }} />
                  <h3 style={{ margin: 0 }}>Configure Order</h3>
                </div>

                {/* Quantity */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>Number of Reviews</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {platform.packages.map(qty => (
                      <button
                        key={qty}
                        className={`package-btn ${selectedQty === qty && customQty === '' ? 'active' : ''}`}
                        onClick={() => { setSelectedQty(qty); setCustomQty('') }}
                      >
                        {qty}
                      </button>
                    ))}
                    <input
                      type="number"
                      min="1"
                      placeholder="Custom…"
                      value={customQty}
                      onChange={e => { setCustomQty(e.target.value); setSelectedQty(0) }}
                      style={{
                        width: '90px',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: customQty !== '' ? '1px solid var(--accent)' : '1px solid var(--border)',
                        background: customQty !== '' ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>

                {/* Country */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Country of Reviews</label>
                  <select className="form-input" value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} — ${getPricePerReview(platform.id, c.code, textOption)}/review
                      </option>
                    ))}
                  </select>
                </div>

                {/* Text Option */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Review Text</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[
                      { value: 'none' as TextOption, label: 'No text (rating only)', extra: '' },
                      { value: 'client' as TextOption, label: 'Reviewer writes own text', extra: '' },
                      { value: 'ours' as TextOption, label: 'We write the text', extra: '+$2/review' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setTextOption(opt.value)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 14px', borderRadius: 'var(--radius-md)',
                          border: textOption === opt.value ? '1px solid var(--accent)' : '1px solid var(--border)',
                          background: textOption === opt.value ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                          cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'inherit',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                            border: textOption === opt.value ? '5px solid var(--accent)' : '2px solid var(--border-light)',
                            transition: 'all 0.15s',
                          }} />
                          <span style={{ fontSize: '0.88rem', fontWeight: 500, color: textOption === opt.value ? 'var(--accent)' : 'var(--text-primary)' }}>
                            {opt.label}
                          </span>
                        </div>
                        {opt.extra && <span className="badge badge-yellow">{opt.extra}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Business URL */}
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Business URL *</label>
                  <input type="url" className="form-input" placeholder={URL_PLACEHOLDER[platform.id]} value={targetUrl} onChange={e => setTargetUrl(e.target.value)} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Business Name</label>
                  <input type="text" className="form-input" placeholder="e.g. The Coffee House" value={businessName} onChange={e => setBusinessName(e.target.value)} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Notes (optional)</label>
                  <textarea className="form-input" placeholder="Keywords, specific instructions…" rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
                </div>

                {/* Summary */}
                <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Country</span>
                      <span style={{ fontWeight: 600 }}>{country.flag} {country.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Qty × Price</span>
                      <span>{effectiveQty} × ${pricePerReview}</span>
                    </div>
                    {textOption === 'ours' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Our text</span>
                        <span style={{ color: 'var(--yellow)' }}>+${2 * effectiveQty}</span>
                      </div>
                    )}
                    <div style={{ height: '1px', background: 'var(--border)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700 }}>Total</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ${totalPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <Link href="/register" className="btn btn-primary btn-full btn-lg" style={{ justifyContent: 'center' }}>
                  Proceed to Payment →
                </Link>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>🔒</span> Secure checkout powered by Stripe
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
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
