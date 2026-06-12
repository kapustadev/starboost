'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PLATFORMS, COUNTRIES, calculatePrice, getPricePerReview, TextOption } from '@/lib/data'
import { signIn, useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const URL_PLACEHOLDER: Record<string, string> = {
  google: 'https://maps.google.com/?cid=123456 or your Google Maps link',
  facebook: 'https://facebook.com/your-page-name',
  trustpilot: 'https://trustpilot.com/review/yourwebsite.com',
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const platformId = searchParams.get('platform') || 'google'
  const qty = parseInt(searchParams.get('qty') || '10')
  const countryCode = searchParams.get('country') || 'us'
  const textOption = (searchParams.get('textOption') as TextOption) || 'none'
  const frequency = searchParams.get('frequency') || '1/3days'

  const platform = PLATFORMS.find(p => p.id === platformId)
  const country = COUNTRIES.find(c => c.code === countryCode)

  const pricePerReview = platform ? getPricePerReview(platform.id, countryCode, textOption) : 0
  const totalPrice = platform ? calculatePrice(platform.id, countryCode, qty, textOption) : 0

  const [targetUrl, setTargetUrl] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [notes, setNotes] = useState('')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [contactSocial, setContactSocial] = useState('')
  const [createAccount, setCreateAccount] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email)
      if (session.user.name) setName(session.user.name)
    }
  }, [session])

  useEffect(() => {
    if (session) return 
    const checkEmail = async () => {
      if (email.length > 5 && email.includes('@')) {
        try {
          const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`)
          const data = await res.json()
          setEmailExists(data.exists)
          if (data.exists) {
            setCreateAccount(false)
          }
        } catch (e) {}
      } else {
        setEmailExists(false)
      }
    }
    const timeout = setTimeout(checkEmail, 500)
    return () => clearTimeout(timeout)
  }, [email, session])

  if (!platform || !country) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Invalid Order Configuration</h2>
          <Link href="/" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>← Back to Home</Link>
        </div>
      </div>
    )
  }

  const handleCheckout = async () => {
    if (!targetUrl) {
      alert('Please enter your Business URL')
      return
    }
    if (!session && !email) {
      alert('Please enter your email address to receive order updates')
      return
    }
    if (!name) {
      alert('Please enter your name')
      return
    }

    setLoading(true)

    if (emailExists && !session && password) {
      const res = await signIn('credentials', { redirect: false, email, password })
      if (res?.error) {
        alert(res.error)
        setLoading(false)
        return
      }
    }

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: platform.id,
          country: country.code,
          quantity: qty,
          textOption,
          frequency,
          targetUrl,
          businessName,
          notes,
          pricePerReview,
          totalPrice,
          email,
          createAccount,
          password,
          name,
          contactSocial
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
      <Navbar />

      <section className="section" style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container">
          <h1 style={{ marginBottom: '40px', fontSize: '2.4rem' }}>Checkout</h1>

          <div className="calculator-grid" style={{ gap: '32px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div className="bento-card">
                <h3 style={{ marginBottom: '20px' }}>Contact Details</h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Full Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="John Doe" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Email Address *</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="you@example.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    disabled={!!session}
                  />
                  {!session && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>We'll send order updates here.</div>}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Telegram / WhatsApp (Optional)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="@username or phone number" 
                    value={contactSocial} 
                    onChange={e => setContactSocial(e.target.value)} 
                  />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>For faster communication regarding your order.</div>
                </div>

                {!session && emailExists && (
                  <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent)', marginBottom: '16px' }}>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--accent)' }}>An account with this email exists. Please log in to link this order.</p>
                    <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Password</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="Your password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                    />
                  </div>
                )}

                {!session && !emailExists && (
                  <>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: createAccount ? '16px' : '0' }}>
                      <input 
                        type="checkbox" 
                        checked={createAccount} 
                        onChange={e => setCreateAccount(e.target.checked)} 
                        style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Create an account to track your order</span>
                    </label>

                    {createAccount && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '28px', marginTop: '16px' }}>
                        <div>
                          <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Password *</label>
                          <input type="password" className="form-input" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="bento-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0 }}>Business Details</h3>
                  <span className="badge badge-accent">{platform.name}</span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Business URL *</label>
                  <input type="url" className="form-input" placeholder={URL_PLACEHOLDER[platform.id] || "https://..."} value={targetUrl} onChange={e => setTargetUrl(e.target.value)} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Business Name</label>
                  <input type="text" className="form-input" placeholder="e.g. The Coffee House" value={businessName} onChange={e => setBusinessName(e.target.value)} />
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Notes (optional)</label>
                  <textarea className="form-input" placeholder="Keywords, specific instructions…" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </div>

            </div>

            <div style={{ position: 'sticky', top: '96px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="bento-card accent-card">
                <h3 style={{ marginBottom: '24px' }}>Order Summary</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Platform</span>
                    <span style={{ fontWeight: 600 }}>{platform.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Country</span>
                    <span style={{ fontWeight: 600 }}>{country.flag} {country.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Reviews</span>
                    <span style={{ fontWeight: 600 }}>{qty}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Frequency</span>
                    <span style={{ fontWeight: 600, color: 'var(--green)' }}>{frequency === '1/day' ? 'Daily' : frequency.replace('1/', 'Every ').replace('days', ' days')}</span>
                  </div>
                  {textOption === 'ours' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Custom Text</span>
                      <span style={{ color: 'var(--yellow)' }}>Included (+${2 * qty})</span>
                    </div>
                  )}
                  <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ${totalPrice}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-full btn-lg"
                  style={{ justifyContent: 'center' }}
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Pay with Stripe →'}
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>🔒</span> Secure checkout powered by Stripe
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
