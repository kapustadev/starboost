import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getBlogPost, getBlogPosts } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { format } from 'date-fns'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Not Found' }

  return {
    title: `${post.title} | StarsBoost Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export async function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Custom components for MDX
const mdxComponents = {
  h1: (props: any) => <h1 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '2.2rem' }} {...props} />,
  h2: (props: any) => <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.8rem', color: 'var(--accent)' }} {...props} />,
  h3: (props: any) => <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.4rem' }} {...props} />,
  p: (props: any) => <p style={{ marginBottom: '1.2rem', lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--text-secondary)' }} {...props} />,
  ul: (props: any) => <ul style={{ marginBottom: '1.2rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }} {...props} />,
  li: (props: any) => <li style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }} {...props} />,
  a: (props: any) => <a style={{ color: 'var(--accent)', textDecoration: 'underline' }} {...props} />,
  strong: (props: any) => <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }} {...props} />,
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  // Schema.org JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'StarsBoost',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main style={{ paddingTop: '120px', minHeight: 'calc(100vh - 300px)', paddingBottom: '80px' }}>
        <article className="container" style={{ maxWidth: '800px' }}>
          
          {/* Breadcrumbs */}
          <div style={{ marginBottom: '30px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <Link href="/blog" style={{ color: 'var(--text-secondary)' }}>Blog</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text-primary)' }}>{post.title}</span>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '16px' }}>
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '24px' }}>{post.title}</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {post.description}
            </p>
          </div>

          <div style={{ height: '1px', background: 'var(--border)', marginBottom: '40px' }} />

          <div className="mdx-content">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
          
        </article>
      </main>
      <Footer />
    </>
  )
}
