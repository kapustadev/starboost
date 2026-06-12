'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PLATFORMS, COUNTRIES, calculatePrice, getPricePerReview } from '@/lib/data'

const NAV_LINKS = [
  { label: 'Google Reviews', href: '/services/google' },
  { label: 'Facebook Reviews', href: '/services/facebook' },
  { label: 'Trustpilot', href: '/services/trustpilot' },
  { label: 'Pricing', href: '#pricing' },
]

const TESTIMONIALS = [
  { name: 'Marco V.', role: 'Restaurant Owner, Italy', text: 'Got 25 Google reviews delivered within 5 days. All 5-star, real profiles. Our Google rating went from 3.8 to 4.6. Incredible results.', rating: 5, initial: 'M' },
  { name: 'Anna K.', role: 'Salon Owner, Poland', text: 'Ordered 10 reviews for my beauty salon. Delivery was fast and the reviews look completely genuine. Highly recommend!', rating: 5, initial: 'A' },
  { name: 'David R.', role: 'E-commerce, USA', text: 'Trustpilot reviews were delivered slowly and naturally — exactly as described. No drops after 3 weeks. Great service.', rating: 5, initial: 'D' },
  { name: 'Sophie L.', role: 'Boutique Hotel, France', text: 'The geo-targeted reviews are amazing. French reviews from real French accounts. Our local ranking improved significantly.', rating: 5, initial: 'S' },
  { name: 'Olena M.', role: 'Law Firm, Ukraine', text: 'Very professional service. The team helped me choose the right package and delivery was on time. Will order again.', rating: 5, initial: 'O' },
  { name: 'Thomas B.', role: 'Agency Owner, Germany', text: 'Using StarsBoost for all our clients. Quality is consistent, support is fast. A+ provider.', rating: 5, initial: 'T' },
]

const FAQS = [
  { q: 'Are these real reviews from real accounts?', a: 'Yes. All reviews are placed by real people with verified accounts. We never use bots or fake profiles. Each reviewer has an established account history.' },
  { q: 'How fast will I get my reviews?', a: 'Delivery depends on the platform and package size. Google reviews typically arrive within 3-7 days, Facebook in 2-5 days. We deliver gradually to ensure natural appearance.' },
  { q: 'What if reviews get removed?', a: 'We offer a 30-day replacement guarantee for Google and Facebook reviews (15 days for Trustpilot). If any review is removed within that period, we replace it for free.' },
  { q: 'Can I choose what country the reviews come from?', a: 'Absolutely! We support 20+ countries including USA, UK, Germany, Poland, France, Ukraine, and many more. Country-specific reviews help with local SEO ranking.' },
  { q: 'Do you need my Google account password?', a: 'Never. We only need your Google Maps business profile URL or your business name. No login credentials are ever required.' },
  { q: 'Is this safe for my business?', a: 'We follow a natural delivery pace to minimize any risk. Our reviewers have established account histories which makes the reviews look organic and safe.' },
]

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('google')
  const [selectedCountry, setSelectedCountry] = useState('us')
  const [selectedQty, setSelectedQty] = useState(10)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const platform = PLATFORMS.find(p => p.id === selectedPlatform)!
  const country = COUNTRIES.find(c => c.code === selectedCountry)!
  const totalPrice = calculatePrice(selectedPlatform, selectedCountry, selectedQty)
  const pricePerReview = getPricePerReview(selectedPlatform, selectedCountry)

  return (
    <>
      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-inner">
            <Link href="/" className="navbar-logo">
              Stars<span>Boost</span>
            </Link>
            <ul className="navbar-nav">
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
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

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              ⭐ Trusted by 2,000+ businesses worldwide
            </div>
            <h1>
              Buy Real <span className="highlight">Google & Facebook</span> Reviews
            </h1>
            <p className="hero-desc">
              Boost your business reputation with authentic, verified reviews from real accounts. 
              Choose your country, platform, and quantity — we handle the rest.
            </p>
            <div className="hero-actions">
              <Link href="#pricing" className="btn btn-primary btn-lg">
                Order Reviews →
              </Link>
              <Link href="/services/google" className="btn btn-secondary btn-lg">
                View Packages
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">2,000+</div>
                <div className="hero-stat-label">Happy Clients</div>
              </div>
              <div style={{width:'1px',height:'40px',background:'var(--border)'}}/>
              <div>
                <div className="hero-stat-num">150K+</div>
                <div className="hero-stat-label">Reviews Delivered</div>
              </div>
              <div style={{width:'1px',height:'40px',background:'var(--border)'}}/>
              <div>
                <div className="hero-stat-num">4.9★</div>
                <div className="hero-stat-label">Client Rating</div>
              </div>
              <div style={{width:'1px',height:'40px',background:'var(--border)'}}/>
              <div>
                <div className="hero-stat-num">20+</div>
                <div className="hero-stat-label">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section className="section section-sm">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Our Services</span>
            <h2>Choose Your Platform</h2>
            <p>Real reviews on the platforms that matter most for your business</p>
          </div>
          <div className="bento-grid bento-grid-3">
            {PLATFORMS.map(p => (
              <Link key={p.id} href={`/services/${p.id}`} className="bento-card accent-card" style={{textDecoration:'none'}}>
                <div className={`platform-icon ${p.id}`}>
                  {p.id === 'google' && '🅖'}
                  {p.id === 'facebook' && '📘'}
                  {p.id === 'trustpilot' && '⭐'}
                </div>
                <h3 style={{marginBottom:'8px'}}>{p.name}</h3>
                <p style={{fontSize:'0.88rem',marginBottom:'20px'}}>{p.description}</p>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <span style={{fontFamily:'var(--font-display)',fontSize:'1.6rem',fontWeight:'800',color:'var(--text-primary)'}}>
                      ${p.basePrice}
                    </span>
                    <span style={{fontSize:'0.8rem',color:'var(--text-muted)',marginLeft:'4px'}}>/review</span>
                  </div>
                  <span className="badge badge-purple">{p.deliveryDays} days</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING CALCULATOR */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Pricing</span>
            <h2>Calculate Your Order</h2>
            <p>Transparent pricing with no hidden fees. Pay only for what you need.</p>
          </div>

          <div className="bento-grid" style={{gridTemplateColumns:'1fr 380px',gap:'24px'}}>
            {/* Left — configurator */}
            <div className="bento-card" style={{display:'flex',flexDirection:'column',gap:'28px'}}>
              {/* Platform */}
              <div>
                <label className="form-label" style={{marginBottom:'12px',display:'block'}}>Platform</label>
                <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                  {PLATFORMS.map(p => (
                    <button
                      key={p.id}
                      className={`package-btn ${selectedPlatform === p.id ? 'active' : ''}`}
                      onClick={() => setSelectedPlatform(p.id)}
                    >
                      {p.id === 'google' && '🅖 '}
                      {p.id === 'facebook' && '📘 '}
                      {p.id === 'trustpilot' && '⭐ '}
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="form-label" style={{marginBottom:'12px',display:'block'}}>
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
              <div>
                <label className="form-label" style={{marginBottom:'12px',display:'block'}}>
                  Country of Reviews
                  <span style={{fontSize:'0.78rem',color:'var(--text-muted)',marginLeft:'8px'}}>
                    (affects price)
                  </span>
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
                      <span className="country-price">${getPricePerReview(selectedPlatform, c.code)}</span>
                    </button>
                  ))}
                </div>
                <details style={{marginTop:'10px'}}>
                  <summary style={{cursor:'pointer',fontSize:'0.85rem',color:'var(--accent)',padding:'8px 0'}}>
                    Show all countries ({COUNTRIES.length} available)
                  </summary>
                  <div className="country-grid" style={{marginTop:'10px'}}>
                    {COUNTRIES.slice(12).map(c => (
                      <button
                        key={c.code}
                        className={`country-option ${selectedCountry === c.code ? 'selected' : ''}`}
                        onClick={() => setSelectedCountry(c.code)}
                      >
                        <span className="country-flag">{c.flag}</span>
                        <span className="country-name">{c.name}</span>
                        <span className="country-price">${getPricePerReview(selectedPlatform, c.code)}</span>
                      </button>
                    ))}
                  </div>
                </details>
              </div>
            </div>

            {/* Right — order summary */}
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div className="bento-card accent-card" style={{flex:1}}>
                <h3 style={{marginBottom:'24px'}}>Order Summary</h3>

                <div style={{display:'flex',flexDirection:'column',gap:'14px',marginBottom:'28px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.9rem'}}>
                    <span style={{color:'var(--text-muted)'}}>Platform</span>
                    <span style={{fontWeight:'600'}}>{platform.name}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.9rem'}}>
                    <span style={{color:'var(--text-muted)'}}>Country</span>
                    <span style={{fontWeight:'600'}}>{country.flag} {country.name}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.9rem'}}>
                    <span style={{color:'var(--text-muted)'}}>Quantity</span>
                    <span style={{fontWeight:'600'}}>{selectedQty} reviews</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.9rem'}}>
                    <span style={{color:'var(--text-muted)'}}>Price per review</span>
                    <span style={{fontWeight:'600'}}>${pricePerReview}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.9rem'}}>
                    <span style={{color:'var(--text-muted)'}}>Delivery</span>
                    <span style={{fontWeight:'600',color:'var(--green)'}}>{platform.deliveryDays} days</span>
                  </div>
                </div>

                <div style={{height:'1px',background:'var(--border)',margin:'0 0 20px'}}/>

                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
                  <span style={{fontSize:'0.9rem',color:'var(--text-muted)'}}>Total</span>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontFamily:'var(--font-display)',fontSize:'2.4rem',fontWeight:'800',color:'var(--text-primary)',lineHeight:'1'}}>
                      ${totalPrice}
                    </div>
                    <div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>USD, one-time</div>
                  </div>
                </div>

                <Link href="/register" className="btn btn-primary btn-full btn-lg" style={{justifyContent:'center'}}>
                  Order Now →
                </Link>

                <div style={{marginTop:'16px',display:'flex',flexDirection:'column',gap:'8px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'0.82rem',color:'var(--text-muted)'}}>
                    <span>🔒</span> Secure payment via Stripe
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'0.82rem',color:'var(--text-muted)'}}>
                    <span>🛡️</span> {platform.guarantee}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'0.82rem',color:'var(--text-muted)'}}>
                    <span>📞</span> 24/7 support via tickets
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bento-card">
                <h4 style={{marginBottom:'16px',fontSize:'0.95rem'}}>What&apos;s included</h4>
                <ul className="feature-list">
                  {platform.features.map(f => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-sm" style={{background:'var(--bg-secondary)'}}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Process</span>
            <h2>How It Works</h2>
            <p>Get your reviews in 3 simple steps</p>
          </div>
          <div className="bento-grid bento-grid-3">
            {[
              { step:'01', icon:'🎯', title:'Choose Package', desc:'Select your platform, country, and number of reviews. Use our calculator to see the exact price.' },
              { step:'02', icon:'💳', title:'Place Your Order', desc:'Create an account, submit your business URL, and pay securely via Stripe. No hidden fees.' },
              { step:'03', icon:'⭐', title:'Receive Reviews', desc:'We deliver reviews gradually and naturally. Track progress in your dashboard in real-time.' },
            ].map(s => (
              <div key={s.step} className="bento-card">
                <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'20px'}}>
                  <span style={{fontSize:'1.8rem'}}>{s.icon}</span>
                  <span style={{fontFamily:'var(--font-display)',fontSize:'0.78rem',fontWeight:'700',color:'var(--accent)',textTransform:'uppercase',letterSpacing:'0.1em'}}>
                    Step {s.step}
                  </span>
                </div>
                <h3 style={{fontSize:'1.2rem',marginBottom:'10px'}}>{s.title}</h3>
                <p style={{fontSize:'0.9rem',lineHeight:'1.7'}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Testimonials</span>
            <h2>What Our Clients Say</h2>
            <p>Trusted by 2,000+ businesses across 20+ countries</p>
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

      {/* FAQ */}
      <section className="section section-sm" style={{background:'var(--bg-secondary)'}}>
        <div className="container" style={{maxWidth:'760px'}}>
          <div className="section-header">
            <span className="section-eyebrow">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div>
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <span style={{fontSize:'1.2rem',color:'var(--accent)',flexShrink:0}}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="section section-sm">
        <div className="container">
          <div className="bento-card accent-card" style={{textAlign:'center',padding:'60px 40px'}}>
            <h2 style={{marginBottom:'16px',fontSize:'2.2rem'}}>
              Ready to Boost Your Reputation?
            </h2>
            <p style={{fontSize:'1.05rem',marginBottom:'32px',maxWidth:'500px',margin:'0 auto 32px'}}>
              Join 2,000+ businesses already using StarsBoost to build trust and attract more customers.
            </p>
            <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Start Now — It&apos;s Easy →
              </Link>
              <Link href="#pricing" className="btn btn-secondary btn-lg">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand-name">Stars<span>Boost</span></div>
              <p className="footer-desc">
                Real, verified reviews from real accounts. Boost your business reputation with geo-targeted reviews on Google, Facebook, and Trustpilot.
              </p>
              <div style={{display:'flex',gap:'12px'}}>
                <span style={{width:'32px',height:'32px',borderRadius:'8px',background:'var(--bg-card)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem',cursor:'pointer'}}>🐦</span>
                <span style={{width:'32px',height:'32px',borderRadius:'8px',background:'var(--bg-card)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem',cursor:'pointer'}}>📘</span>
                <span style={{width:'32px',height:'32px',borderRadius:'8px',background:'var(--bg-card)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem',cursor:'pointer'}}>📸</span>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Services</div>
              <ul className="footer-links">
                <li><Link href="/services/google">Google Reviews</Link></li>
                <li><Link href="/services/facebook">Facebook Reviews</Link></li>
                <li><Link href="/services/trustpilot">Trustpilot Reviews</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
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
