import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StarsBoost — Buy Real Google & Facebook Reviews',
  description: 'Boost your business reputation with real, verified Google Maps and Facebook reviews. Country-targeted reviews from real accounts. 30-day drop protection guaranteed.',
  keywords: 'buy google reviews, buy facebook reviews, real reviews, google maps reviews, business reputation',
  openGraph: {
    title: 'StarsBoost — Buy Real Google & Facebook Reviews',
    description: 'Boost your business reputation with real, verified reviews from real accounts.',
    type: 'website',
  },
}

import Providers from './providers'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" toastOptions={{ className: 'custom-toast' }} />
      </body>
    </html>
  )
}
