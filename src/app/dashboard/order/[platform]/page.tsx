'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PLATFORMS, COUNTRIES, calculatePrice, getPricePerReview } from '@/lib/data'
import type { TextOption } from '@/lib/data'
import { Lock } from 'lucide-react'

export default function DashboardOrderPage({ params }: { params: Promise<{ platform: string }> }) {
  const { platform: platformId } = use(params)
  const platform = PLATFORMS.find(p => p.id === platformId)

  const [selectedCountry, setSelectedCountry] = useState('us')
  const [selectedQty, setSelectedQty] = useState(10)
  const [customQty, setCustomQty] = useState('')
  const [textOption, setTextOption] = useState<TextOption>('none')
  const [frequency, setFrequency] = useState('1/3days')

  if (!platform) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Platform not found</h1>
        <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>← Back to Dashboard</Link>
      </div>
    )
  }

  const effectiveQty = customQty !== '' ? (parseInt(customQty) || 0) : selectedQty
  const country = COUNTRIES.find(c => c.code === selectedCountry)!
  const pricePerReview = getPricePerReview(platform.id, selectedCountry, textOption)
  const totalPrice = calculatePrice(platform.id, selectedCountry, effectiveQty, textOption)

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Order {platform.shortName} Reviews</h1>
          <p style={{color:'var(--text-muted)',fontSize:'0.9rem',marginTop:'4px'}}>Configure your package and start building trust.</p>
        </div>
      </div>

      <div className="calculator-grid-wide" style={{ marginTop: '24px' }}>
        {/* LEFT — Info + features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="bento-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Image src={platform.icon} alt={platform.name} width={64} height={64} style={{ borderRadius: '12px' }} />
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{platform.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{platform.description}</p>
            </div>
          </div>

          <div className="bento-grid bento-grid-3">
            <div className="bento-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '4px' }}>
                from ${platform.basePrice}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>per review (US)</div>
            </div>
            <div className="bento-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--green)', marginBottom: '4px' }}>
                {platform.deliveryDays}d
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Delivery time</div>
            </div>
            <div className="bento-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--yellow)', marginBottom: '4px' }}>
                5★
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{platform.guarantee}</div>
            </div>
          </div>

          <div className="bento-card">
            <h3 style={{ marginBottom: '20px' }}>What&apos;s Included</h3>
            <ul className="feature-list">
              {platform.features.map(f => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </div>

        {/* RIGHT — Order Form */}
        <div style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="bento-card accent-card">
            {/* Quantity */}
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>Number of Reviews</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
                {platform.packages.map(qty => (
                  <button
                    key={qty}
                    className={`package-btn ${selectedQty === qty && customQty === '' ? 'active' : ''}`}
                    onClick={() => { setSelectedQty(qty); setCustomQty('') }}
                    style={{ padding: '10px 14px', flex: '0 0 auto' }}
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
                    flex: 1, minWidth: '90px', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                    border: customQty !== '' ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: customQty !== '' ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                    color: 'var(--text-primary)', fontSize: '0.88rem', fontWeight: 600, outline: 'none', fontFamily: 'inherit',
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

            {/* Delivery Frequency */}
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Delivery Frequency</label>
              <select className="form-input" value={frequency} onChange={e => setFrequency(e.target.value)}>
                <option value="1/day">1 review per day</option>
                <option value="1/2days">1 review every 2 days</option>
                <option value="1/3days">1 review every 3 days (Recommended)</option>
                <option value="1/5days">1 review every 5 days</option>
                <option value="1/week">1 review per week</option>
              </select>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Frequency</span>
                  <span style={{ fontWeight: 600, color: 'var(--green)' }}>{frequency === '1/day' ? 'Daily' : frequency.replace('1/', 'Every ').replace('days', ' days')}</span>
                </div>
                <div style={{ height: '1px', background: 'var(--border)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ${totalPrice}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/checkout?platform=${platform.id}&qty=${effectiveQty}&country=${selectedCountry}&textOption=${textOption}&frequency=${encodeURIComponent(frequency)}`}
              className="btn btn-primary btn-full btn-lg"
              style={{ justifyContent: 'center' }}
            >
              Continue to Checkout →
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Lock size={14} /> Secure checkout powered by Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
