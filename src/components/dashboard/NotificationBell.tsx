'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Check } from 'lucide-react'
import { getNotifications, markNotificationsAsRead } from '@/app/actions/notifications'
import Link from 'next/link'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.isRead).length

  useEffect(() => {
    async function load() {
      const data = await getNotifications()
      setNotifications(data)
    }
    load()
    // Poll every 30 seconds
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkRead = async () => {
    await markNotificationsAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          color: 'var(--text-secondary)'
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            background: 'var(--red)',
            color: 'white',
            fontSize: '0.65rem',
            fontWeight: 'bold',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--bg-primary)'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '50px',
          right: '0',
          width: '320px',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-md)',
          zIndex: 100,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkRead}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>
          
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Bell size={32} style={{ opacity: 0.2, marginBottom: '8px' }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <Link 
                  key={notification.id}
                  href={notification.link || '#'}
                  onClick={() => setIsOpen(false)}
                  style={{ 
                    display: 'block', 
                    padding: '16px', 
                    borderBottom: '1px solid var(--border)',
                    textDecoration: 'none',
                    background: notification.isRead ? 'transparent' : 'var(--bg-secondary)',
                    transition: 'background 0.2s'
                  }}
                >
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {notification.title}
                  </h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {notification.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
