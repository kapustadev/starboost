import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getBlogPosts } from '@/lib/mdx'
import { Metadata } from 'next'
import { format } from 'date-fns'

export const metadata: Metadata = {
  title: 'Blog | StarsBoost',
  description: 'Read the latest articles about online reputation, local SEO, and strategies to grow your business.',
}

export default function BlogIndex() {
  const posts = getBlogPosts()

  return (
    <>
      <Navbar />
      <main className="section" style={{ paddingTop: '120px', minHeight: 'calc(100vh - 300px)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
            <span className="section-eyebrow">Resources</span>
            <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>StarsBoost Blog</h1>
            <p>Insights on building a 5-star reputation and dominating local search.</p>
          </div>

          <div className="bento-grid bento-grid-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="bento-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '12px', fontWeight: 600 }}>
                  {format(new Date(post.date), 'MMMM d, yyyy')}
                </div>
                <h3 style={{ marginBottom: '12px', fontSize: '1.4rem' }}>{post.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '24px', flex: 1 }}>
                  {post.description}
                </p>
                <div style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Read Article <span style={{ fontSize: '1.2rem' }}>→</span>
                </div>
              </Link>
            ))}
          </div>
          
          {posts.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              <p>No articles found.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
