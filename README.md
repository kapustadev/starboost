# StarsBoost 🌟

A full-stack SaaS platform for selling real Google, Facebook, and Trustpilot reviews.

## Features

- 🏠 **Landing Page** — Bento-style design with pricing calculator
- 🌍 **20+ Countries** — Country-targeted reviews with geo-based pricing
- 🔐 **Auth** — Google OAuth, Facebook OAuth, email/password (NextAuth.js)
- 📦 **Dashboard** — Orders, statuses, progress tracking
- 🎫 **Support Tickets** — Chat-style ticket system
- 💳 **Billing** — Stripe payments, invoice history
- 👤 **Profile** — Account settings, linked accounts, notifications

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styles | Vanilla CSS (Bento design system) |
| Database | SQLite via Prisma 7 |
| Auth | NextAuth.js (Google + Facebook + Credentials) |
| Payments | Stripe |
| Deploy | Vercel |

## Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/kapustadev/starboost.git
cd starboost
npm install
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env .env.local
```

Required variables:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

FACEBOOK_CLIENT_ID="..."
FACEBOOK_CLIENT_SECRET="..."

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 3. Set Up Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Dev Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploying to Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. For database: use [Vercel Postgres](https://vercel.com/storage/postgres) or [PlanetScale](https://planetscale.com) (change provider to `postgresql` in `prisma/schema.prisma`)
5. Deploy!

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/page.tsx        # Login
│   ├── register/page.tsx     # Registration
│   ├── services/[platform]/  # Service pages (Google, Facebook, Trustpilot)
│   └── dashboard/
│       ├── page.tsx          # Dashboard overview
│       ├── orders/           # Order management
│       ├── tickets/          # Support tickets
│       ├── billing/          # Payment history
│       └── profile/          # Account settings
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── data.ts               # Countries, platforms, pricing
│   ├── prisma.ts             # DB client
│   └── stripe.ts             # Stripe client
└── app/globals.css           # Design system (Bento style)
```

## Countries Supported

🇺🇸 USA · 🇺🇦 Ukraine · 🇵🇱 Poland · 🇬🇧 UK · 🇩🇪 Germany · 🇫🇷 France · 🇮🇹 Italy · 🇪🇸 Spain · 🇳🇱 Netherlands · 🇧🇪 Belgium · 🇦🇹 Austria · 🇨🇭 Switzerland · 🇵🇹 Portugal · 🇸🇪 Sweden · 🇳🇴 Norway · 🇩🇰 Denmark · 🇫🇮 Finland · 🇮🇪 Ireland · 🇨🇿 Czech Republic · 🇸🇰 Slovakia · 🇭🇺 Hungary · 🇷🇴 Romania
