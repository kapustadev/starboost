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

export default async function BlogIndex(props: { searchParams: Promise<{ tag?: string }> }) {
  const searchParams = await props.searchParams
  const tagFilter = searchParams.tag
  const allPosts = getBlogPosts()
  
  // Extract unique tags
  const allTags = Array.from(new Set(allPosts.flatMap(post => post.tags || []))).sort()

  const posts = tagFilter 
    ? allPosts.filter(post => post.tags?.includes(tagFilter))
    : allPosts

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

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <Link 
              href="/blog" 
              style={{ 
                padding: '8px 16px', 
                borderRadius: '20px', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                textDecoration: 'none',
                background: !tagFilter ? 'var(--accent)' : 'var(--bg-card)',
                color: !tagFilter ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
                transition: 'all 0.2s'
              }}
            >
              All
            </Link>
            {allTags.map(tag => (
              <Link 
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`} 
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '20px', 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  textDecoration: 'none',
                  background: tagFilter === tag ? 'var(--accent)' : 'var(--bg-card)',
                  color: tagFilter === tag ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  transition: 'all 0.2s'
                }}
              >
                {tag}
              </Link>
            ))}
          </div>

          <div className="bento-grid bento-grid-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="bento-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {post.tags.map(tag => (
                        <span key={tag} className="badge badge-accent" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
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
