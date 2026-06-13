import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

// We force dynamic because it depends on token in url, though Next.js handles it
export default async function ReportPage(props: { params: Promise<{ token: string }> }) {
  const params = await props.params
  
  const report = await prisma.whiteLabelReport.findUnique({
    where: { token: params.token },
    include: {
      order: true
    }
  })

  if (!report || !report.isPublic || !report.order) {
    notFound()
  }

  const { order } = report
  const progressPercent = Math.min(100, Math.round((order.deliveredCount / order.quantity) * 100))

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', // Light minimal background, not tied to our dark theme
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
        padding: '40px',
        width: '100%',
        maxWidth: '600px',
        color: '#334155' // Slate 700
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: '#0f172a' }}>Campaign Progress Report</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Real-time delivery status</p>
        </div>

        <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>TARGET URL</span>
            <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{order.platform}</span>
          </div>
          <div style={{ 
            wordBreak: 'break-all', 
            background: 'white', 
            padding: '12px', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '0.9rem',
            color: '#3b82f6' // Blue
          }}>
            <a href={order.targetUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
              {order.targetUrl}
            </a>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600 }}>Delivery Progress</span>
            <span style={{ fontWeight: 700 }}>{progressPercent}%</span>
          </div>
          
          <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${progressPercent}%`, 
              height: '100%', 
              background: progressPercent === 100 ? '#10b981' : '#3b82f6',
              transition: 'width 1s ease-in-out'
            }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.9rem', color: '#64748b' }}>
            <span>Delivered: {order.deliveredCount}</span>
            <span>Target: {order.quantity}</span>
          </div>
        </div>

        {progressPercent === 100 && (
          <div style={{ marginTop: '32px', textAlign: 'center', background: '#ecfdf5', color: '#059669', padding: '16px', borderRadius: '8px', fontWeight: 600 }}>
            Campaign successfully completed!
          </div>
        )}
        
        {progressPercent < 100 && order.status === 'processing' && (
          <div style={{ marginTop: '32px', textAlign: 'center', background: '#eff6ff', color: '#2563eb', padding: '16px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#2563eb', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
            Campaign is currently active
          </div>
        )}

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.5); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}} />
      </div>
    </div>
  )
}
