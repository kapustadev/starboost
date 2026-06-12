'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Clock } from 'lucide-react'
import { PayNowButton } from './PayNowButton'

export function UnpaidOrderAlert({ order }: { order: any }) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState('')
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const expireTime = new Date(order.createdAt).getTime() + 30 * 60 * 1000

    const updateTimer = () => {
      const now = Date.now()
      const diff = expireTime - now

      if (diff <= 0) {
        setExpired(true)
        // Explicitly cancel it so server is aware
        fetch(`/api/stripe/checkout-existing`, { 
          method: 'DELETE', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id }) 
        }).catch(console.error)
        return
      }

      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [order.createdAt, order.id, router])

  if (expired || !timeLeft) return null

  return (
    <div style={{
      background: 'var(--accent-glow)',
      border: '1px solid var(--accent)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <AlertTriangle color="var(--yellow)" size={28} />
        <div>
          <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            You have an unpaid order
            <span style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--yellow)',
              background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '12px',
              fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-display)'
            }}>
              <Clock size={14} />
              {timeLeft}
            </span>
          </h4>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            {order.quantity} {order.platform} reviews ({order.country.toUpperCase()}) for ${order.totalPrice}. Complete payment to start the campaign.
          </p>
        </div>
      </div>
      <PayNowButton orderId={order.id} />
    </div>
  )
}
