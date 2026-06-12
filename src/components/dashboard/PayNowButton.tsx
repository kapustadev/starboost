'use client'

import { useState } from 'react'

export function PayNowButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/stripe/checkout-existing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.message || 'Failed to initialize checkout')
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred')
      setLoading(false)
    }
  }

  return (
    <button className="btn btn-primary btn-sm" onClick={handlePay} disabled={loading}>
      {loading ? 'Redirecting...' : 'Pay Now'}
    </button>
  )
}
