'use client'

import { useState } from 'react'
import Link from 'next/link'

const TICKETS = [
  {
    id: 'TKT-001',
    subject: 'Question about delivery timeline for ORD-002',
    status: 'open',
    priority: 'normal',
    orderId: 'ORD-002',
    date: '2025-06-11',
    messages: [
      { id: 1, isStaff: false, content: 'Hi, I ordered 10 Facebook reviews 2 days ago (ORD-002). I can see 6 have been delivered, but when will the remaining 4 come? Just checking in. Thanks!', date: '2025-06-11 14:23' },
      { id: 2, isStaff: true, content: 'Hi! Thank you for reaching out. Your order is going great — we\'ve already delivered 6 out of 10 reviews. The remaining 4 will be delivered within the next 2-3 days. We space them out to look natural. No need to worry! 😊', date: '2025-06-11 15:45' },
    ],
  },
  {
    id: 'TKT-002',
    subject: 'Review replacement request for ORD-001',
    status: 'resolved',
    priority: 'high',
    orderId: 'ORD-001',
    date: '2025-06-05',
    messages: [
      { id: 1, isStaff: false, content: 'One of the Google reviews from my order (ORD-001) was removed. According to your guarantee you should replace it. My business URL is the same.', date: '2025-06-05 09:10' },
      { id: 2, isStaff: true, content: 'We\'ve confirmed the removal. A replacement review has been queued and should appear within 48 hours. Thank you for your patience!', date: '2025-06-05 10:30' },
      { id: 3, isStaff: false, content: 'Great, thank you! The review appeared. All good now.', date: '2025-06-07 11:00' },
      { id: 4, isStaff: true, content: 'Wonderful! We\'re closing this ticket as resolved. Don\'t hesitate to reach out if you need anything else. ⭐', date: '2025-06-07 11:15' },
    ],
  },
]

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

export default function TicketsPage() {
  const [view, setView] = useState<'list' | 'detail' | 'new'>('list')
  const [activeTicket, setActiveTicket] = useState<(typeof TICKETS)[0] | null>(null)
  const [replyText, setReplyText] = useState('')
  const [newTicket, setNewTicket] = useState({ subject: '', orderId: '', priority: 'normal', message: '' })
  const [localMessages, setLocalMessages] = useState<{id:number,isStaff:boolean,content:string,date:string}[]>([])

  const handleOpenTicket = (ticket: typeof TICKETS[0]) => {
    setActiveTicket(ticket)
    setLocalMessages(ticket.messages)
    setView('detail')
  }

  const handleSendReply = () => {
    if (!replyText.trim()) return
    const msg = {
      id: localMessages.length + 1,
      isStaff: false,
      content: replyText,
      date: new Date().toLocaleString(),
    }
    setLocalMessages(prev => [...prev, msg])
    setReplyText('')
  }

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Support Tickets</h1>
          <p style={{color:'var(--text-muted)',fontSize:'0.9rem',marginTop:'4px'}}>
            {view === 'list' ? 'Manage your support requests' : view === 'new' ? 'Open a new ticket' : `Ticket ${activeTicket?.id}`}
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
          {TICKETS.length === 0 && (
            <div className="bento-card" style={{textAlign:'center',padding:'60px',color:'var(--text-muted)'}}>
              <div style={{fontSize:'3rem',marginBottom:'16px'}}>🎫</div>
              <h3 style={{marginBottom:'8px'}}>No tickets yet</h3>
              <p>If you have any issues, open a support ticket and we&apos;ll help you out.</p>
            </div>
          )}
          {TICKETS.map(ticket => (
            <div
              key={ticket.id}
              className="ticket-card"
              onClick={() => handleOpenTicket(ticket)}
            >
              <div className="ticket-icon">🎫</div>
              <div className="ticket-content">
                <div className="ticket-subject">{ticket.subject}</div>
                <div className="ticket-meta">
                  <span>{ticket.id}</span>
                  {ticket.orderId && <span>Order: {ticket.orderId}</span>}
                  <span>{ticket.date}</span>
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
                    {activeTicket.orderId}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {localMessages.map(msg => (
              <div key={msg.id} className={`chat-message ${msg.isStaff ? 'staff' : 'user'}`}>
                <div className="chat-avatar">
                  {msg.isStaff ? '🛡️' : 'U'}
                </div>
                <div>
                  <div style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:'4px',textAlign: msg.isStaff ? 'left' : 'right'}}>
                    {msg.isStaff ? 'Support Team' : 'You'} · {msg.date}
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
              <select className="form-input" value={newTicket.orderId}
                onChange={e => setNewTicket({...newTicket, orderId: e.target.value})}>
                <option value="">None</option>
                <option value="ORD-001">ORD-001 — Google USA × 25</option>
                <option value="ORD-002">ORD-002 — Facebook Poland × 10</option>
                <option value="ORD-003">ORD-003 — Google Germany × 50</option>
              </select>
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
              <button className="btn btn-primary" onClick={() => setView('list')}>
                Submit Ticket →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
