'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { toast } from 'react-hot-toast'

export function ProfileClient({ initialProfile }: { initialProfile: any }) {
  const [profile, setProfile] = useState(initialProfile)
  const [isPending, startTransition] = useTransition()

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    startTransition(async () => {
      const res = await updateProfile(profile)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Profile updated successfully!')
      }
    })
  }

  const handleToggle = (key: string) => {
    const updatedProfile = { ...profile, [key]: !profile[key] }
    setProfile(updatedProfile)
    
    // Auto-save toggle changes
    startTransition(async () => {
      await updateProfile(updatedProfile)
      toast.success('Preferences updated')
    })
  }

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Profile Settings</h1>
          <p style={{color:'var(--text-muted)',fontSize:'0.9rem',marginTop:'4px'}}>Manage your account details</p>
        </div>
      </div>

      <div className="bento-grid bento-grid-2" style={{ alignItems: 'start' }}>
        {/* Personal Info */}
        <div className="bento-card">
          <h3 style={{marginBottom:'24px'}}>Personal Information</h3>
          <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}/>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={profile.email} disabled
                onChange={e => setProfile({...profile, email: e.target.value})}/>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="tel" className="form-input" value={profile.phone}
                onChange={e => setProfile({...profile, phone: e.target.value})}/>
            </div>
            <div className="form-group">
              <label className="form-label">Company / Business Name</label>
              <input type="text" className="form-input" value={profile.company}
                onChange={e => setProfile({...profile, company: e.target.value})}/>
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <select className="form-input" value={profile.country}
                onChange={e => setProfile({...profile, country: e.target.value})}>
                <option value="us">🇺🇸 United States</option>
                <option value="ua">🇺🇦 Ukraine</option>
                <option value="pl">🇵🇱 Poland</option>
                <option value="gb">🇬🇧 United Kingdom</option>
                <option value="de">🇩🇪 Germany</option>
                <option value="fr">🇫🇷 France</option>
                <option value="it">🇮🇹 Italy</option>
                <option value="es">🇪🇸 Spain</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{marginTop:'4px'}} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
          {/* Notifications */}
          <div className="bento-card">
            <h3 style={{marginBottom:'20px'}}>Notifications</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive emails for account activity' },
                { key: 'orderUpdates', label: 'Order Updates', desc: 'Updates on order delivery progress' },
                { key: 'ticketReplies', label: 'Ticket Replies', desc: 'When support team replies to your tickets' },
                { key: 'marketing', label: 'Marketing Emails', desc: 'Promotions and special offers' },
              ].map(n => (
                <div key={n.key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px'}}>
                  <div>
                    <div style={{fontWeight:500,fontSize:'0.9rem'}}>{n.label}</div>
                    <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{n.desc}</div>
                  </div>
                  <button
                    onClick={() => handleToggle(n.key)}
                    style={{
                      width:'44px',height:'24px',
                      borderRadius:'12px',
                      border:'none',
                      background: profile[n.key] ? 'var(--accent)' : 'var(--bg-secondary)',
                      position:'relative',
                      cursor:'pointer',
                      flexShrink:0,
                      transition:'background 0.2s',
                    }}
                  >
                    <span style={{
                      position:'absolute',
                      top:'2px',
                      left: profile[n.key] ? '22px' : '2px',
                      width:'20px',height:'20px',
                      borderRadius:'50%',
                      background:'#fff',
                      transition:'left 0.2s',
                      display:'block',
                    }}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
