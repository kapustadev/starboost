'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock } from 'lucide-react'

export function OrderTimer({ createdAt }: { createdAt: Date }) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const expireTime = new Date(createdAt).getTime() + 30 * 60 * 1000

    const updateTimer = () => {
      const now = Date.now()
      const diff = expireTime - now

      if (diff <= 0) {
        setTimeLeft('Expired')
        setTimeout(() => router.refresh(), 1000)
        return
      }

      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [createdAt, router])

  if (!timeLeft) return null

  return (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '4px', 
      color: timeLeft === 'Expired' ? 'var(--red)' : 'var(--yellow)',
      background: 'rgba(0,0,0,0.2)',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: 600,
      fontFamily: 'var(--font-display)'
    }}>
      <Clock size={14} />
      {timeLeft}
    </span>
  )
}
