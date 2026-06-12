'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PLATFORMS, COUNTRIES, calculatePrice, getPricePerReview } from '@/lib/data'
import type { TextOption } from '@/lib/data'
import { useSession } from 'next-auth/react'

const TESTIMONIALS: Record<string, any[]> = {
  google: [
    { name: 'Marco V.', role: 'Restaurant Owner', text: 'Got 25 Google reviews delivered within 5 days. All 5-star, real profiles. Our rating went from 3.8 to 4.6. Incredible results.', rating: 5, initial: 'M' },
    { name: 'Sarah L.', role: 'Dentist', text: 'Google reviews are critical for our practice. StarsBoost delivered high-quality, local reviews that helped us rank #1 in the map pack.', rating: 5, initial: 'S' },
    { name: 'John D.', role: 'Plumber', text: 'Best service for Google Maps. Fast delivery, natural profiles, and not a single review dropped after 2 months.', rating: 5, initial: 'J' },
  ],
  facebook: [
    { name: 'Anna K.', role: 'Salon Owner', text: 'Ordered 10 reviews for my beauty salon page. Delivery was fast and reviews look completely genuine. Highly recommend!', rating: 5, initial: 'A' },
    { name: 'Elena R.', role: 'Boutique Shop', text: 'Facebook reviews from real local accounts really helped build trust with our new customers. Will order again.', rating: 5, initial: 'E' },
    { name: 'David M.', role: 'Agency Owner', text: 'Great quality profiles with history and photos. Facebook didn\'t flag anything. Very safe.', rating: 5, initial: 'D' },
  ],
  trustpilot: [
    { name: 'David R.', role: 'E-commerce', text: 'Trustpilot reviews were delivered slowly and naturally — exactly as described. No drops after 3 weeks. Great service.', rating: 5, initial: 'D' },
    { name: 'Mark T.', role: 'Software SaaS', text: 'Boosted our Trustpilot score from 2.5 to 4.2 in a month. Professional communication and reliable delivery.', rating: 5, initial: 'M' },
    { name: 'Lisa B.', role: 'Online Store', text: 'Trustpilot is strict, but StarsBoost knows what they are doing. Real users from our target country. Perfect.', rating: 5, initial: 'L' },
  ]
}

const FAQS = [
  { q: 'Are these real reviews from real accounts?', a: 'Yes. All reviews are placed by real people with verified accounts. We never use bots or fake profiles. Each reviewer has an established account history.' },
  { q: 'How fast will I get my reviews?', a: 'Delivery depends on the frequency you select. We recommend 1 review every 3 days for natural growth, but you can choose faster delivery.' },
  { q: 'What if reviews get removed?', a: 'We offer a replacement guarantee. If any review is removed within the guarantee period, we replace it for free.' },
  { q: 'Can I choose what country the reviews come from?', a: 'Absolutely! We support 22 countries including USA, UK, Germany, Poland, France, Ukraine, and many more. Country-specific reviews help with local SEO ranking.' },
  { q: 'What does the "+$2 for our text" option mean?', a: 'By default, our reviewers write their own natural text. If you want us to write specific text (mentioning your services, keywords, etc.), we charge +$2 per review for this option.' },
]

const URL_PLACEHOLDER: Record<string, string> = {
  google: 'https://maps.google.com/?cid=123456 or your Google Maps business link',
  facebook: 'https://facebook.com/your-page-name',
  trustpilot: 'https://trustpilot.com/review/yourwebsite.com',
}

export default function ServicePage({ params }: { params: { platform: string } }) {
  const platform = PLATFORMS.find(p => p.id === params.platform)

  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('us')
  const [selectedQty, setSelectedQty] = useState(10)
  const [customQty, setCustomQty] = useState('')
  const [textOption, setTextOption] = useState<TextOption>('none')
  const [frequency, setFrequency] = useState('1/3days')
  const [targetUrl, setTargetUrl] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [notes, setNotes] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

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
  const testimonials = TESTIMONIALS[platform.id] || TESTIMONIALS.google

  const handleCheckout = async () => {
    if (!session) {
      window.location.href = `/login?callbackUrl=/services/${platform.id}`
      return
    }

    if (!targetUrl) {
      alert('Please enter your Business URL')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: platform.id,
          country: selectedCountry,
          quantity: effectiveQty,
          textOption,
          frequency,
          targetUrl,
          businessName,
          notes,
          pricePerReview,
          totalPrice
        })
      })

      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        alert(data.message || 'Checkout failed')
        setLoading(false)
      }
    } catch (err) {
      alert('An error occurred during checkout')
      setLoading(false)
    }
  }

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-inner">
            <Link href="/" className="navbar-logo">Stars<span>Boost</span></Link>

            <ul className="navbar-nav">
              <li style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setServicesOpen(v => !v)}
                  style={{
                    padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 500,
                    color: servicesOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: servicesOpen ? 'var(--bg-card)' : 'transparent',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'all 0.2s', fontFamily: 'inherit',
                  }}
                >
                  Services
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: servicesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {servicesOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)',
                    padding: '8px', minWidth: '240px', boxShadow: 'var(--shadow-lg)', zIndex: 200,
                  }}>
                    {PLATFORMS.map(p => (
                      <Link key={p.id} href={`/services/${p.id}`} onClick={() => setServicesOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <Image src={p.icon} alt={p.name} width={24} height={24} style={{ borderRadius: '6px' }} />
                        {p.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
              <li><Link href="#pricing">Pricing</Link></li>
              <li><Link href="#how">How it works</Link></li>
              <li><Link href="#faq">FAQ</Link></li>
            </ul>

            <div className="navbar-actions">
              <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" style={{ padding: '120px 0 80px', minHeight: 'auto' }}>
        <div className="container">
          <div className="hero-content" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <Image src={platform.icon} alt={platform.name} width={80} height={80} style={{ borderRadius: '20px' }} />
            </div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', marginBottom: '20px' }}>Buy Real <span className="highlight">{platform.name}</span></h1>
            <p className="hero-desc" style={{ margin: '0 auto 40px' }}>
              {platform.description} Build trust, improve your ranking, and attract more customers with verified reviews from your target country.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="#pricing" className="btn btn-primary btn-lg">Order {platform.shortName} Reviews →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING CALCULATOR ── */}
      <section className="section" id="pricing" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: '32px', alignItems: 'start' }}>
            
            {/* LEFT — Info + features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="bento-grid bento-grid-3">
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

              <div className="bento-card">
                <h3 style={{ marginBottom: '20px' }}>What&apos;s Included</h3>
                <ul className="feature-list">
                  {platform.features.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>

              <div className="bento-card">
                <h3 style={{ marginBottom: '20px' }}>Example Packages (US pricing)</h3>
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
                          <button className="btn btn-primary btn-sm" onClick={() => { setSelectedQty(qty); setCustomQty(''); window.scrollTo({ top: document.getElementById('pricing')?.offsetTop, behavior: 'smooth' }) }}>Select</button>
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
                  <h3 style={{ margin: 0 }}>Configure {platform.shortName} Order</h3>
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
                        width: '130px', padding: '10px 12px', borderRadius: 'var(--radius-md)',
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

                <button
                  className="btn btn-primary btn-full btn-lg"
                  style={{ justifyContent: 'center' }}
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Proceed to Payment →'}
                </button>

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
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section section-sm" id="how" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Process</span>
            <h2>How It Works</h2>
            <p>Get your {platform.shortName} reviews in 3 simple steps</p>
          </div>
          <div className="bento-grid bento-grid-3">
            {[
              { step: '01', icon: '🎯', title: 'Choose Package', desc: `Select your country, quantity, and whether you want custom text for your ${platform.shortName} reviews.` },
              { step: '02', icon: '💳', title: 'Place Your Order', desc: 'Provide your business URL and pay securely via Stripe. No hidden fees.' },
              { step: '03', icon: '⭐', title: 'Receive Reviews', desc: `We deliver reviews gradually at your chosen frequency. Track progress in your dashboard.` },
            ].map(s => (
              <div key={s.step} className="bento-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{s.icon}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Step {s.step}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Testimonials</span>
            <h2>What Our {platform.shortName} Clients Say</h2>
          </div>
          <div className="bento-grid bento-grid-3">
            {testimonials.map(r => (
              <div key={r.name} className="review-card">
                <div className="stars">{'★'.repeat(r.rating)}</div>
                <p className="review-text">&ldquo;{r.text}&rdquo;</p>
                <div className="review-author">
                  <div className="review-avatar">{r.initial}</div>
                  <div>
                    <div className="review-name">{r.name}</div>
                    <div className="review-role">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section section-sm" id="faq" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <div className="section-header">
            <span className="section-eyebrow">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div>
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span style={{ fontSize: '1.2rem', color: 'var(--accent)', flexShrink: 0 }}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && <div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: 0 }}>
            <span>© 2025 StarsBoost. All rights reserved.</span>
            <span>🔒 Payments secured by Stripe</span>
          </div>
        </div>
      </footer>
    </>
  )
}
