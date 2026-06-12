'use client'

import { useState } from 'react'
import Link from 'next/link'

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

export function TicketsClient({ initialTickets }: { initialTickets: any[] }) {
  const [tickets, setTickets] = useState(initialTickets)
  const [view, setView] = useState<'list' | 'detail' | 'new'>('list')
  const [activeTicket, setActiveTicket] = useState<any | null>(null)
  const [replyText, setReplyText] = useState('')
  const [newTicket, setNewTicket] = useState({ subject: '', orderId: '', priority: 'normal', message: '' })
  const [localMessages, setLocalMessages] = useState<any[]>([])

  const handleOpenTicket = (ticket: any) => {
    setActiveTicket(ticket)
    setLocalMessages(ticket.messages || [])
    setView('detail')
  }

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeTicket) return
    // Here we would ideally call an API route to save the message
    // For now we just update locally for optimistic UI
    const msg = {
      id: Math.random().toString(),
      isStaff: false,
      content: replyText,
      createdAt: new Date().toISOString(),
    }
    setLocalMessages(prev => [...prev, msg])
    setReplyText('')
  }

  const handleCreateTicket = async () => {
    // Here we would ideally call an API route to create the ticket
    // For now we just close the form
    setView('list')
  }

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Support Tickets</h1>
          <p style={{color:'var(--text-muted)',fontSize:'0.9rem',marginTop:'4px'}}>
            {view === 'list' ? 'Manage your support requests' : view === 'new' ? 'Open a new ticket' : `Ticket ${activeTicket?.id.slice(-8)}`}
          </p>
        </div>
        <div style={{display:'flex',gap:'10px'}}>
          {view !== 'list' && (
            <button onClick={() => setView('list')} className="btn btn-secondary btn-sm">
              ← Back to Tickets
            </button>
          )}
          {view === 'list' && (
            <button onClick={() => setView('new')} className="btn btn-primary">
              + Open Ticket
            </button>
          )}
        </div>
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          {tickets.length === 0 && (
            <div className="bento-card" style={{textAlign:'center',padding:'60px',color:'var(--text-muted)'}}>
              <div style={{fontSize:'3rem',marginBottom:'16px'}}>🎫</div>
              <h3 style={{marginBottom:'8px'}}>No tickets yet</h3>
              <p>If you have any issues, open a support ticket and we&apos;ll help you out.</p>
            </div>
          )}
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              className="ticket-card"
              onClick={() => handleOpenTicket(ticket)}
            >
              <div className="ticket-icon">🎫</div>
              <div className="ticket-content">
                <div className="ticket-subject">{ticket.subject}</div>
                <div className="ticket-meta">
                  <span>{ticket.id.slice(-8)}</span>
                  {ticket.orderId && <span>Order: {ticket.orderId.slice(-8)}</span>}
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'6px',alignItems:'flex-end',flexShrink:0}}>
                <span className={`badge ${STATUS_STYLES[ticket.status]}`}>{ticket.status}</span>
                <span className={`badge ${PRIORITY_STYLES[ticket.priority]}`} style={{fontSize:'0.7rem'}}>
                  {ticket.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL VIEW */}
      {view === 'detail' && activeTicket && (
        <div className="table-wrapper">
          {/* Ticket Header */}
          <div className="table-header" style={{flexWrap:'wrap',gap:'12px'}}>
            <div>
              <h3>{activeTicket.subject}</h3>
              <div style={{display:'flex',gap:'10px',marginTop:'6px'}}>
                <span className={`badge ${STATUS_STYLES[activeTicket.status]}`}>{activeTicket.status}</span>
                <span className={`badge ${PRIORITY_STYLES[activeTicket.priority]}`}>{activeTicket.priority}</span>
                {activeTicket.orderId && (
                  <Link href={`/dashboard/orders`} style={{fontSize:'0.82rem',color:'var(--accent)'}}>
                    Order: {activeTicket.orderId.slice(-8)}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {localMessages.length === 0 && (
              <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>No messages yet.</div>
            )}
            {localMessages.map(msg => (
              <div key={msg.id} className={`chat-message ${msg.isStaff ? 'staff' : 'user'}`}>
                <div className="chat-avatar">
                  {msg.isStaff ? '🛡️' : 'U'}
                </div>
                <div>
                  <div style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:'4px',textAlign: msg.isStaff ? 'left' : 'right'}}>
                    {msg.isStaff ? 'Support Team' : 'You'} · {new Date(msg.createdAt).toLocaleString()}
                  </div>
                  <div className="chat-bubble">{msg.content}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Box */}
          {activeTicket.status !== 'closed' && (
            <div style={{padding:'20px 24px',borderTop:'1px solid var(--border)'}}>
              <textarea
                className="form-input"
                placeholder="Write your reply…"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                rows={3}
              />
              <div style={{display:'flex',justifyContent:'flex-end',marginTop:'12px'}}>
                <button className="btn btn-primary" onClick={handleSendReply}>
                  Send Reply →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* NEW TICKET */}
      {view === 'new' && (
        <div className="bento-card" style={{maxWidth:'640px'}}>
          <h3 style={{marginBottom:'24px'}}>Open a Support Ticket</h3>
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Brief description of your issue"
                value={newTicket.subject}
                onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Related Order (optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Order ID"
                value={newTicket.orderId}
                onChange={e => setNewTicket({...newTicket, orderId: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-input" value={newTicket.priority}
                onChange={e => setNewTicket({...newTicket, priority: e.target.value})}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                className="form-input"
                placeholder="Describe your issue in detail…"
                rows={5}
                value={newTicket.message}
                onChange={e => setNewTicket({...newTicket, message: e.target.value})}
              />
            </div>
            <div style={{display:'flex',gap:'12px',justifyContent:'flex-end',marginTop:'8px'}}>
              <button className="btn btn-secondary" onClick={() => setView('list')}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateTicket}>
                Submit Ticket →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
