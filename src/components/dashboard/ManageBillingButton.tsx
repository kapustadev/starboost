'use client'

import { useState } from 'react'

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false)

  const handleManage = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.message || 'Failed to open billing portal')
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button className="btn btn-secondary btn-sm" onClick={handleManage} disabled={loading}>
      {loading ? 'Loading...' : 'Manage Billing'}
    </button>
  )
}
