# 🌿 Herbal Communities

A wellness and herbal product platform built with Next.js 15, Tailwind CSS, Stripe, and Neon Postgres.

### 🚀 Deployment
1. Push this repo to GitHub.
2. Connect Render → Create Web Service.
3. Add environment variables from `.env`.
4. Build command: `npm install && npx prisma generate && npm run build`
5. Start command: `npm start`.

### 💳 Stripe Sync
All products and tours displayed on the site are fetched live from Stripe Products.  
Add a new Product in your Stripe Dashboard → it automatically appears on the site.

### 🧰 Stack
- Next.js 15 (App Router)
- Tailwind CSS
- Prisma ORM + Neon Postgres
- Stripe API
