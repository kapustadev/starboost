'use client'

import { useState } from 'react'
import Link from 'next/link'

const ORDERS = [
  { id: 'ORD-001', platform: 'Google', country: '🇺🇸 USA', qty: 25, price: 250, status: 'completed', delivered: 25, date: '2025-06-08', url: 'https://maps.google.com/?cid=12345', businessName: 'The Coffee House NYC' },
  { id: 'ORD-002', platform: 'Facebook', country: '🇵🇱 Poland', qty: 10, price: 60, status: 'processing', delivered: 6, date: '2025-06-10', url: 'https://fb.com/mypage', businessName: 'Salon Urody Kasia' },
  { id: 'ORD-003', platform: 'Google', country: '🇩🇪 Germany', qty: 50, price: 525, status: 'pending', delivered: 0, date: '2025-06-12', url: 'https://maps.google.com/?cid=99999', businessName: 'Bäckerei Müller' },
  { id: 'ORD-004', platform: 'Trustpilot', country: '🇬🇧 UK', qty: 10, price: 165, status: 'completed', delivered: 10, date: '2025-05-28', url: 'https://trustpilot.com/review/mysite.com', businessName: 'TechStore UK' },
  { id: 'ORD-005', platform: 'Google', country: '🇺🇦 Ukraine', qty: 15, price: 90, status: 'cancelled', delivered: 0, date: '2025-05-15', url: '', businessName: 'Кав\'ярня Ранок' },
]

const STATUS_STYLES: Record<string, string> = {
  completed: 'badge-green',
  processing: 'badge-blue',
  pending: 'badge-yellow',
  partial: 'badge-yellow',
  cancelled: 'badge-red',
}

export default function OrdersPage() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = filter === 'all' ? ORDERS : ORDERS.filter(o => o.status === filter)
  const order = ORDERS.find(o => o.id === selected)

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>My Orders</h1>
          <p style={{color:'var(--text-muted)',fontSize:'0.9rem',marginTop:'4px'}}>Track all your review orders</p>
        </div>
        <Link href="/services/google" className="btn btn-primary">+ New Order</Link>
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:'8px',marginBottom:'20px',flexWrap:'wrap'}}>
        {['all','pending','processing','completed','cancelled'].map(f => (
          <button
            key={f}
            className={`package-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
            style={{textTransform:'capitalize'}}
          >
            {f === 'all' ? `All (${ORDERS.length})` : `${f} (${ORDERS.filter(o=>o.status===f).length})`}
          </button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns: selected ? '1fr 380px' : '1fr',gap:'20px'}}>
        {/* Orders Table */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Business</th>
                <th>Platform</th>
                <th>Country</th>
                <th>Progress</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr
                  key={o.id}
                  style={{cursor:'pointer'}}
                  onClick={() => setSelected(selected === o.id ? null : o.id)}
                >
                  <td><span style={{fontWeight:600,color:'var(--accent)'}}>{o.id}</span></td>
                  <td style={{maxWidth:'160px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {o.businessName}
                  </td>
                  <td>{o.platform}</td>
                  <td style={{whiteSpace:'nowrap'}}>{o.country}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',minWidth:'100px'}}>
                      <div className="progress-bar" style={{flex:1}}>
                        <div
                          className={`progress-fill ${o.status==='completed'?'green':''}`}
                          style={{width:`${Math.round((o.delivered/o.qty)*100)}%`}}
                        />
                      </div>
                      <span style={{fontSize:'0.78rem',color:'var(--text-muted)',whiteSpace:'nowrap'}}>
                        {o.delivered}/{o.qty}
                      </span>
                    </div>
                  </td>
                  <td><strong>${o.price}</strong></td>
                  <td style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>{o.date}</td>
                  <td>
                    <span className={`badge ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>
              No orders found
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && order && (
          <div className="bento-card" style={{height:'fit-content'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
              <h3 style={{fontSize:'1rem'}}>{order.id}</h3>
              <button onClick={() => setSelected(null)} className="modal-close">✕</button>
            </div>

            <span className={`badge ${STATUS_STYLES[order.status]}`} style={{marginBottom:'20px',display:'inline-block'}}>
              {order.status}
            </span>

            <div style={{display:'flex',flexDirection:'column',gap:'14px',fontSize:'0.88rem'}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{color:'var(--text-muted)'}}>Business</span>
                <span style={{fontWeight:600,textAlign:'right',maxWidth:'180px'}}>{order.businessName}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{color:'var(--text-muted)'}}>Platform</span>
                <span style={{fontWeight:600}}>{order.platform}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{color:'var(--text-muted)'}}>Country</span>
                <span style={{fontWeight:600}}>{order.country}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{color:'var(--text-muted)'}}>Ordered</span>
                <span style={{fontWeight:600}}>{order.qty} reviews</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{color:'var(--text-muted)'}}>Delivered</span>
                <span style={{fontWeight:600,color:'var(--green)'}}>{order.delivered} reviews</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{color:'var(--text-muted)'}}>Total Paid</span>
                <span style={{fontWeight:800,fontSize:'1rem'}}>${order.price}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{color:'var(--text-muted)'}}>Ordered On</span>
                <span>{order.date}</span>
              </div>
            </div>

            <div style={{margin:'20px 0',height:'1px',background:'var(--border)'}}/>

            <div style={{marginBottom:'16px'}}>
              <div style={{fontSize:'0.78rem',color:'var(--text-muted)',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.06em'}}>
                Delivery Progress
              </div>
              <div className="progress-bar" style={{height:'10px',marginBottom:'8px'}}>
                <div
                  className={`progress-fill ${order.status==='completed'?'green':''}`}
                  style={{width:`${Math.round((order.delivered/order.qty)*100)}%`}}
                />
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.82rem',color:'var(--text-muted)'}}>
                <span>{order.delivered} delivered</span>
                <span>{Math.round((order.delivered/order.qty)*100)}%</span>
              </div>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              <Link href={`/dashboard/tickets/new?order=${order.id}`} className="btn btn-secondary btn-full btn-sm" style={{justifyContent:'center'}}>
                🎫 Open Support Ticket
              </Link>
              <button className="btn btn-ghost btn-full btn-sm" style={{justifyContent:'center'}}>
                📄 Download Invoice
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
