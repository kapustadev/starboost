'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, Star, AlertCircle, ArrowRight } from 'lucide-react'
import { PLATFORMS } from '@/lib/data'

export function RatingCalculatorClient() {
  const [platformId, setPlatformId] = useState('google')
  const [currentRating, setCurrentRating] = useState('4.2')
  const [currentReviews, setCurrentReviews] = useState('150')
  const [desiredRating, setDesiredRating] = useState('4.5')

  const platform = PLATFORMS.find(p => p.id === platformId) || PLATFORMS[0]

  const currentR = parseFloat(currentRating)
  const currentN = parseInt(currentReviews)
  const desiredR = parseFloat(desiredRating)

  let needed5Star = 0
  let errorMsg = ''
  let successMsg = ''

  if (isNaN(currentR) || isNaN(currentN) || isNaN(desiredR)) {
    errorMsg = 'Please enter valid numbers.'
  } else if (currentR < 1 || currentR > 5 || desiredR < 1 || desiredR > 5) {
    errorMsg = 'Ratings must be between 1 and 5.'
  } else if (desiredR <= currentR) {
    successMsg = 'You have already reached or exceeded this rating!'
  } else if (desiredR === 5) {
    if (currentR < 5) {
      errorMsg = 'It is mathematically impossible to reach exactly 5.0 once you have any reviews below 5 stars. Try 4.9 instead.'
    } else {
      successMsg = 'You already have a perfect 5.0 rating!'
    }
  } else {
    const needed = (currentN * (desiredR - currentR)) / (5 - desiredR)
    needed5Star = Math.ceil(needed)
  }

  return (
    <div className="calculator-grid-wide" style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'var(--accent-glow)', borderRadius: '12px', flexShrink: 0 }}>
              <Calculator color="var(--accent)" size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{platform.name} Review Calculator</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Find out exactly how many 5-star reviews your business needs to reach your desired average rating.
              </p>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border)' }} />

          <div>
            <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>Select Platform</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  className={`package-btn ${platformId === p.id ? 'active' : ''}`}
                  onClick={() => setPlatformId(p.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px' }}
                >
                  {p.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bento-card">
          <h3 style={{ marginBottom: '20px' }}>Why does your rating matter?</h3>
          <ul style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px', 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            <li style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>✓</span>
              <span><strong>Higher trust:</strong> 87% of consumers won't consider a business with a rating below 3.3.</span>
            </li>
            <li style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>✓</span>
              <span><strong>More visibility:</strong> Algorithms prioritize businesses with higher ratings and more reviews.</span>
            </li>
            <li style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>✓</span>
              <span><strong>Increased conversions:</strong> A 0.1 increase in star rating can boost conversion rates by up to 25%.</span>
            </li>
          </ul>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="bento-card accent-card">


          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Current Average Rating</label>
            <input 
              type="number" 
              step="0.1" 
              min="1" 
              max="5" 
              className="form-input" 
              value={currentRating} 
              onChange={e => setCurrentRating(e.target.value)} 
              placeholder="e.g. 4.2"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Total Number of Current Reviews</label>
            <input 
              type="number" 
              className="form-input" 
              value={currentReviews} 
              onChange={e => setCurrentReviews(e.target.value)} 
              placeholder="e.g. 150"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Desired Average Rating</label>
            <input 
              type="number" 
              step="0.1" 
              min="1" 
              max="5" 
              className="form-input" 
              value={desiredRating} 
              onChange={e => setDesiredRating(e.target.value)} 
              placeholder="e.g. 4.5"
            />
          </div>

          <div style={{ height: '1px', background: 'var(--border)', margin: '24px 0' }} />

          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            {errorMsg ? (
              <div style={{ color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textAlign: 'left', lineHeight: 1.5 }}>
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            ) : successMsg ? (
              <div style={{ color: 'var(--green)', fontSize: '1.2rem', fontWeight: 600 }}>
                {successMsg}
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>You need approximately</p>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
                  {needed5Star}
                </div>
                <p style={{ color: 'var(--text-primary)', marginTop: '8px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  new <Star size={18} color="var(--yellow)" fill="var(--yellow)" /> 5-star reviews
                </p>
              </div>
            )}
          </div>

          {!errorMsg && !successMsg && needed5Star > 0 && (
            <Link href={`/services/${platform.id}`} className="btn btn-primary btn-full btn-lg" style={{ justifyContent: 'center', marginTop: '16px' }}>
              Buy {Math.min(needed5Star, 500)} {platform.shortName} Reviews <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
