import Link from 'next/link'
import { PLATFORMS } from '@/lib/data'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div className="footer-brand-name">Stars<span>Boost</span></div>
            </Link>
            <p className="footer-desc">Real, verified reviews from real accounts. Boost your business reputation with geo-targeted reviews on Google, Facebook, and Trustpilot.</p>
          </div>
          <div>
            <div className="footer-col-title">Services</div>
            <ul className="footer-links">
              {PLATFORMS.map(p => (
                <li key={p.id}><Link href={`/services/${p.id}`}>{p.name}</Link></li>
              ))}
              <li><Link href="/tools/rating-calculator">Rating Calculator</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Account</div>
            <ul className="footer-links">
              <li><Link href="/login">Sign In</Link></li>
              <li><Link href="/register">Register</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/dashboard/orders">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Legal</div>
            <ul className="footer-links">
              <li><Link href="/terms-of-service">Terms of Service</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/refund-policy">Refund Policy</Link></li>
              <li><a href="mailto:support@starsboost.com">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} StarsBoost. All rights reserved.</span>
          <span>🔒 Payments secured by Stripe</span>
        </div>
      </div>
    </footer>
  )
}
