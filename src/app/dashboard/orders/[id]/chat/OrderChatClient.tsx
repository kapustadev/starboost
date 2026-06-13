'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendChatMessage } from './actions'
import { toast } from 'react-hot-toast'

const STATUS_STYLES: Record<string, string> = {
  open: 'badge-yellow',
  in_progress: 'badge-blue',
  resolved: 'badge-green',
  closed: 'badge-muted',
}

const PRIORITY_STYLES: Record<string, string> = {
  low: 'badge-muted',
  normal: 'badge-blue',
  high: 'badge-yellow',
  urgent: 'badge-red',
}

export function OrderChatClient({ ticket, orderId }: { ticket: any, orderId: string }) {
  const [localMessages, setLocalMessages] = useState<any[]>(ticket.messages || [])
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSendReply = async () => {
    if (!replyText.trim() || isSubmitting) return
    setIsSubmitting(true)
    
    // Optimistic UI update
    const optimisticMsg = {
      id: Math.random().toString(),
      isStaff: false,
      content: replyText,
      createdAt: new Date().toISOString(),
      ticketId: ticket.id
    }
    setLocalMessages(prev => [...prev, optimisticMsg])
    const contentToSend = replyText
    setReplyText('')

    const res = await sendChatMessage(ticket.id, contentToSend)
    if (res?.error) {
      toast.error(res.error)
      // Revert optimistic update
      setLocalMessages(prev => prev.filter(m => m.id !== optimisticMsg.id))
    }
    
    setIsSubmitting(false)
  }

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Order Chat</h1>
          <p style={{color:'var(--text-muted)',fontSize:'0.9rem',marginTop:'4px'}}>
            Communication regarding Order {orderId.slice(-8)}
          </p>
        </div>
        <div>
          <Link href="/dashboard/orders" className="btn btn-secondary btn-sm">
            ← Back to Orders
          </Link>
        </div>
      </div>

      <div className="table-wrapper">
        {/* Ticket Header */}
        <div className="table-header" style={{flexWrap:'wrap',gap:'12px'}}>
          <div>
            <h3>{ticket.subject}</h3>
            <div style={{display:'flex',gap:'10px',marginTop:'6px'}}>
              <span className={`badge ${STATUS_STYLES[ticket.status] || 'badge-muted'}`}>{ticket.status}</span>
              <span className={`badge ${PRIORITY_STYLES[ticket.priority] || 'badge-muted'}`}>{ticket.priority}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '300px', maxHeight: '500px', overflowY: 'auto' }}>
          {localMessages.length === 0 && (
            <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>No messages yet. Our support agent will reach out soon.</div>
          )}
          {localMessages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: msg.isStaff ? 'row' : 'row-reverse', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: msg.isStaff ? 'var(--bg-secondary)' : 'var(--accent-glow)', border: msg.isStaff ? '1px solid var(--border)' : '1px solid rgba(108, 99, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, color: msg.isStaff ? 'var(--text-primary)' : 'var(--accent)' }}>
                {msg.isStaff ? '🛡️' : 'U'}
              </div>
              <div style={{ maxWidth: '80%' }}>
                <div style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:'4px',textAlign: msg.isStaff ? 'left' : 'right'}}>
                  {msg.isStaff ? 'Support Team' : 'You'} · {new Date(msg.createdAt).toLocaleString()}
                </div>
                <div style={{ background: msg.isStaff ? 'var(--bg-secondary)' : 'var(--accent)', color: msg.isStaff ? 'var(--text-primary)' : '#fff', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: msg.isStaff ? '1px solid var(--border)' : 'none', whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: '0.95rem' }}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        {ticket.status !== 'closed' ? (
          <div style={{padding:'20px 24px',borderTop:'1px solid var(--border)', background: 'var(--bg-card)'}}>
            <textarea
              className="form-input"
              placeholder="Write your message..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              rows={3}
              style={{ background: 'var(--bg-primary)' }}
            />
            <div style={{display:'flex',justifyContent:'flex-end',marginTop:'12px'}}>
              <button className="btn btn-primary" onClick={handleSendReply} disabled={isSubmitting || !replyText.trim()}>
                {isSubmitting ? 'Sending...' : 'Send Message →'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{padding:'20px 24px',borderTop:'1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)'}}>
            This chat is closed.
          </div>
        )}
      </div>
    </>
  )
}
