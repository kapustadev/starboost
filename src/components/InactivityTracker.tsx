'use client'

import { useEffect, useRef } from 'react'
import { signOut, useSession } from 'next-auth/react'

const INACTIVITY_LIMIT_MS = 30 * 60 * 1000 // 30 minutes

export default function InactivityTracker() {
  const { data: session } = useSession()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!session) return // Only track when logged in

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        // Log out the user after inactivity
        signOut({ callbackUrl: '/login?reason=inactivity' })
      }, INACTIVITY_LIMIT_MS)
    }

    // Initialize timer
    resetTimer()

    // Listen for user activity
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    
    // Throttle the event listeners slightly so we don't clear/set timeouts 1000x a second
    let throttleTimer: NodeJS.Timeout | null = null
    const handleActivity = () => {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          resetTimer()
          throttleTimer = null
        }, 1000)
      }
    }

    events.forEach(event => {
      window.addEventListener(event, handleActivity)
    })

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (throttleTimer) clearTimeout(throttleTimer)
      events.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [session])

  return null
}
