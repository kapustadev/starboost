'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PLATFORMS, COUNTRIES, calculatePrice, getPricePerReview } from '@/lib/data'
import type { TextOption } from '@/lib/data'

const TESTIMONIALS = [
  { name: 'Marco V.', role: 'Restaurant Owner, Italy', text: 'Got 25 Google reviews delivered within 5 days. All 5-star, real profiles. Our rating went from 3.8 to 4.6. Incredible results.', rating: 5, initial: 'M' },
  { name: 'Anna K.', role: 'Salon Owner, Poland', text: 'Ordered 10 reviews for my beauty salon. Delivery was fast and reviews look completely genuine. Highly recommend!', rating: 5, initial: 'A' },
  { name: 'David R.', role: 'E-commerce, USA', text: 'Trustpilot reviews were delivered slowly and naturally — exactly as described. No drops after 3 weeks. Great service.', rating: 5, initial: 'D' },
  { name: 'Sophie L.', role: 'Boutique Hotel, France', text: 'The geo-targeted reviews are amazing. French reviews from real French accounts. Our local ranking improved significantly.', rating: 5, initial: 'S' },
  { name: 'Olena M.', role: 'Law Firm, Ukraine', text: 'Very professional service. The team helped me choose the right package. Delivery was on time. Will order again.', rating: 5, initial: 'O' },
  { name: 'Thomas B.', role: 'Agency Owner, Germany', text: 'Using StarsBoost for all our clients. Quality is consistent, support is fast. A+ provider.', rating: 5, initial: 'T' },
]

const FAQS = [
  { q: 'Are these real reviews from real accounts?', a: 'Yes. All reviews are placed by real people with verified accounts. We never use bots or fake profiles. Each reviewer has an established account history.' },
  { q: 'How fast will I get my reviews?', a: 'Delivery depends on the platform and package size. Google reviews typically arrive within 3–7 days, Facebook in 2–5 days. We deliver gradually to ensure natural appearance.' },
  { q: 'What if reviews get removed?', a: 'We offer a 30-day replacement guarantee for Google and Facebook reviews (15 days for Trustpilot). If any review is removed within that period, we replace it for free.' },
  { q: 'Can I choose what country the reviews come from?', a: 'Absolutely! We support 22 countries including USA, UK, Germany, Poland, France, Ukraine, and many more. Country-specific reviews help with local SEO ranking.' },
  { q: 'Do you need my Google account password?', a: 'Never. We only need your Google Maps business profile URL. No login credentials are ever required.' },
  { q: 'What does the "+$2 for our text" option mean?', a: 'By default, our reviewers write their own natural text. If you want us to write specific text (mentioning your services, keywords, etc.), we charge +$2 per review for this option.' },
]

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('google')
  const [selectedCountry, setSelectedCountry] = useState('us')
  const [selectedQty, setSelectedQty] = useState(10)
  const [customQty, setCustomQty] = useState('')
  const [textOption, setTextOption] = useState<TextOption>('none')
  const [frequency, setFrequency] = useState('1/3days')
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

  const platform = PLATFORMS.find(p => p.id === selectedPlatform)!
  const country = COUNTRIES.find(c => c.code === selectedCountry)!
  const effectiveQty = customQty !== '' ? (parseInt(customQty) || 0) : selectedQty
  const totalPrice = calculatePrice(selectedPlatform, selectedCountry, effectiveQty, textOption)
  const pricePerReview = getPricePerReview(selectedPlatform, selectedCountry, textOption)

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-inner">
            <Link href="/" className="navbar-logo">Stars<span>Boost</span></Link>

            <ul className="navbar-nav">
              {/* Services Dropdown */}
              <li style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setServicesOpen(v => !v)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: servicesOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: servicesOpen ? 'var(--bg-card)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                  }}
                >
                  Services
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: servicesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {servicesOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '8px',
                    minWidth: '240px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 200,
                  }}>
                    {PLATFORMS.map(p => (
                      <Link
                        key={p.id}
                        href={`/services/${p.id}`}
                        onClick={() => setServicesOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
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
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">⭐ Trusted by 2,000+ businesses worldwide</div>
            <h1>Buy Real <span className="highlight">Google & Facebook</span> Reviews</h1>
            <p className="hero-desc">
              Boost your business reputation with authentic, verified reviews from real accounts.
              Choose your country, platform, and quantity — we handle the rest.
            </p>
            <div className="hero-actions">
              <Link href="#pricing" className="btn btn-primary btn-lg">Order Reviews →</Link>
              <Link href="/services/google" className="btn btn-secondary btn-lg">View Packages</Link>
            </div>
            <div className="hero-stats">
              <div><div className="hero-stat-num">2,000+</div><div className="hero-stat-label">Happy Clients</div></div>
              <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />
              <div><div className="hero-stat-num">150K+</div><div className="hero-stat-label">Reviews Delivered</div></div>
              <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />
              <div><div className="hero-stat-num">4.9★</div><div className="hero-stat-label">Client Rating</div></div>
              <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />
              <div><div className="hero-stat-num">22</div><div className="hero-stat-label">Countries</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORMS ── */}
      <section className="section section-sm">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Our Services</span>
            <h2>Choose Your Platform</h2>
            <p>Real reviews on the platforms that matter most for your business</p>
          </div>
          <div className="bento-grid bento-grid-3">
            {PLATFORMS.map(p => (
              <Link key={p.id} href={`/services/${p.id}`} className="bento-card accent-card" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <Image src={p.icon} alt={p.name} width={48} height={48} style={{ borderRadius: '10px' }} />
                  <h3 style={{ margin: 0 }}>{p.name}</h3>
                </div>
                <p style={{ fontSize: '0.88rem', marginBottom: '20px' }}>{p.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      from ${p.basePrice}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>/review</span>
                  </div>
                  <span className="badge badge-purple">{p.deliveryDays} days</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING CALCULATOR ── */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Pricing</span>
            <h2>Calculate Your Order</h2>
            <p>Transparent pricing with no hidden fees. Pay only for what you need.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
            {/* LEFT — Configurator */}
            <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

              {/* Platform */}
              <div>
                <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>Platform</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {PLATFORMS.map(p => (
                    <button
                      key={p.id}
                      className={`package-btn ${selectedPlatform === p.id ? 'active' : ''}`}
                      onClick={() => setSelectedPlatform(p.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Image src={p.icon} alt={p.name} width={18} height={18} style={{ borderRadius: '4px' }} />
                      {p.shortName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>Number of Reviews</label>
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
                      width: '100px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: customQty !== '' ? '1px solid var(--accent)' : '1px solid var(--border)',
                      background: customQty !== '' ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                {customQty !== '' && parseInt(customQty) > 0 && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--accent)', marginTop: '8px' }}>
                    ✓ Custom quantity: {customQty} reviews
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>
                  Country of Reviews
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '8px' }}>(affects price)</span>
                </label>
                <div className="country-grid">
                  {COUNTRIES.slice(0, 12).map(c => (
                    <button
                      key={c.code}
                      className={`country-option ${selectedCountry === c.code ? 'selected' : ''}`}
                      onClick={() => setSelectedCountry(c.code)}
                    >
                      <span className="country-flag">{c.flag}</span>
                      <span className="country-name">{c.name}</span>
                      <span className="country-price">${getPricePerReview(selectedPlatform, c.code, textOption)}</span>
                    </button>
                  ))}
                </div>
                <details style={{ marginTop: '10px' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--accent)', padding: '8px 0', listStyle: 'none' }}>
                    ▸ Show all 22 countries
                  </summary>
                  <div className="country-grid" style={{ marginTop: '10px' }}>
                    {COUNTRIES.slice(12).map(c => (
                      <button
                        key={c.code}
                        className={`country-option ${selectedCountry === c.code ? 'selected' : ''}`}
                        onClick={() => setSelectedCountry(c.code)}
                      >
                        <span className="country-flag">{c.flag}</span>
                        <span className="country-name">{c.name}</span>
                        <span className="country-price">${getPricePerReview(selectedPlatform, c.code, textOption)}</span>
                      </button>
                    ))}
                  </div>
                </details>
              </div>

              {/* Review Text Option */}
              <div>
                <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>Review Text</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { value: 'none' as TextOption, label: 'No text (rating only)', desc: 'Just a star rating, no written text', extra: '' },
                    { value: 'client' as TextOption, label: 'Reviewer writes their own text', desc: 'Our reviewers write natural, organic text', extra: '' },
                    { value: 'ours' as TextOption, label: 'We write the text for you', desc: 'We craft specific text with your keywords', extra: '+$2/review' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setTextOption(opt.value)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-md)',
                        border: textOption === opt.value ? '1px solid var(--accent)' : '1px solid var(--border)',
                        background: textOption === opt.value ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s',
                        fontFamily: 'inherit',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          border: textOption === opt.value ? '5px solid var(--accent)' : '2px solid var(--border-light)',
                          background: 'transparent',
                          flexShrink: 0,
                          transition: 'all 0.15s',
                        }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: textOption === opt.value ? 'var(--accent)' : 'var(--text-primary)' }}>
                            {opt.label}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{opt.desc}</div>
                        </div>
                      </div>
                      {opt.extra && (
                        <span className="badge badge-yellow" style={{ flexShrink: 0 }}>{opt.extra}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Frequency */}
              <div>
                <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>Delivery Frequency</label>
                <select
                  className="form-input"
                  value={frequency}
                  onChange={e => setFrequency(e.target.value)}
                >
                  <option value="1/day">1 review per day</option>
                  <option value="1/2days">1 review every 2 days</option>
                  <option value="1/3days">1 review every 3 days (Recommended)</option>
                  <option value="1/5days">1 review every 5 days</option>
                  <option value="1/week">1 review per week</option>
                </select>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Slower delivery looks more natural to {platform.name}.
                </div>
              </div>
            </div>

            {/* RIGHT — Order Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="bento-card accent-card">
                <h3 style={{ marginBottom: '24px' }}>Order Summary</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Image src={platform.icon} alt={platform.name} width={32} height={32} style={{ borderRadius: '8px' }} />
                  <span style={{ fontWeight: 700 }}>{platform.name}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Country</span>
                    <span style={{ fontWeight: 600 }}>{country.flag} {country.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Quantity</span>
                    <span style={{ fontWeight: 600 }}>{effectiveQty} reviews</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Base price/review</span>
                    <span>${getPricePerReview(selectedPlatform, selectedCountry, 'none')}</span>
                  </div>
                  {textOption === 'ours' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Our text surcharge</span>
                      <span style={{ color: 'var(--yellow)' }}>+$2 × {effectiveQty}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Price/review</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent)' }}>${pricePerReview}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Delivery Frequency</span>
                    <span style={{ fontWeight: 600, color: 'var(--green)' }}>{frequency === '1/day' ? 'Daily' : frequency.replace('1/', 'Every ').replace('days', ' days')}</span>
                  </div>
                </div>

                <div style={{ height: '1px', background: 'var(--border)', marginBottom: '20px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                      ${totalPrice}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>USD, one-time</div>
                  </div>
                </div>

                <Link href={`/services/${selectedPlatform}`} className="btn btn-primary btn-full btn-lg" style={{ justifyContent: 'center' }}>
                  Configure & Order →
                </Link>

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>🔒</span> Secure payment via Stripe
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>🛡️</span> {platform.guarantee}
                  </div>
                </div>
              </div>

              <div className="bento-card">
                <h4 style={{ marginBottom: '14px', fontSize: '0.95rem' }}>What&apos;s included</h4>
                <ul className="feature-list">
                  {platform.features.map(f => <li key={f}>{f}</li>)}
                </ul>
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
            <p>Get your reviews in 3 simple steps</p>
          </div>
          <div className="bento-grid bento-grid-3">
            {[
              { step: '01', icon: '🎯', title: 'Choose Package', desc: 'Select your platform, country, quantity, and whether you want custom text. See the exact price instantly.' },
              { step: '02', icon: '💳', title: 'Place Your Order', desc: 'Create an account, submit your business URL, and pay securely via Stripe. No hidden fees.' },
              { step: '03', icon: '⭐', title: 'Receive Reviews', desc: 'We deliver reviews gradually and naturally. Track every review in your dashboard in real-time.' },
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
            <h2>What Our Clients Say</h2>
            <p>Trusted by 2,000+ businesses across 22 countries</p>
          </div>
          <div className="bento-grid bento-grid-3">
            {TESTIMONIALS.map(r => (
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

      {/* ── CTA ── */}
      <section className="section section-sm">
        <div className="container">
          <div className="bento-card accent-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '2.2rem' }}>Ready to Boost Your Reputation?</h2>
            <p style={{ fontSize: '1.05rem', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
              Join 2,000+ businesses already using StarsBoost to build trust and attract more customers.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-primary btn-lg">Start Now →</Link>
              <Link href="#pricing" className="btn btn-secondary btn-lg">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand-name">Stars<span>Boost</span></div>
              <p className="footer-desc">Real, verified reviews from real accounts. Boost your business reputation with geo-targeted reviews on Google, Facebook, and Trustpilot.</p>
            </div>
            <div>
              <div className="footer-col-title">Services</div>
              <ul className="footer-links">
                {PLATFORMS.map(p => (
                  <li key={p.id}><Link href={`/services/${p.id}`}>{p.name}</Link></li>
                ))}
                <li><Link href="#pricing">Pricing Calculator</Link></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Account</div>
              <ul className="footer-links">
                <li><Link href="/login">Sign In</Link></li>
                <li><Link href="/register">Register</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/dashboard/orders">My Orders</Link></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Legal</div>
              <ul className="footer-links">
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/refund">Refund Policy</Link></li>
                <li><a href="mailto:support@starsboost.com">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 StarsBoost. All rights reserved.</span>
            <span>🔒 Payments secured by Stripe</span>
          </div>
        </div>
      </footer>
    </>
  )
}
