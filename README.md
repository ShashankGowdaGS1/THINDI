# THINDI (ತಿಂಡಿ)

> **Authentic Karnataka Traditional Savouries & Sweets — Originating in Hassan, Karnataka.**

THINDI is a contemporary, high-fashion food e-commerce application built for authentic South Indian savoury and sweet delicacies—including heirloom spiral Chakkali, ring Kodubale, spicy masala Nippattu, festive Obbattu, traditional sun-matured pickles (Uppinakai), and sun-dried Sandige.

---

## 🚀 Technology Stack

- **Framework**: [Next.js 16.4.4](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Typography**: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque), [DM Sans](https://fonts.google.com/specimen/DM+Sans), and [Anek Kannada](https://fonts.google.com/specimen/Anek+Kannada)
- **Validation**: [Zod 4](https://zod.dev/)
- **Animation**: [GSAP 3](https://gsap.com/) & Lucide React Icons
- **Database Architecture**: Supabase SQL migrations (`supabase/migrations/`) with in-memory stores for zero-dependency offline simulation and instant deterministic testing

---

## 📦 Project Structure

```
├── public/                 # Static assets (high-resolution product & heritage photography)
│   └── images/             # Product photography, category covers, and story imagery
├── scripts/                # Automated test suites for all 16 development stages
├── src/
│   ├── app/                # Next.js App Router pages and API route handlers
│   │   ├── admin/          # Role-based operations, inventory, batch & staff management
│   │   ├── api/            # Server-authoritative checkout, tracking, and webhook endpoints
│   │   ├── collections/    # Dynamic category collections (kuruk-thindi, sihi-thindi, etc.)
│   │   ├── combos/         # Curated THINDI Boxes gifting showcase
│   │   ├── our-story/      # Long-form editorial heritage magazine
│   │   ├── products/       # Dynamic SSG product detail pages with verified disclosures
│   │   ├── shop/           # Complete searchable & filterable catalogue
│   │   └── track-order/    # Privacy-protected order tracking with 6-digit OTP verification
│   ├── components/         # Domain-driven modular React components
│   ├── context/            # Global shopping basket context (CartContext)
│   ├── data/               # Centralized product catalogue, categories, bundles & policies
│   ├── lib/                # Integer paise pricing engine, Razorpay & Shiprocket adapters, admin auth
│   └── types/              # TypeScript definitions for e-commerce, tracking & administration
└── supabase/
    └── migrations/         # Production-ready PostgreSQL & Row-Level Security (RLS) schemas
```

---

## 🛠️ Local Development

### 1. Installation

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Test Suites

```bash
npm test
```

Executes all 95 tests across 15 test suites covering pricing engines, cryptographic signatures, pincode serviceability, RBAC permissions, and route boundaries.

### 4. Build for Production

```bash
npm run build
```

Generates an optimized production build pre-rendering all 81 static and dynamic routes.

---

## 🌐 Deploy to Vercel

1. **Import the repository** into your [Vercel Dashboard](https://vercel.com/new).
2. **Framework Preset**: Next.js (automatically detected).
3. **Build Command**: `next build` (default).
4. **Output Directory**: `.next` (default).
5. **Environment Variables**:
   Configure the following in the Vercel Project Settings:
   - `NEXT_PUBLIC_SITE_URL`: Your deployed production domain (e.g., `https://thindi.in` or Vercel deployment URL).
   - `RAZORPAY_KEY_ID`: *(Optional)* Your Razorpay Key ID (runs in demo simulation if left empty).
   - `RAZORPAY_KEY_SECRET`: *(Optional)* Your Razorpay Key Secret.
   - `RAZORPAY_WEBHOOK_SECRET`: *(Optional)* Secret for verifying incoming Razorpay webhooks.
   - `SHIPROCKET_API_TOKEN`: *(Optional)* Shiprocket bearer token for live tracking.
   - `ADMIN_SESSION_SECRET`: Cryptographically strong random key for admin session signing.
   - `ORDER_SESSION_SECRET`: Cryptographically strong random key for customer OTP token signing.

---

## 🔒 Security & Data Integrity

- **Deterministic Integer Paise Calculations**: All product prices and shipping charges are calculated strictly on the server in integer paise (1 INR = 100 paise) to prevent floating-point discrepancies or client tampering.
- **Privacy-Protected Order Lookup**: Order details and addresses require either a checkout access token or a verified email OTP.
- **Constant-Time Verification**: Admin and tracking tokens use `crypto.timingSafeEqual` to guard against timing attacks.

---

## 📜 License & Copyright

© 2026 **THINDI Foods**. All rights reserved. Handcrafted in Hassan, Karnataka.
