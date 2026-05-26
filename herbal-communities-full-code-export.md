# Herbal Communities Full Project Code Export
Copy each section into the matching file path.

## 1. `package.json`

```json
{
  "name": "herbal-communities",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate"
  },
  "dependencies": {
    "@clerk/nextjs": "^6.0.0",
    "@prisma/client": "^5.22.0",
    "@react-email/components": "^0.0.22",
    "autoprefixer": "^10.4.14",
    "clsx": "^2.1.1",
    "lucide-react": "^0.452.0",
    "next": "15.5.6",
    "postcss": "^8.4.21",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "resend": "^4.0.0",
    "stripe": "^17.4.0",
    "tailwind-merge": "^2.5.4",
    "tailwindcss": "^3.3.5"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "prisma": "^5.22.0",
    "typescript": "^5"
  }
}

```

## 2. `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "files.stripe.com" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;

```

## 3. `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jungle: {
          50:  "#f0f7f1",
          100: "#d8edd9",
          200: "#b3dab6",
          300: "#7fbf84",
          400: "#4a9e52",
          500: "#2d7d35",
          600: "#1f6128",
          700: "#1a4d21",
          800: "#163d1c",
          900: "#0f2913",
          950: "#071510",
        },
        terra: {
          100: "#f5e6d3",
          200: "#e8c9a0",
          300: "#d4a56a",
          400: "#c08040",
          500: "#a8622a",
          600: "#8a4a1e",
          700: "#6b3615",
        },
        bark: {
          700: "#3d2a15",
          800: "#241808",
          900: "#120c03",
        },
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ['"Playfair Display"', "Georgia", "serif"],
      },
      backgroundImage: {
        "jungle-gradient": "linear-gradient(135deg,#071510 0%,#0f2913 50%,#1a4d21 100%)",
      },
      animation: {
        marquee:    "marquee 25s linear infinite",
        "fade-up":  "fadeUp 0.6s ease forwards",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

```

## 4. `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

## 5. `postcss.config.js`

```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };

```

## 6. `middleware.ts`

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtected = createRouteMatcher(["/dashboard(.*)", "/checkout(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

```

## 7. `next-env.d.ts`

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
// NOTE: This file should not be edited

```

## 8. `.env.local.example`

```bash
# ─── Database (Neon) ──────────────────────────────────────────
# Get from: console.neon.tech → your project → Connection string
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/herbal-communities?sslmode=require"

# ─── Clerk Auth ───────────────────────────────────────────────
# Get from: dashboard.clerk.com → your app → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# ─── Stripe ───────────────────────────────────────────────────
# Get from: dashboard.stripe.com → Developers → API Keys
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
# Get from: dashboard.stripe.com → Developers → Webhooks
STRIPE_WEBHOOK_SECRET=whsec_xxx

# ─── Resend (Email) ───────────────────────────────────────────
# Get from: resend.com → API Keys
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=orders@yourdomain.com

# ─── App ──────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ─── Admin ────────────────────────────────────────────────────
# Set this AFTER first login: copy your Clerk user ID from
# dashboard.clerk.com → Users → click your user → User ID
ADMIN_CLERK_USER_ID=user_xxx

```

## 9. `.gitignore`

```gitignore
node_modules
.next
.env
.env.local
.vercel
dist
build
*.log
.DS_Store

```

## 10. `README.md`

```md
# Herbal Communities

Full-stack Next.js e-commerce and retreat booking site for Herbal Communities.

---

## Tech Stack

| Layer       | Tool                  |
|-------------|-----------------------|
| Framework   | Next.js 15.5.6 (App Router) |
| Language    | TypeScript            |
| Styling     | Tailwind CSS 3.3.5    |
| Auth        | Clerk                 |
| Database    | Neon (Postgres)       |
| ORM         | Prisma                |
| Payments    | Stripe                |
| Email       | Resend                |
| Hosting     | Render                |
| Domain      | Namecheap             |
| Code        | GitHub                |

---

## Platform Setup Guide

### 1. GitHub

1. Create a new repo at github.com — name it `herbal-communities`
2. In your project folder, run:
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/herbal-communities.git
git push -u origin main
```

---

### 2. Neon (Database)

1. Go to console.neon.tech and create a free account
2. Create a new project — name it `herbal-communities`
3. Copy the **Connection string** (it looks like `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`)
4. Save it — you'll add it as `DATABASE_URL` in your environment variables

---

### 3. Clerk (Auth)

1. Go to dashboard.clerk.com and create a free account
2. Create a new application — name it `Herbal Communities`
3. Choose **Email** and **Google** as sign-in methods
4. Go to **API Keys** and copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
5. After you first log in to the live site, go to **Users** in the Clerk dashboard, click your account, copy the **User ID**, and set it as `ADMIN_CLERK_USER_ID` in your environment variables

---

### 4. Stripe (Payments)

1. Go to dashboard.stripe.com and create/log in to your account
2. Go to **Developers → API Keys** and copy:
   - `STRIPE_SECRET_KEY` (starts with `sk_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with `pk_`)
3. For webhooks (after deploying to Render):
   - Go to **Developers → Webhooks → Add endpoint**
   - Set URL to: `https://your-render-domain.onrender.com/api/webhook`
   - Select event: `checkout.session.completed`
   - Copy the **Signing secret** → set as `STRIPE_WEBHOOK_SECRET`

> Note: Stripe is used for payment processing only. All products, retreats, pricing, and inventory are managed in the Admin Dashboard backed by Neon/Postgres.

---

### 5. Resend (Email)

1. Go to resend.com and create a free account
2. Go to **API Keys** and create a new key
3. Copy it → set as `RESEND_API_KEY`
4. Go to **Domains** and add your domain from Namecheap
5. Follow the DNS verification steps (add TXT and MX records in Namecheap)
6. Set `RESEND_FROM_EMAIL` to `orders@yourdomain.com`

---

### 6. Render (Hosting)

1. Go to render.com and create a free account
2. Connect your GitHub account
3. Click **New → Web Service**
4. Select your `herbal-communities` repo
5. Configure:
   - **Name**: herbal-communities
   - **Branch**: main
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push && npm run build`
   - **Start Command**: `npm start`
6. Add all environment variables (see list below)
7. Click **Create Web Service**
8. Copy the URL Render gives you (e.g. `https://herbal-communities.onrender.com`)
9. Set it as `NEXT_PUBLIC_SITE_URL`

---

### 7. Namecheap (Domain)

1. Purchase your domain at namecheap.com
2. Go to **Domain → Advanced DNS**
3. Add CNAME record:
   - Host: `@` (or `www`)
   - Value: your Render URL (e.g. `herbal-communities.onrender.com`)
   - TTL: Automatic
4. In Render → your service → **Settings → Custom Domains** → add your domain
5. Render will provide SSL automatically

---

## Environment Variables

Create a `.env.local` file (copy from `.env.local.example`):

```env
# Neon
DATABASE_URL="postgresql://..."

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Resend
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=orders@yourdomain.com

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin (set after first login)
ADMIN_CLERK_USER_ID=user_xxx
```

---

## Local Development

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Run dev server
npm run dev
```

Open http://localhost:3000

---

## First Time Setup After Deploy

1. Visit your live site and **sign up** for an account
2. Go to **Clerk Dashboard → Users**, find your user, copy the **User ID**
3. Add it as `ADMIN_CLERK_USER_ID` in your Render environment variables
4. Redeploy (Render auto-redeploys on env var changes)
5. Visit `/dashboard/admin` — you now have full admin access
6. Start adding products, retreats, and banners from the admin dashboard

---

## Admin Dashboard

URL: `/dashboard/admin`

| Feature               | Description                                         |
|-----------------------|-----------------------------------------------------|
| Products              | Add/edit/delete retail and wholesale products       |
| Retreats              | Add/edit/delete retreat packages                    |
| Wholesale Apps        | Review, approve, or reject wholesale applications   |
| Clearance Banner      | Create and manage scrolling announcement banners    |

---

## How Products Work

- All products are created in the **Admin Dashboard** (not Stripe)
- Each product can have multiple **variants** (4oz, 8oz, 1 LB, etc.)
- When a customer clicks "Buy Now", a Stripe Checkout session is created dynamically using the variant price
- Stripe fires a webhook on success → order saved to DB → confirmation email sent via Resend

---

## Wholesale Flow

1. Client visits `/wholesale` and fills out inquiry form
2. Admin sees application in `/dashboard/admin/wholesale`
3. Admin clicks **Approve Access** → client role updated to WHOLESALE → approval email sent via Resend
4. Client visits `/dashboard/wholesale` → full honey catalog unlocked
5. Client clicks **Inquire** → directed to Instagram/Facebook to place order

---

## Pages

| Route                        | Description                    |
|------------------------------|--------------------------------|
| `/`                          | Homepage                       |
| `/products`                  | All retail products + filters  |
| `/products/[slug]`           | Single product page            |
| `/retreats`                  | Retreat listings               |
| `/wholesale`                 | Wholesale inquiry + lock preview |
| `/about`                     | About page                     |
| `/reviews`                   | Customer reviews               |
| `/success`                   | Post-purchase success          |
| `/sign-in`                   | Clerk sign in                  |
| `/sign-up`                   | Clerk sign up                  |
| `/dashboard/wholesale`       | Approved wholesale client view |
| `/dashboard/admin`           | Admin overview                 |
| `/dashboard/admin/products`  | Manage products                |
| `/dashboard/admin/retreats`  | Manage retreats                |
| `/dashboard/admin/wholesale` | Review wholesale applications  |
| `/dashboard/admin/banner`    | Manage clearance banner        |

```

## 11. `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String?
  role      Role     @default(RETAIL)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  wholesaleApplication WholesaleApplication?
  orders               Order[]
}

enum Role {
  ADMIN
  WHOLESALE
  RETAIL
}

model Product {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String?     @db.Text
  sku         String?     @unique
  category    String
  subcategory String?
  type        ProductType @default(RETAIL)
  images      String[]
  active      Boolean     @default(true)
  featured    Boolean     @default(false)
  metadata    Json?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  variants   ProductVariant[]
  orderItems OrderItem[]
}

enum ProductType {
  RETAIL
  WHOLESALE
  BOTH
}

model ProductVariant {
  id            String   @id @default(cuid())
  productId     String
  label         String
  price         Float
  compareAt     Float?
  sku           String?
  qty           Int      @default(0)
  inStock       Boolean  @default(true)
  stripePriceId String?
  metadata      Json?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  product    Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  orderItems OrderItem[]
}

model Retreat {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?   @db.Text
  location    String?
  country     String?
  duration    String?
  price       Float
  spots       Int       @default(0)
  spotsLeft   Int       @default(0)
  inStock     Boolean   @default(true)
  images      String[]
  featured    Boolean   @default(false)
  startDate   DateTime?
  endDate     DateTime?
  includes    String[]
  metadata    Json?
  active      Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  orderItems OrderItem[]
}

model WholesaleApplication {
  id        String            @id @default(cuid())
  userId    String?           @unique
  name      String
  business  String
  email     String
  phone     String
  message   String?           @db.Text
  status    ApplicationStatus @default(PENDING)
  adminNote String?
  createdAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt

  user User? @relation(fields: [userId], references: [id])
}

enum ApplicationStatus {
  PENDING
  APPROVED
  REJECTED
}

model Banner {
  id        String   @id @default(cuid())
  text      String
  active    Boolean  @default(true)
  color     String   @default("#c89f4f")
  bgColor   String   @default("#1a3a22")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Order {
  id              String      @id @default(cuid())
  userId          String?
  stripeSessionId String?     @unique
  status          OrderStatus @default(PENDING)
  total           Float
  currency        String      @default("usd")
  email           String?
  metadata        Json?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  user  User?       @relation(fields: [userId], references: [id])
  items OrderItem[]
}

enum OrderStatus {
  PENDING
  PAID
  FULFILLED
  CANCELLED
  REFUNDED
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  productId String?
  variantId String?
  retreatId String?
  name      String
  price     Float
  qty       Int      @default(1)
  image     String?

  order   Order           @relation(fields: [orderId], references: [id])
  product Product?        @relation(fields: [productId], references: [id])
  variant ProductVariant? @relation(fields: [variantId], references: [id])
  retreat Retreat?        @relation(fields: [retreatId], references: [id])
}

```

## 12. `lib/db.ts`

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

```

## 13. `lib/stripe.ts`

```ts
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

```

## 14. `lib/resend.ts`

```ts
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "orders@herbalcommunities.com";

```

## 15. `lib/auth.ts`

```ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { Role } from "@prisma/client";

export async function isAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;
    if (userId === process.env.ADMIN_CLERK_USER_ID) return true;
    const user = await db.user.findUnique({ where: { clerkId: userId } });
    return user?.role === Role.ADMIN;
  } catch {
    return false;
  }
}

export async function getCurrentDbUser() {
  try {
    const { userId } = await auth();
    if (!userId) return null;
    return await db.user.findUnique({ where: { clerkId: userId } });
  } catch {
    return null;
  }
}

export async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;
  const isAdminUser = clerkUser.id === process.env.ADMIN_CLERK_USER_ID;
  return await db.user.upsert({
    where: { clerkId: clerkUser.id },
    update: { name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() },
    create: {
      clerkId: clerkUser.id,
      email,
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
      role: isAdminUser ? Role.ADMIN : Role.RETAIL,
    },
  });
}

```

## 16. `lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const PRODUCT_CATEGORIES = [
  { value: "herbs",      label: "Herbs & Botanicals" },
  { value: "seamoss",    label: "Sea Moss" },
  { value: "honey",      label: "Rare Honeys" },
  { value: "oils",       label: "Oils" },
  { value: "mushrooms",  label: "Mushrooms" },
  { value: "hairskin",   label: "Hair & Skin Care" },
  { value: "packages",   label: "Herbal Packages" },
  { value: "foods",      label: "Foods & Superfoods" },
  { value: "duckflower", label: "Duck Flower" },
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  herbs:      "Herbs & Botanicals",
  seamoss:    "Sea Moss",
  honey:      "Rare Honeys",
  oils:       "Oils",
  mushrooms:  "Mushrooms",
  hairskin:   "Hair & Skin Care",
  packages:   "Herbal Package",
  foods:      "Foods & Superfoods",
  duckflower: "Duck Flower",
};

export const CATEGORY_ICONS: Record<string, string> = {
  herbs:      "🌿",
  seamoss:    "🌊",
  honey:      "🍯",
  oils:       "🫙",
  mushrooms:  "🍄",
  hairskin:   "✨",
  packages:   "📦",
  foods:      "🥥",
  duckflower: "🌺",
};

```

## 17. `emails/OrderConfirmation.tsx`

```tsx
import {
  Html, Head, Body, Container, Section,
  Text, Heading, Hr, Row, Column, Img,
} from "@react-email/components";

type OrderItem = { name: string; price: number; qty: number; image?: string };

type Props = {
  customerName: string;
  orderId: string;
  items: OrderItem[];
  total: number;
};

export default function OrderConfirmation({ customerName, orderId, items, total }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#071510", fontFamily: "Inter, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            <Text style={{ color: "#4a9e52", fontSize: "12px", fontWeight: "600", letterSpacing: "4px", textTransform: "uppercase", margin: "0 0 8px" }}>
              Herbal Communities
            </Text>
            <Heading style={{ color: "#ffffff", fontSize: "28px", fontWeight: "700", margin: "0" }}>
              Order Confirmed 🌿
            </Heading>
          </Section>

          <Section style={{ backgroundColor: "#0f2913", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #1f6128" }}>
            <Text style={{ color: "#7fbf84", fontSize: "14px", margin: "0 0 16px" }}>
              Hi {customerName}, thank you for your order!
            </Text>
            <Text style={{ color: "#9ca3af", fontSize: "12px", margin: "0" }}>
              Order ID: <span style={{ color: "#c89f4f", fontFamily: "monospace" }}>{orderId}</span>
            </Text>
          </Section>

          {items.map((item, i) => (
            <Section key={i} style={{ backgroundColor: "#0f2913", borderRadius: "12px", padding: "16px", marginBottom: "8px", border: "1px solid #163d1c" }}>
              <Row>
                <Column style={{ width: "40px" }}>
                  <Text style={{ fontSize: "24px", margin: "0" }}>🌿</Text>
                </Column>
                <Column style={{ paddingLeft: "12px" }}>
                  <Text style={{ color: "#ffffff", fontSize: "14px", fontWeight: "600", margin: "0" }}>{item.name}</Text>
                  <Text style={{ color: "#9ca3af", fontSize: "12px", margin: "4px 0 0" }}>Qty: {item.qty}</Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={{ color: "#c89f4f", fontSize: "14px", fontWeight: "700", margin: "0" }}>
                    ${item.price.toFixed(2)}
                  </Text>
                </Column>
              </Row>
            </Section>
          ))}

          <Hr style={{ borderColor: "#163d1c", margin: "24px 0" }} />

          <Row>
            <Column><Text style={{ color: "#9ca3af", fontSize: "14px", margin: "0" }}>Total</Text></Column>
            <Column style={{ textAlign: "right" }}>
              <Text style={{ color: "#c89f4f", fontSize: "20px", fontWeight: "700", margin: "0" }}>
                ${total.toFixed(2)}
              </Text>
            </Column>
          </Row>

          <Hr style={{ borderColor: "#163d1c", margin: "24px 0" }} />

          <Text style={{ color: "#6b7280", fontSize: "12px", textAlign: "center", lineHeight: "1.6" }}>
            Questions? Reach us on{" "}
            <a href="https://www.instagram.com/herbcom_" style={{ color: "#4a9e52" }}>Instagram</a>
            {" "}or{" "}
            <a href="https://www.facebook.com/share/1Fry7QcUcm/" style={{ color: "#4a9e52" }}>Facebook</a>.
            <br />
            Sourced from Guatemala · Honduras · Jamaica
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

```

## 18. `emails/WholesaleApproved.tsx`

```tsx
import { Html, Head, Body, Container, Section, Text, Heading, Hr } from "@react-email/components";

type Props = { name: string; businessName: string; siteUrl: string };

export default function WholesaleApproved({ name, businessName, siteUrl }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#071510", fontFamily: "Inter, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            <Text style={{ color: "#4a9e52", fontSize: "12px", fontWeight: "600", letterSpacing: "4px", textTransform: "uppercase", margin: "0 0 8px" }}>
              Herbal Communities
            </Text>
            <Heading style={{ color: "#ffffff", fontSize: "28px", fontWeight: "700", margin: "0" }}>
              Wholesale Access Approved 🍯
            </Heading>
          </Section>

          <Section style={{ backgroundColor: "#0f2913", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #1f6128" }}>
            <Text style={{ color: "#7fbf84", fontSize: "14px", lineHeight: "1.6", margin: "0" }}>
              Hi {name},<br /><br />
              Great news! Your wholesale application for <strong style={{ color: "#ffffff" }}>{businessName}</strong> has been approved.
              You now have full access to our wholesale pricing and bulk ordering portal.
            </Text>
          </Section>

          <Section style={{ backgroundColor: "#1a1200", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #c89f4f33" }}>
            <Text style={{ color: "#c89f4f", fontSize: "14px", fontWeight: "700", margin: "0 0 8px" }}>What you can access:</Text>
            <Text style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.8", margin: "0" }}>
              ✦ Full Melipona stingless bee honey catalog<br />
              ✦ Liter pricing with and without custom labeling<br />
              ✦ Half-liter options available<br />
              ✦ Bulk order discounts
            </Text>
          </Section>

          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            <a
              href={`${siteUrl}/dashboard/wholesale`}
              style={{ backgroundColor: "#1f6128", color: "#ffffff", fontSize: "14px", fontWeight: "700", padding: "14px 32px", borderRadius: "12px", textDecoration: "none", display: "inline-block" }}
            >
              Access Wholesale Dashboard →
            </a>
          </Section>

          <Hr style={{ borderColor: "#163d1c", margin: "24px 0" }} />
          <Text style={{ color: "#6b7280", fontSize: "12px", textAlign: "center" }}>
            Questions? Message us on Instagram or Facebook.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

```

## 19. `emails/WholesaleReceived.tsx`

```tsx
import { Html, Head, Body, Container, Section, Text, Heading, Hr } from "@react-email/components";

type Props = { name: string; businessName: string; email: string; phone: string; message?: string };

export default function WholesaleReceived({ name, businessName, email, phone, message }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#071510", fontFamily: "Inter, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}>
          <Heading style={{ color: "#ffffff", fontSize: "24px", fontWeight: "700", margin: "0 0 24px" }}>
            New Wholesale Application
          </Heading>
          <Section style={{ backgroundColor: "#0f2913", borderRadius: "16px", padding: "24px", border: "1px solid #1f6128" }}>
            <Text style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 8px" }}>Name: <span style={{ color: "#fff" }}>{name}</span></Text>
            <Text style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 8px" }}>Business: <span style={{ color: "#fff" }}>{businessName}</span></Text>
            <Text style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 8px" }}>Email: <span style={{ color: "#fff" }}>{email}</span></Text>
            <Text style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 8px" }}>Phone: <span style={{ color: "#fff" }}>{phone}</span></Text>
            {message && <Text style={{ color: "#9ca3af", fontSize: "13px", margin: "8px 0 0" }}>Message: <span style={{ color: "#fff" }}>{message}</span></Text>}
          </Section>
          <Hr style={{ borderColor: "#163d1c", margin: "24px 0" }} />
          <a
            href={`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/admin/wholesale`}
            style={{ backgroundColor: "#1f6128", color: "#fff", fontSize: "14px", fontWeight: "700", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", display: "inline-block" }}
          >
            Review in Admin Dashboard →
          </a>
        </Container>
      </Body>
    </Html>
  );
}

```

## 20. `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --jungle-950: #071510;
  --jungle-900: #0f2913;
  --jungle-600: #1f6128;
  --jungle-500: #2d7d35;
  --jungle-400: #4a9e52;
  --amber-warm:  #c89f4f;
  --amber-light: #e8c878;
  --terra-500:   #a8622a;
  --bark-800:    #241808;
  --cream:       #fdf6ec;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--jungle-950);
  color: var(--cream);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--jungle-950); }
::-webkit-scrollbar-thumb { background: var(--jungle-600); border-radius: 3px; }

.glass {
  background: rgba(15, 41, 19, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(45,125,53,0.2);
}
.glass-dark {
  background: rgba(7, 21, 16, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(45,125,53,0.15);
}

.gold-shimmer {
  background: linear-gradient(90deg, #c89f4f, #e8c878, #c89f4f);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}
@keyframes shimmer {
  0%   { background-position: 0% center; }
  100% { background-position: 200% center; }
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 25s linear infinite;
}
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.blur-lock { filter: blur(8px); pointer-events: none; user-select: none; }

.product-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.product-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }

.line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.line-clamp-3 { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
.line-clamp-4 { display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden; }

input[type="range"] { -webkit-appearance:none; appearance:none; background:transparent; cursor:pointer; width:100%; }
input[type="range"]::-webkit-slider-track { background:rgba(45,125,53,0.3); height:4px; border-radius:2px; }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance:none; height:16px; width:16px; border-radius:50%; background:#c89f4f; margin-top:-6px; }

```

## 21. `app/layout.tsx`

```tsx
import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClearanceBanner from "@/components/ClearanceBanner";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Herbal Communities — Natural Herbs, Sea Moss & Wellness",
  description:
    "Authentic herbs, stingless bee honey, sea moss, and wellness products sourced directly from Guatemala, Honduras, and Jamaica.",
};

async function getActiveBanner() {
  try {
    return await db.banner.findFirst({ where: { active: true }, orderBy: { updatedAt: "desc" } });
  } catch { return null; }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const banner = await getActiveBanner();
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {banner && (
            <ClearanceBanner text={banner.text} color={banner.color} bgColor={banner.bgColor} />
          )}
          <Header />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

```

## 22. `app/page.tsx`

```tsx
import Link from "next/link";
import { ArrowRight, Leaf, MapPin, Shield, Truck, Star } from "lucide-react";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

async function getFeatured() {
  try {
    return await db.product.findMany({
      where: { active: true, featured: true, type: { in: ["RETAIL", "BOTH"] } },
      include: { variants: true },
      take: 6,
    });
  } catch { return []; }
}

const SOURCING = [
  { country: "Guatemala", flag: "🇬🇹", items: "Stingless Bee Honey, Coffee, Medicinal Herbs, Coconuts" },
  { country: "Honduras",  flag: "🇭🇳", items: "Batana Oil, Sea Moss, Cedar Macho (Swa), Coconut Oil, Soaps" },
  { country: "Jamaica",   flag: "🇯🇲", items: "Purple Sea Moss, Gold Sea Moss, Native Botanicals" },
];

const CATS = [
  { href: "/products?category=herbs",     icon: "🌿", label: "Herbs & Botanicals",  desc: "50+ native medicinal herbs" },
  { href: "/products?category=honey",     icon: "🍯", label: "Rare Honeys",          desc: "Stingless Melipona bee honey" },
  { href: "/products?category=seamoss",   icon: "🌊", label: "Sea Moss",             desc: "Honduran & Jamaican varieties" },
  { href: "/products?category=oils",      icon: "🫙", label: "Oils",                 desc: "Batana, Cedar Macho, Coconut" },
  { href: "/products?category=mushrooms", icon: "🍄", label: "Mushrooms",            desc: "Lions Mane, Chaga, Reishi" },
  { href: "/products?category=packages",  icon: "📦", label: "Herbal Packages",      desc: "Targeted wellness blends" },
];

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-jungle-gradient" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%,#2d7d35 0%,transparent 60%),radial-gradient(ellipse at 70% 80%,#a8622a 0%,transparent 50%)" }} />
        <div className="absolute right-0 top-0 w-[600px] h-[600px] opacity-10" style={{ background: "radial-gradient(circle at center,#4a9e52,transparent 70%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 bg-jungle-900/60 border border-jungle-700/50 text-jungle-300 text-sm font-medium px-4 py-2 rounded-full w-fit">
              <Leaf className="w-4 h-4" />
              Sourced from Central &amp; South America
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight font-display">
              <span className="text-white">Ancient Plants.</span><br />
              <span className="gold-shimmer">Modern Wellness.</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
              We travel deep into Guatemala, Honduras, and Jamaica to bring you authentic medicinal herbs,
              rare stingless bee honey, sea moss, and natural remedies trusted by indigenous communities for generations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="flex items-center gap-2 bg-jungle-600 hover:bg-jungle-500 text-white font-semibold px-7 py-4 rounded-2xl transition shadow-lg shadow-jungle-900/50">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/retreats" className="flex items-center gap-2 border border-amber-warm/40 hover:border-amber-warm text-amber-warm hover:bg-amber-warm/10 font-semibold px-7 py-4 rounded-2xl transition"
                style={{ "--amber-warm": "#c89f4f" } as any}>
                View Retreats
              </Link>
            </div>
            <div className="flex flex-wrap gap-5 pt-4">
              {[
                { icon: <Shield className="w-4 h-4" />, text: "100% Natural" },
                { icon: <MapPin className="w-4 h-4"  />, text: "Direct Sourced" },
                { icon: <Truck className="w-4 h-4"   />, text: "Shipped Nationwide" },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-jungle-400">{t.icon}</span>{t.text}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-jungle-500/10 rounded-3xl blur-2xl" />
              <div className="relative glass rounded-3xl p-8 flex flex-col gap-5">
                <div className="flex items-center gap-3 pb-4 border-b border-jungle-700/40">
                  <div className="w-10 h-10 rounded-full bg-jungle-gradient flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-jungle-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Herbal Communities</p>
                    <p className="text-xs text-jungle-400">Trusted Wellness Partner</p>
                  </div>
                </div>
                {[
                  { e: "🍯", name: "Melipona Stingless Bee Honey", tag: "Extremely Rare",  price: "From $60"  },
                  { e: "🌊", name: "Jamaican Purple Sea Moss",      tag: "Best Seller",     price: "From $25"  },
                  { e: "🫙", name: "Raw Batana Oil",                tag: "From Honduras",   price: "From $30"  },
                  { e: "🌿", name: "Soursop Leaves",                tag: "Medicinal Herb",  price: "From $20"  },
                ].map((i) => (
                  <div key={i.name} className="flex items-center gap-3">
                    <span className="text-2xl">{i.e}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{i.name}</p>
                      <p className="text-xs text-jungle-400">{i.tag}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#c89f4f" }}>{i.price}</span>
                  </div>
                ))}
                <Link href="/products" className="block text-center text-sm font-semibold text-jungle-300 hover:text-white transition pt-2 border-t border-jungle-700/40">
                  View all products →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing */}
      <section className="py-20 px-6 border-t border-jungle-900/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-jungle-400 text-sm font-semibold uppercase tracking-widest mb-3">Our Roots</p>
            <h2 className="text-4xl font-bold text-white font-display">Sourced at the Origin</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">Every product brought directly from the source — no middlemen, no compromise.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SOURCING.map((s) => (
              <div key={s.country} className="glass rounded-2xl p-6 flex flex-col gap-3 border border-jungle-800/40 hover:border-jungle-600/50 transition">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{s.flag}</span>
                  <div>
                    <p className="font-bold text-white text-lg">{s.country}</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-jungle-400" />
                      <span className="text-xs text-jungle-400">Direct sourced</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{s.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6 bg-bark-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-warm text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#c89f4f" }}>Shop by Category</p>
            <h2 className="text-4xl font-bold text-white font-display">What We Offer</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATS.map((c) => (
              <Link key={c.href} href={c.href}
                className="group glass rounded-2xl p-6 flex flex-col gap-3 border border-jungle-900/40 hover:border-jungle-600/60 hover:bg-jungle-900/40 transition">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-200">{c.icon}</span>
                <div>
                  <p className="font-semibold text-white group-hover:text-jungle-300 transition">{c.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-jungle-400 text-sm font-semibold uppercase tracking-widest mb-2">Hand-picked</p>
                <h2 className="text-4xl font-bold text-white font-display">Featured Products</h2>
              </div>
              <Link href="/products" className="text-sm text-jungle-300 hover:text-white font-medium flex items-center gap-1 transition">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Review strip */}
      <section className="py-16 px-6 bg-jungle-gradient border-t border-jungle-800/40">
        <div className="max-w-7xl mx-auto text-center flex flex-col gap-4">
          <div className="flex justify-center gap-1">
            {[1,2,3,4,5].map((i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
          </div>
          <p className="text-xl font-medium text-white max-w-2xl mx-auto font-display">
            "The herbs, sea moss, and Batana oil are unlike anything I've found anywhere else. These are the real thing."
          </p>
          <p className="text-jungle-400 text-sm font-semibold">— Verified Community Member</p>
          <Link href="/reviews" className="mt-2 inline-block text-sm font-semibold hover:underline" style={{ color: "#c89f4f" }}>
            Read all reviews →
          </Link>
        </div>
      </section>

      {/* Wholesale CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-10 text-center flex flex-col items-center gap-6 border" style={{ borderColor: "rgba(200,159,79,0.2)" }}>
            <span className="text-5xl">🍯</span>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 font-display">Wholesale Inquiries</h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                Interested in bulk orders of our rare Melipona stingless bee honey?
                Apply for a wholesale account and get access to liter pricing with or without custom labeling.
              </p>
            </div>
            <Link href="/wholesale" className="flex items-center gap-2 font-semibold px-8 py-4 rounded-2xl transition"
              style={{ background: "linear-gradient(135deg,#c89f4f,#e8c878)", color: "#1a0e00" }}>
              Apply for Wholesale <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

```

## 23. `app/loading.tsx`

```tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-jungle-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-jungle-400 text-sm font-medium">Loading…</p>
      </div>
    </div>
  );
}

```

## 24. `app/not-found.tsx`

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <span className="text-7xl mb-6">🌿</span>
      <h1 className="text-5xl font-bold text-white font-display mb-3">Page Not Found</h1>
      <p className="text-gray-400 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
      <Link href="/" className="bg-jungle-600 hover:bg-jungle-500 text-white font-semibold px-6 py-3 rounded-xl transition">
        Back to Home
      </Link>
    </div>
  );
}

```

## 25. `app/error.tsx`

```tsx
"use client";
export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <span className="text-7xl mb-6">⚠️</span>
      <h1 className="text-4xl font-bold text-red-400 font-display mb-3">Something Went Wrong</h1>
      <p className="text-gray-400 mb-8 max-w-md">{error.message}</p>
      <button onClick={reset} className="bg-jungle-600 hover:bg-jungle-500 text-white font-semibold px-6 py-3 rounded-xl transition">
        Try Again
      </button>
    </div>
  );
}

```

## 26. `components/Header.tsx`

```tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X, Leaf } from "lucide-react";

const NAV = [
  { href: "/",          label: "Home" },
  { href: "/products",  label: "Shop" },
  { href: "/retreats",  label: "Retreats" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/about",     label: "About" },
  { href: "/reviews",   label: "Reviews" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 glass-dark border-b border-jungle-800/50">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-jungle-gradient flex items-center justify-center border border-jungle-600/40">
            <Leaf className="w-5 h-5 text-jungle-300" />
          </div>
          <div className="leading-tight">
            <span className="block text-lg font-bold text-jungle-300 font-display">Herbal</span>
            <span className="block text-[10px] font-semibold tracking-[0.2em] text-amber-warm -mt-0.5 uppercase">Communities</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-jungle-300 hover:bg-jungle-900/50 rounded-lg transition-all">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <SignedOut>
            <Link href="/sign-in" className="text-sm font-medium text-gray-300 hover:text-white transition">Sign In</Link>
            <Link href="/sign-up" className="text-sm font-semibold bg-jungle-600 hover:bg-jungle-500 text-white px-4 py-2 rounded-xl transition">Get Started</Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard/wholesale" className="text-sm text-jungle-300 hover:text-jungle-200 font-medium transition">Dashboard</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass-dark border-t border-jungle-800/50 px-5 pb-5">
          <nav className="flex flex-col gap-1 mt-3">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-jungle-300 hover:bg-jungle-900/50 rounded-xl transition">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 pt-3 border-t border-jungle-800/50 flex flex-col gap-2">
            <SignedOut>
              <Link href="/sign-in" onClick={() => setOpen(false)} className="px-4 py-3 text-sm text-center text-gray-300 hover:text-white rounded-xl hover:bg-jungle-900/50 transition">Sign In</Link>
              <Link href="/sign-up" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-semibold bg-jungle-600 text-white rounded-xl text-center">Get Started</Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard/wholesale" onClick={() => setOpen(false)} className="px-4 py-3 text-sm text-jungle-300 rounded-xl hover:bg-jungle-900/50">Dashboard</Link>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}

```

## 27. `components/Footer.tsx`

```tsx
import Link from "next/link";
import { Leaf, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bark-900 border-t border-jungle-900/80 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-jungle-gradient flex items-center justify-center">
              <Leaf className="w-4 h-4 text-jungle-300" />
            </div>
            <span className="text-white font-bold text-lg font-display">Herbal Communities</span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">
            Authentic herbs, stingless bee honey, sea moss, and wellness products sourced
            directly from Guatemala, Honduras, and Jamaica. Rooted in nature. Built for community.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a href="https://www.facebook.com/share/1Fry7QcUcm/" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-jungle-900 border border-jungle-700/50 flex items-center justify-center hover:bg-jungle-700 transition">
              <Facebook className="w-4 h-4 text-jungle-300" />
            </a>
            <a href="https://www.instagram.com/herbcom_" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-jungle-900 border border-jungle-700/50 flex items-center justify-center hover:bg-jungle-700 transition">
              <Instagram className="w-4 h-4 text-jungle-300" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-1">Shop</h4>
          {[
            ["/products",                   "All Products"],
            ["/products?category=herbs",    "Herbs & Botanicals"],
            ["/products?category=seamoss",  "Sea Moss"],
            ["/products?category=honey",    "Rare Honeys"],
            ["/products?category=oils",     "Oils"],
            ["/retreats",                   "Retreats"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="text-sm hover:text-jungle-300 transition">{label}</Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-1">Company</h4>
          {[
            ["/about",     "About Us"],
            ["/reviews",   "Reviews"],
            ["/wholesale", "Wholesale"],
            ["/sign-in",   "Sign In"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="text-sm hover:text-jungle-300 transition">{label}</Link>
          ))}
        </div>
      </div>
      <div className="border-t border-jungle-900/60 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Herbal Communities. All rights reserved.</p>
          <p>Sourced from Guatemala · Honduras · Jamaica</p>
        </div>
      </div>
    </footer>
  );
}

```

## 28. `components/ClearanceBanner.tsx`

```tsx
"use client";
type Props = { text: string; color?: string; bgColor?: string };

export default function ClearanceBanner({ text, color = "#c89f4f", bgColor = "#1a3a22" }: Props) {
  const repeated = Array(10).fill(text);
  return (
    <div className="overflow-hidden py-2 text-sm font-semibold tracking-wide z-50 relative" style={{ backgroundColor: bgColor, color }}>
      <div className="marquee-track">
        {[...repeated, ...repeated].map((t, i) => (
          <span key={i} className="mx-8 whitespace-nowrap">✦ {t}</span>
        ))}
      </div>
    </div>
  );
}

```

## 29. `components/ProductCard.tsx`

```tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatPrice, CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/utils";

type Variant = { id: string; label: string; price: number; inStock: boolean };
type Props = {
  product: {
    id: string; name: string; slug: string;
    description?: string | null; images: string[];
    category: string; variants: Variant[];
  };
};

const CAT_STYLE: Record<string, string> = {
  herbs:      "bg-jungle-900/60 text-jungle-300 border-jungle-700/40",
  seamoss:    "bg-teal-900/60 text-teal-300 border-teal-700/40",
  honey:      "bg-yellow-900/60 text-yellow-300 border-yellow-700/40",
  oils:       "bg-orange-900/60 text-orange-300 border-orange-700/40",
  mushrooms:  "bg-purple-900/60 text-purple-300 border-purple-700/40",
  hairskin:   "bg-pink-900/60 text-pink-300 border-pink-700/40",
  packages:   "bg-blue-900/60 text-blue-300 border-blue-700/40",
  foods:      "bg-amber-900/60 text-amber-300 border-amber-700/40",
  duckflower: "bg-red-900/60 text-red-300 border-red-700/40",
};

export default function ProductCard({ product }: Props) {
  const lowestPrice = product.variants.length > 0 ? Math.min(...product.variants.map((v) => v.price)) : null;
  const hasInStock   = product.variants.some((v) => v.inStock);
  const image        = product.images[0] || null;
  const catStyle     = CAT_STYLE[product.category] || CAT_STYLE.herbs;
  const catLabel     = CATEGORY_LABELS[product.category] || product.category;
  const catIcon      = CATEGORY_ICONS[product.category] || "🌿";

  return (
    <div className="product-card rounded-2xl overflow-hidden bg-bark-800/60 border border-jungle-900/60 flex flex-col group">
      <Link href={`/products/${product.slug}`} className="block relative w-full h-56 bg-jungle-950 overflow-hidden">
        {image ? (
          <Image src={image} alt={product.name} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:768px) 100vw,33vw" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-jungle-700">
            <span className="text-5xl">{catIcon}</span>
            <span className="text-xs">Photo coming soon</span>
          </div>
        )}
        {!hasInStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-300 bg-black/60 px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${catStyle}`}>{catLabel}</span>
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-white hover:text-jungle-300 transition line-clamp-2 leading-snug">{product.name}</h3>
          </Link>
          {product.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2 border-t border-jungle-900/40">
          <div>
            {lowestPrice !== null
              ? <p className="text-sm font-bold" style={{ color: "#c89f4f" }}>From {formatPrice(lowestPrice)}</p>
              : <p className="text-sm text-gray-500">Price varies</p>
            }
            <p className="text-xs text-gray-500">{product.variants.length} size{product.variants.length !== 1 ? "s" : ""}</p>
          </div>
          <Link href={`/products/${product.slug}`}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition ${
              hasInStock ? "bg-jungle-600 hover:bg-jungle-500 text-white" : "bg-gray-800 text-gray-500 cursor-not-allowed pointer-events-none"
            }`}>
            <ShoppingBag className="w-3.5 h-3.5" />
            {hasInStock ? "View" : "Sold Out"}
          </Link>
        </div>
      </div>
    </div>
  );
}

```

## 30. `components/ProductSidebar.tsx`

```tsx
"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/utils";

export default function ProductSidebar() {
  const router = useRouter();
  const params = useSearchParams();
  const [category, setCategory] = useState(params.get("category") || "");
  const [minPrice, setMinPrice]   = useState(Number(params.get("min")) || 0);
  const [maxPrice, setMaxPrice]   = useState(Number(params.get("max")) || 500);
  const [sort, setSort]           = useState(params.get("sort") || "");
  const [stock, setStock]         = useState(params.get("stock") || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  function apply() {
    const q = new URLSearchParams();
    if (category)    q.set("category", category);
    if (minPrice > 0) q.set("min", String(minPrice));
    if (maxPrice < 500) q.set("max", String(maxPrice));
    if (sort)  q.set("sort", sort);
    if (stock) q.set("stock", stock);
    router.push(`/products?${q.toString()}`);
    setMobileOpen(false);
  }

  function clear() {
    setCategory(""); setMinPrice(0); setMaxPrice(500); setSort(""); setStock("");
    router.push("/products");
    setMobileOpen(false);
  }

  const hasFilters = !!(category || minPrice > 0 || maxPrice < 500 || sort || stock);

  const body = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-jungle-400" />
          <h3 className="font-semibold text-white">Filters</h3>
        </div>
        {hasFilters && (
          <button onClick={clear} className="text-xs text-terra-300 hover:text-terra-200 flex items-center gap-1">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Category</h4>
        <div className="flex flex-col gap-1">
          {[{ value: "", label: "All Products" }, ...PRODUCT_CATEGORIES].map((c) => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition ${category === c.value ? "bg-jungle-700 text-white font-medium" : "text-gray-400 hover:bg-jungle-900/50 hover:text-white"}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Price Range</h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span>${minPrice}</span>
            <span>${maxPrice}{maxPrice === 500 ? "+" : ""}</span>
          </div>
          <input type="range" min={0} max={500} step={5} value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))} />
          <input type="range" min={0} max={500} step={5} value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))} />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Sort By</h4>
        <div className="flex flex-col gap-1">
          {[
            { value: "",           label: "Default"            },
            { value: "az",         label: "A → Z"              },
            { value: "za",         label: "Z → A"              },
            { value: "price-asc",  label: "Price: Low to High" },
            { value: "price-desc", label: "Price: High to Low" },
          ].map((s) => (
            <button key={s.value} onClick={() => setSort(s.value)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition ${sort === s.value ? "bg-jungle-700 text-white font-medium" : "text-gray-400 hover:bg-jungle-900/50 hover:text-white"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Availability</h4>
        <div className="flex flex-col gap-1">
          {[{ value: "", label: "All" }, { value: "instock", label: "In Stock Only" }].map((s) => (
            <button key={s.value} onClick={() => setStock(s.value)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition ${stock === s.value ? "bg-jungle-700 text-white font-medium" : "text-gray-400 hover:bg-jungle-900/50 hover:text-white"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={apply}
        className="w-full bg-jungle-600 hover:bg-jungle-500 text-white font-semibold py-3 rounded-xl transition">
        Apply Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 text-sm font-semibold bg-jungle-900/60 border border-jungle-700/40 text-jungle-300 px-4 py-2.5 rounded-xl">
          <SlidersHorizontal className="w-4 h-4" />
          Filters {hasFilters && <span className="bg-jungle-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">•</span>}
        </button>
        {mobileOpen && (
          <div className="mt-4 p-5 bg-bark-800/80 border border-jungle-900/60 rounded-2xl">{body}</div>
        )}
      </div>
      {/* Desktop */}
      <aside className="hidden lg:block w-60 shrink-0 p-5 bg-bark-800/40 border border-jungle-900/60 rounded-2xl h-fit sticky top-24">
        {body}
      </aside>
    </>
  );
}

```

## 31. `components/CheckoutButton.tsx`

```tsx
"use client";
import { useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";

type Props = { variantId: string; disabled?: boolean };

export default function CheckoutButton({ variantId, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function go() {
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ variantId }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { setError(data.error || "Checkout failed."); setLoading(false); }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={go} disabled={loading || disabled}
        className="flex items-center justify-center gap-2 w-full bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
        {loading ? "Redirecting to Stripe..." : "Buy Now"}
      </button>
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </div>
  );
}

```

## 32. `app/products/page.tsx`

```tsx
import { Suspense } from "react";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import ProductSidebar from "@/components/ProductSidebar";

type SP = { category?: string; min?: string; max?: string; sort?: string; stock?: string };

async function getProducts(params: SP) {
  try {
    const where: any = { active: true, type: { in: ["RETAIL", "BOTH"] } };
    if (params.category) where.category = params.category;
    if (params.stock === "instock") where.variants = { some: { inStock: true } };

    let products = await db.product.findMany({
      where,
      include: { variants: { orderBy: { price: "asc" } } },
    });

    if (params.min || params.max) {
      const min = Number(params.min) || 0;
      const max = Number(params.max) || 500;
      products = products.filter((p) =>
        p.variants.some((v) => v.price >= min && v.price <= max)
      );
    }

    if (params.sort === "az")         products.sort((a, b) => a.name.localeCompare(b.name));
    else if (params.sort === "za")    products.sort((a, b) => b.name.localeCompare(a.name));
    else if (params.sort === "price-asc")
      products.sort((a, b) => Math.min(...a.variants.map((v) => v.price)) - Math.min(...b.variants.map((v) => v.price)));
    else if (params.sort === "price-desc")
      products.sort((a, b) => Math.min(...b.variants.map((v) => v.price)) - Math.min(...a.variants.map((v) => v.price)));

    return products;
  } catch { return []; }
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const params   = await searchParams;
  const products = await getProducts(params);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-jungle-400 text-sm font-semibold uppercase tracking-widest mb-2">Herbal Communities</p>
          <h1 className="text-5xl font-bold text-white font-display">
            {params.category ? params.category.charAt(0).toUpperCase() + params.category.slice(1) : "All Products"}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">{products.length} product{products.length !== 1 ? "s" : ""} found</p>
        </div>

        <div className="flex gap-8">
          <Suspense fallback={null}>
            <ProductSidebar />
          </Suspense>

          <div className="flex-1 min-w-0">
            {products.length === 0 ? (
              <div className="glass rounded-2xl p-16 text-center">
                <span className="text-5xl mb-4 block">🌿</span>
                <p className="text-gray-400 text-lg">No products found.</p>
                <a href="/products" className="inline-block mt-4 text-jungle-300 hover:text-white transition text-sm font-semibold">
                  Clear filters →
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

```

## 33. `app/products/[slug]/page.tsx`

```tsx
"use client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import CheckoutButton from "@/components/CheckoutButton";
import { formatPrice, CATEGORY_LABELS } from "@/lib/utils";

type Variant = { id: string; label: string; price: number; inStock: boolean; qty: number };
type Product = {
  id: string; name: string; slug: string; description: string | null;
  images: string[]; category: string; metadata: any;
  variants: Variant[];
};

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct]     = useState<Product | null>(null);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState<Variant | null>(null);
  const [imgIndex, setImgIndex]   = useState(0);
  const [notFound, setNotFound]   = useState(false);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          const first = data.product.variants.find((v: Variant) => v.inStock) || data.product.variants[0];
          setSelected(first || null);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-jungle-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-2xl font-bold text-white">Product not found</p>
      <Link href="/products" className="text-jungle-300 hover:text-white transition">← Back to Products</Link>
    </div>
  );

  const catLabel = CATEGORY_LABELS[product.category] || product.category;
  const images   = product.images.length > 0 ? product.images : [];

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/products" className="inline-flex items-center gap-2 text-jungle-400 hover:text-jungle-300 text-sm font-medium mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-jungle-950 border border-jungle-900/60">
              {images[imgIndex] ? (
                <Image src={images[imgIndex]} alt={product.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
              ) : (
                <div className="flex items-center justify-center h-full text-6xl text-jungle-700">🌿</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIndex(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition ${imgIndex === i ? "border-jungle-500" : "border-jungle-900/60 opacity-60 hover:opacity-100"}`}>
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-jungle-400">{catLabel}</span>
              <h1 className="text-4xl font-bold text-white mt-2 font-display">{product.name}</h1>
            </div>

            {selected && (
              <p className="text-3xl font-bold" style={{ color: "#c89f4f" }}>{formatPrice(selected.price)}</p>
            )}

            {product.description && (
              <p className="text-gray-300 leading-relaxed text-sm">{product.description}</p>
            )}

            {/* Variant selector */}
            {product.variants.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button key={v.id} onClick={() => v.inStock && setSelected(v)}
                      disabled={!v.inStock}
                      className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                        selected?.id === v.id
                          ? "border-jungle-500 bg-jungle-700 text-white"
                          : v.inStock
                          ? "border-jungle-800/60 text-gray-300 hover:border-jungle-600 hover:text-white"
                          : "border-jungle-900/40 text-gray-600 cursor-not-allowed line-through"
                      }`}>
                      {v.label} — {formatPrice(v.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status */}
            {selected && (
              <div className="flex items-center gap-2">
                {selected.inStock
                  ? <><CheckCircle className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400 text-sm font-medium">In Stock</span></>
                  : <><XCircle className="w-4 h-4 text-red-400" /><span className="text-red-400 text-sm font-medium">Out of Stock</span></>
                }
              </div>
            )}

            {/* Checkout */}
            {selected && (
              <CheckoutButton variantId={selected.id} disabled={!selected.inStock} />
            )}

            {/* Metadata badges */}
            {product.metadata && typeof product.metadata === "object" && Object.keys(product.metadata).length > 0 && (
              <div className="pt-4 border-t border-jungle-900/40">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Details</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(product.metadata as Record<string, string>).map(([k, v]) => (
                    <span key={k} className="text-xs px-3 py-1 rounded-full bg-jungle-900/60 text-jungle-300 border border-jungle-800/40">
                      {k}: {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

```

## 34. `app/retreats/page.tsx`

```tsx
import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

async function getRetreats() {
  try {
    return await db.retreat.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
  } catch { return []; }
}

export default async function RetreatsPage() {
  const retreats = await getRetreats();

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="text-jungle-400 text-sm font-semibold uppercase tracking-widest mb-3">Immersive Experiences</p>
          <h1 className="text-5xl font-bold text-white font-display mb-4">Wellness Retreats</h1>
          <p className="text-gray-400 leading-relaxed">
            Journey into the heart of Central America for healing, nature, plant medicine education,
            and community. Each retreat is a full-body reset rooted in indigenous wisdom.
          </p>
        </div>

        {retreats.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center flex flex-col items-center gap-5 border border-jungle-900/40">
            <span className="text-6xl">🏕️</span>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 font-display">Retreats Coming Soon</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                We're currently planning our next retreat experiences. Follow us on Instagram and Facebook
                to be the first to know when dates are announced.
              </p>
            </div>
            <div className="flex gap-4 mt-2">
              <a href="https://www.instagram.com/herbcom_" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-jungle-700 hover:bg-jungle-600 text-white font-semibold px-5 py-3 rounded-xl transition text-sm">
                📸 Follow on Instagram
              </a>
              <a href="https://www.facebook.com/share/1Fry7QcUcm/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl transition text-sm">
                👍 Follow on Facebook
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {retreats.map((retreat) => (
              <div key={retreat.id} className="product-card glass rounded-3xl overflow-hidden border border-jungle-900/40 flex flex-col">
                {/* Image */}
                <div className="relative w-full h-72 bg-jungle-950">
                  {retreat.images[0] ? (
                    <Image src={retreat.images[0]} alt={retreat.name} fill className="object-cover" sizes="(max-width:1024px) 100vw,50vw" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-6xl text-jungle-800">🏕️</div>
                  )}
                  {!retreat.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-black/70 text-gray-300 font-semibold px-4 py-2 rounded-full text-sm">Fully Booked</span>
                    </div>
                  )}
                  {retreat.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full border" style={{ background: "rgba(200,159,79,0.2)", borderColor: "rgba(200,159,79,0.4)", color: "#c89f4f" }}>
                        ✦ Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-7 flex flex-col gap-5 flex-1">
                  <div>
                    <h2 className="text-2xl font-bold text-white font-display mb-2">{retreat.name}</h2>
                    {retreat.description && (
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{retreat.description}</p>
                    )}
                  </div>

                  {/* Meta badges */}
                  <div className="flex flex-wrap gap-2">
                    {retreat.location && (
                      <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-jungle-900/60 text-jungle-300 border border-jungle-800/40">
                        <MapPin className="w-3 h-3" /> {retreat.location}{retreat.country ? `, ${retreat.country}` : ""}
                      </span>
                    )}
                    {retreat.duration && (
                      <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-jungle-900/60 text-jungle-300 border border-jungle-800/40">
                        <Clock className="w-3 h-3" /> {retreat.duration}
                      </span>
                    )}
                    {retreat.spots > 0 && (
                      <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-jungle-900/60 text-jungle-300 border border-jungle-800/40">
                        <Users className="w-3 h-3" /> {retreat.spotsLeft} spots left
                      </span>
                    )}
                  </div>

                  {/* What's included */}
                  {retreat.includes.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">What's Included</p>
                      <div className="flex flex-col gap-1">
                        {retreat.includes.slice(0, 4).map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                            <span className="text-jungle-400">✓</span> {item}
                          </div>
                        ))}
                        {retreat.includes.length > 4 && (
                          <p className="text-xs text-gray-500 mt-1">+{retreat.includes.length - 4} more included</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price + CTA */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-jungle-900/40">
                    <div>
                      <p className="text-2xl font-bold" style={{ color: "#c89f4f" }}>{formatPrice(retreat.price)}</p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                    {retreat.inStock ? (
                      <Link href={`/checkout?retreatId=${retreat.id}`}
                        className="flex items-center gap-2 bg-jungle-600 hover:bg-jungle-500 text-white font-semibold px-5 py-3 rounded-xl transition text-sm">
                        Book Now <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button disabled className="text-sm font-semibold bg-gray-800 text-gray-500 px-5 py-3 rounded-xl cursor-not-allowed">
                        Fully Booked
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 glass rounded-2xl p-8 text-center border border-jungle-900/40">
          <p className="text-gray-400 text-sm mb-2">Stay updated on upcoming retreats</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="https://www.instagram.com/herbcom_" target="_blank" rel="noopener noreferrer"
              className="text-sm font-semibold text-jungle-300 hover:text-white transition">📸 @herbcom_</a>
            <a href="https://www.facebook.com/share/1Fry7QcUcm/" target="_blank" rel="noopener noreferrer"
              className="text-sm font-semibold text-jungle-300 hover:text-white transition">👍 Facebook</a>
          </div>
        </div>
      </div>
    </div>
  );
}

```

## 35. `app/wholesale/page.tsx`

```tsx
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Lock, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import WholesaleInquiryForm from "./WholesaleInquiryForm";

async function getStatus(clerkId: string) {
  try {
    const user = await db.user.findUnique({ where: { clerkId }, include: { wholesaleApplication: true } });
    return { user, application: user?.wholesaleApplication || null };
  } catch { return { user: null, application: null }; }
}

export default async function WholesalePage() {
  const { userId } = await auth();
  const { user, application } = userId ? await getStatus(userId) : { user: null, application: null };

  const isApproved = user?.role === "WHOLESALE" || user?.role === "ADMIN";
  const isPending  = application?.status === "PENDING";
  const isRejected = application?.status === "REJECTED";

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#c89f4f" }}>Wholesale Program</p>
          <h1 className="text-5xl font-bold text-white font-display mb-4">Bulk Honey Orders</h1>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We offer wholesale pricing on our rare Melipona stingless bee honey by the liter,
            with or without custom labeling. Apply below to unlock wholesale pricing and place bulk orders.
          </p>
        </div>

        {/* Blurred preview */}
        <div className="relative mb-14">
          <div className={isApproved ? "" : "blur-lock"}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { name: "Melipona Beechi",         price: "$450/L", note: "Without labeling" },
                { name: "Melipona Yucatanica",      price: "$650/L", note: "Without labeling" },
                { name: "Scaptotrigona Mexicana",   price: "$650/L", note: "Without labeling" },
                { name: "Cephalotrigona Zexmeniae", price: "$900/L", note: "Extremely Rare"   },
                { name: "Tetragonisca Angustula",   price: "$500/L", note: "Without labeling" },
                { name: "Custom Labeling Options",  price: "Varies", note: "Half liters avail" },
              ].map((item) => (
                <div key={item.name} className="glass rounded-2xl p-5 border flex flex-col gap-2" style={{ borderColor: "rgba(200,159,79,0.2)" }}>
                  <span className="text-3xl">🍯</span>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-jungle-400">Guatemala</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-jungle-800/40">
                    <span className="text-sm font-bold" style={{ color: "#c89f4f" }}>{item.price}</span>
                    <span className="text-xs text-gray-500">{item.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isApproved && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4 text-center max-w-sm border" style={{ borderColor: "rgba(200,159,79,0.3)" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center border" style={{ background: "rgba(200,159,79,0.1)", borderColor: "rgba(200,159,79,0.3)" }}>
                  <Lock className="w-8 h-8" style={{ color: "#c89f4f" }} />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Wholesale Access Required</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {isPending ? "Your application is under review." : isRejected ? "Your application was not approved." : "Apply below to unlock wholesale pricing."}
                  </p>
                </div>
                {isPending && (
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#c89f4f" }}>
                    <Clock className="w-4 h-4" /> Pending Admin Approval
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Form / Status */}
        {isApproved ? (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-jungle-900/60 border border-jungle-600/50 text-jungle-300 px-6 py-3 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Wholesale Access Approved</span>
            </div>
            <p className="text-gray-400 mt-4">
              Visit your{" "}
              <Link href="/dashboard/wholesale" className="text-jungle-300 hover:text-white font-semibold transition">wholesale dashboard</Link>
              {" "}to view full pricing and place bulk orders.
            </p>
          </div>
        ) : isPending ? (
          <div className="max-w-lg mx-auto glass rounded-2xl p-8 text-center border" style={{ borderColor: "rgba(200,159,79,0.2)" }}>
            <Clock className="w-10 h-10 mx-auto mb-4" style={{ color: "#c89f4f" }} />
            <h3 className="text-xl font-bold text-white mb-2">Application Under Review</h3>
            <p className="text-gray-400 text-sm">We'll notify you by email once your application is reviewed.</p>
          </div>
        ) : isRejected ? (
          <div className="max-w-lg mx-auto glass rounded-2xl p-8 text-center border border-red-800/30">
            <p className="text-red-400 font-semibold mb-2">Application Not Approved</p>
            <p className="text-gray-400 text-sm">
              Please reach out via{" "}
              <a href="https://www.instagram.com/herbcom_" target="_blank" rel="noopener noreferrer" className="text-jungle-300 hover:text-white transition">Instagram</a>
              {" "}or{" "}
              <a href="https://www.facebook.com/share/1Fry7QcUcm/" target="_blank" rel="noopener noreferrer" className="text-jungle-300 hover:text-white transition">Facebook</a>.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto glass rounded-2xl p-8 border border-jungle-800/50">
            <h2 className="text-2xl font-bold text-white font-display mb-1">Apply for Wholesale Access</h2>
            <p className="text-gray-400 text-sm mb-8">Fill out the form and our team will review your application.</p>
            <WholesaleInquiryForm />
          </div>
        )}
      </div>
    </div>
  );
}

```

## 36. `app/wholesale/WholesaleInquiryForm.tsx`

```tsx
"use client";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";

export default function WholesaleInquiryForm() {
  const [form,    setForm]    = useState({ name: "", business: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  async function submit() {
    if (!form.name || !form.business || !form.email || !form.phone) { setError("Please fill in all required fields."); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/wholesale", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) setSuccess(true);
      else setError(data.error || "Submission failed.");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  if (success) return (
    <div className="text-center py-8 flex flex-col items-center gap-4">
      <span className="text-5xl">✅</span>
      <h3 className="text-xl font-bold text-white">Application Submitted!</h3>
      <p className="text-gray-400 text-sm">We'll review your application and get back to you by email soon.</p>
    </div>
  );

  const ic = "w-full bg-jungle-950/60 border border-jungle-800/60 focus:border-jungle-500 text-white placeholder-gray-600 px-4 py-3 rounded-xl outline-none transition text-sm";
  const lc = "block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div><label className={lc}>Full Name *</label><input className={ic} placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className={lc}>Business Name *</label><input className={ic} placeholder="Your business" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} /></div>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div><label className={lc}>Email *</label><input type="email" className={ic} placeholder="you@business.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className={lc}>Phone *</label><input type="tel" className={ic} placeholder="+1 (000) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
      </div>
      <div>
        <label className={lc}>Message / Inquiry</label>
        <textarea className={`${ic} resize-none h-28`} placeholder="Tell us about your business and which products you're interested in…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button onClick={submit} disabled={loading}
        className="flex items-center justify-center gap-2 w-full font-semibold py-4 rounded-xl transition disabled:opacity-60"
        style={{ background: "linear-gradient(135deg,#c89f4f,#e8c878)", color: "#1a0e00" }}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {loading ? "Submitting…" : "Submit Application"}
      </button>
    </div>
  );
}

```

## 37. `app/about/page.tsx`

```tsx
import { Leaf, MapPin, Heart, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="mb-16">
          <p className="text-jungle-400 text-sm font-semibold uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white font-display mb-6 leading-tight">
            Rooted in Nature.<br /><span className="gold-shimmer">Built for Community.</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
            Herbal Communities was founded on a simple mission: to bring the most authentic,
            potent, and rare natural medicines from Central and South America directly to people
            who need them — without the markup, without the middlemen, and without compromise.
          </p>
        </div>

        {/* Story */}
        <div className="glass rounded-3xl p-8 border border-jungle-800/40 mb-10">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-full bg-jungle-gradient flex items-center justify-center shrink-0 mt-1">
              <Leaf className="w-5 h-5 text-jungle-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-display mb-3">The Journey</h2>
              <div className="flex flex-col gap-4 text-gray-300 leading-relaxed">
                <p>
                  Our founder travels deep into Guatemala, Honduras, and Jamaica — to remote farming
                  communities, jungle apiarists, and indigenous healers — to source products that most
                  people will never have access to. From the stingless Melipona beekeepers on the shores
                  of Lake Atitlán to the Moskito Coast harvesters of Batana oil, every relationship is
                  built on trust, respect, and fair exchange.
                </p>
                <p>
                  We carry over 60 medicinal herbs, rare stingless bee honeys that have been used for
                  thousands of years by Maya and other indigenous peoples, sea moss from the pristine
                  waters of Jamaica and Honduras, hand-pressed oils, and wellness products made by small
                  family operations who have refined their craft over generations.
                </p>
                <p>
                  This is not a supplement company. This is a community bridge — connecting ancient
                  plant wisdom with people who are ready to heal naturally.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: <MapPin className="w-5 h-5" />, title: "Direct Sourced", desc: "Every product comes directly from the growers, beekeepers, and makers in Guatemala, Honduras, and Jamaica.", color: "text-jungle-400" },
            { icon: <Heart className="w-5 h-5" />,  title: "Traditional Wisdom", desc: "We work with indigenous and generational knowledge — practices passed down for hundreds or thousands of years.", color: "text-terra-300" },
            { icon: <Users className="w-5 h-5" />,  title: "Community First", desc: "Every purchase supports small farming families and communities in Central America who depend on these crafts.", color: "text-amber-300" },
          ].map((v) => (
            <div key={v.title} className="glass rounded-2xl p-6 border border-jungle-900/40 flex flex-col gap-3">
              <div className={v.color}>{v.icon}</div>
              <h3 className="font-bold text-white">{v.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Sourcing regions */}
        <div className="glass rounded-2xl p-8 border border-jungle-900/40">
          <h2 className="text-2xl font-bold text-white font-display mb-6">Where We Source</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { flag: "🇬🇹", country: "Guatemala", items: ["Stingless Melipona bee honey (5 varieties)", "Light & Dark roast coffee (Lake Atitlán)", "Medicinal jungle herbs", "Young jelly coconuts"] },
              { flag: "🇭🇳", country: "Honduras",  items: ["Raw Batana oil (hand-pressed)", "Cedar Macho (Swa) oil", "Wild coconut oil", "Dry sea moss", "Handmade soaps & shampoos"] },
              { flag: "🇯🇲", country: "Jamaica",   items: ["Jamaican Purple sea moss", "Jamaican Gold sea moss", "Native medicinal botanicals"] },
            ].map((s) => (
              <div key={s.country}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{s.flag}</span>
                  <h3 className="font-bold text-white">{s.country}</h3>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-jungle-500 mt-0.5 shrink-0">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

```

## 38. `app/reviews/page.tsx`

```tsx
import { Star } from "lucide-react";

const REVIEWS = [
  { name: "Tanya M.",     rating: 5, product: "Batana Oil",             text: "This oil is unlike anything I've ever used. My hair went from dry and brittle to thick and shiny in two weeks. Real Batana from Honduras — you can smell the difference." },
  { name: "Marcus L.",    rating: 5, product: "Melipona Beechi Honey",  text: "I use this for my eyes as drops and the results have been remarkable. The fruity floral flavor is incredible too. This is truly medicine, not just food." },
  { name: "Priya S.",     rating: 5, product: "Jamaican Purple Seamoss", text: "I've tried sea moss from many brands. This is the cleanest, most potent version I've ever ordered. You can tell it's fresh and direct sourced." },
  { name: "Devin R.",     rating: 5, product: "Soursop Leaves",         text: "My pressure has been much more stable since I started making tea with these leaves. Authentic quality — the descriptions match exactly what you receive." },
  { name: "Amara J.",     rating: 5, product: "Duck Flower",            text: "I was skeptical but this was a full body reset like nothing I've experienced. Mental clarity is real. Not for the faint of heart but absolutely worth it." },
  { name: "Carlos T.",    rating: 5, product: "Coconut Oil",            text: "Hand-pressed from wild coconuts in Honduras. Completely different from store bought. I use it for everything — cooking, skin, hair, even oil pulling." },
  { name: "Simone B.",    rating: 5, product: "Fibroid Package",        text: "The herbal package has made a noticeable difference. The herbs are potent and clearly sourced properly. I've recommended this to everyone I know." },
  { name: "Kendall W.",   rating: 5, product: "Cedar Macho (Swa) Oil",  text: "Can't find this anywhere else. The inflammation in my joints has reduced significantly. This brand is the real deal — they actually go to the source." },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-14 text-center">
          <p className="text-jungle-400 text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
          <h1 className="text-5xl font-bold text-white font-display mb-4">Community Reviews</h1>
          <div className="flex justify-center gap-1 mb-3">
            {[1,2,3,4,5].map((i) => <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}
          </div>
          <p className="text-gray-400">Real experiences from our wellness community</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {REVIEWS.map((r, i) => (
            <div key={i} className="glass rounded-2xl p-6 border border-jungle-900/40 flex flex-col gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed flex-1">"{r.text}"</p>
              <div className="flex items-center justify-between pt-3 border-t border-jungle-900/40">
                <p className="text-jungle-300 font-semibold text-sm">— {r.name}</p>
                <span className="text-xs px-2.5 py-1 rounded-full bg-jungle-900/60 text-jungle-400 border border-jungle-800/40">{r.product}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 glass rounded-2xl p-8 text-center border border-jungle-900/40">
          <p className="text-white font-semibold mb-2">Share Your Experience</p>
          <p className="text-gray-400 text-sm mb-5">We'd love to hear about your results. Tag us or send us a message.</p>
          <div className="flex justify-center gap-4">
            <a href="https://www.instagram.com/herbcom_" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-jungle-700 hover:bg-jungle-600 text-white font-semibold px-5 py-3 rounded-xl transition text-sm">
              📸 @herbcom_
            </a>
            <a href="https://www.facebook.com/share/1Fry7QcUcm/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl transition text-sm">
              👍 Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

```

## 39. `app/success/page.tsx`

```tsx
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full glass rounded-3xl p-10 text-center flex flex-col items-center gap-6 border border-jungle-700/40">
        <div className="w-20 h-20 rounded-full bg-jungle-900/60 border border-jungle-600/50 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-jungle-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white font-display mb-3">Order Confirmed!</h1>
          <p className="text-gray-400 leading-relaxed">
            Thank you for supporting Herbal Communities. Your order has been received and a
            confirmation email is on its way to you.
          </p>
        </div>
        <div className="bg-jungle-950/60 rounded-2xl p-5 w-full text-left border border-jungle-900/40">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">What Happens Next</p>
          <div className="flex flex-col gap-2">
            {["Check your email for a confirmation receipt.", "Your order will be prepared and shipped.", "Follow us on Instagram and Facebook for updates."].map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-jungle-400 font-bold shrink-0">{i + 1}.</span> {s}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/products" className="bg-jungle-600 hover:bg-jungle-500 text-white font-semibold px-6 py-3 rounded-xl transition">
            Continue Shopping
          </Link>
          <Link href="/" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

```

## 40. `app/sign-in/[[...sign-in]]/page.tsx`

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-jungle-400 text-sm font-semibold uppercase tracking-widest mb-2">Welcome Back</p>
          <h1 className="text-3xl font-bold text-white font-display">Sign In</h1>
        </div>
        <SignIn />
      </div>
    </div>
  );
}

```

## 41. `app/sign-up/[[...sign-up]]/page.tsx`

```tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-jungle-400 text-sm font-semibold uppercase tracking-widest mb-2">Join the Community</p>
          <h1 className="text-3xl font-bold text-white font-display">Create Account</h1>
        </div>
        <SignUp />
      </div>
    </div>
  );
}

```

## 42. `app/api/checkout/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { variantId } = await req.json();
    if (!variantId) return NextResponse.json({ error: "Missing variantId" }, { status: 400 });

    const variant = await db.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant)          return NextResponse.json({ error: "Product not found." }, { status: 404 });
    if (!variant.inStock)  return NextResponse.json({ error: "Out of stock."      }, { status: 400 });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: Math.round(variant.price * 100),
          product_data: {
            name: `${variant.product.name} — ${variant.label}`,
            images: variant.product.images.length > 0 ? [variant.product.images[0]] : [],
            description: variant.product.description || undefined,
          },
        },
        quantity: 1,
      }],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${siteUrl}/products`,
      metadata: { variantId, productId: variant.productId },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json({ error: "Checkout failed." }, { status: 500 });
  }
}

```

## 43. `app/api/webhook/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { render } from "@react-email/components";
import OrderConfirmation from "@/emails/OrderConfirmation";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e: any) {
    return NextResponse.json({ error: `Webhook error: ${e.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    try {
      // Create order in DB
      const order = await db.order.create({
        data: {
          stripeSessionId: session.id,
          status:   "PAID",
          total:    session.amount_total / 100,
          currency: session.currency,
          email:    session.customer_details?.email || null,
          metadata: session.metadata,
          items: {
            create: [{
              name:      session.metadata?.productName || "Product",
              price:     session.amount_total / 100,
              qty:       1,
              variantId: session.metadata?.variantId || null,
              productId: session.metadata?.productId || null,
            }],
          },
        },
        include: { items: true },
      });

      // Send confirmation email
      if (session.customer_details?.email) {
        const html = await render(
          OrderConfirmation({
            customerName: session.customer_details.name || "Customer",
            orderId:      order.id,
            items:        order.items.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
            total:        order.total,
          })
        );

        await resend.emails.send({
          from:    FROM_EMAIL,
          to:      session.customer_details.email,
          subject: "Your Herbal Communities Order Confirmation 🌿",
          html,
        });
      }
    } catch (e) {
      console.error("Webhook processing error:", e);
    }
  }

  return NextResponse.json({ received: true });
}

```

## 44. `app/api/wholesale/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { render } from "@react-email/components";
import WholesaleReceived from "@/emails/WholesaleReceived";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const { name, business, email, phone, message } = await req.json();

    if (!name || !business || !email || !phone)
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });

    let user = null;
    if (userId) user = await db.user.findUnique({ where: { clerkId: userId } });

    if (user) {
      const existing = await db.wholesaleApplication.findUnique({ where: { userId: user.id } });
      if (existing) return NextResponse.json({ error: "Application already submitted." }, { status: 409 });
    }

    await db.wholesaleApplication.create({
      data: { name, business, email, phone, message, userId: user?.id || null, status: "PENDING" },
    });

    // Email the admin
    if (FROM_EMAIL) {
      const html = await render(WholesaleReceived({ name, businessName: business, email, phone, message }));
      await resend.emails.send({
        from:    FROM_EMAIL,
        to:      FROM_EMAIL,
        subject: `New Wholesale Application — ${business}`,
        html,
      });
    }

    // Confirmation to applicant
    await resend.emails.send({
      from:    FROM_EMAIL,
      to:      email,
      subject: "Wholesale Application Received — Herbal Communities",
      html:    `<p>Hi ${name}, we received your wholesale application for <strong>${business}</strong> and will review it shortly.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Wholesale application error:", e);
    return NextResponse.json({ error: "Submission failed." }, { status: 500 });
  }
}

```

## 45. `app/api/products/[slug]/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const product = await db.product.findUnique({
      where: { slug, active: true },
      include: { variants: { orderBy: { price: "asc" } } },
    });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

```

## 46. `app/api/admin/products/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const products = await db.product.findMany({ include: { variants: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { name, description, sku, category, type, featured, active, images, metadata, variants } = await req.json();

    let slug = slugify(name);
    // ensure unique slug
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const product = await db.product.create({
      data: {
        name, slug, description, sku: sku || null, category,
        type, featured, active, images: images || [], metadata: metadata || {},
        variants: {
          create: (variants || []).map((v: any) => ({
            label:   v.label,
            price:   v.price,
            qty:     v.qty    || 0,
            sku:     v.sku    || null,
            inStock: v.inStock !== false,
          })),
        },
      },
      include: { variants: true },
    });

    return NextResponse.json({ success: true, product });
  } catch (e: any) {
    console.error("Create product error:", e);
    return NextResponse.json({ error: e.message || "Failed to create product." }, { status: 500 });
  }
}

```

## 47. `app/api/admin/products/[id]/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id }, include: { variants: true } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  try {
    const { name, description, sku, category, type, featured, active, images, metadata, variants } = await req.json();

    // Delete old variants and recreate
    await db.productVariant.deleteMany({ where: { productId: id } });

    const product = await db.product.update({
      where: { id },
      data: {
        name, description, sku: sku || null, category,
        type, featured, active, images: images || [],
        metadata: metadata || {},
        slug: slugify(name),
        variants: {
          create: (variants || []).map((v: any) => ({
            label:   v.label,
            price:   v.price,
            qty:     v.qty    || 0,
            sku:     v.sku    || null,
            inStock: v.inStock !== false,
          })),
        },
      },
      include: { variants: true },
    });

    return NextResponse.json({ success: true, product });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Update failed." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const data = await req.json();
  const product = await db.product.update({ where: { id }, data });
  return NextResponse.json({ success: true, product });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await db.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

```

## 48. `app/api/admin/retreats/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const retreats = await db.retreat.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ retreats });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const body = await req.json();
    let slug = slugify(body.name);
    const existing = await db.retreat.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const retreat = await db.retreat.create({
      data: {
        name:        body.name,
        slug,
        description: body.description || null,
        location:    body.location    || null,
        country:     body.country     || null,
        duration:    body.duration    || null,
        price:       body.price       || 0,
        spots:       body.spots       || 0,
        spotsLeft:   body.spotsLeft   || body.spots || 0,
        inStock:     body.inStock     !== false,
        images:      body.images      || [],
        featured:    body.featured    || false,
        active:      body.active      !== false,
        includes:    body.includes    || [],
        metadata:    body.metadata    || {},
        startDate:   body.startDate   ? new Date(body.startDate) : null,
        endDate:     body.endDate     ? new Date(body.endDate)   : null,
      },
    });

    return NextResponse.json({ success: true, retreat });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed." }, { status: 500 });
  }
}

```

## 49. `app/api/admin/retreats/[id]/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const retreat = await db.retreat.findUnique({ where: { id } });
  if (!retreat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ retreat });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  try {
    const body = await req.json();
    const retreat = await db.retreat.update({
      where: { id },
      data: {
        name:        body.name,
        slug:        slugify(body.name),
        description: body.description || null,
        location:    body.location    || null,
        country:     body.country     || null,
        duration:    body.duration    || null,
        price:       body.price       || 0,
        spots:       body.spots       || 0,
        spotsLeft:   body.spotsLeft   || 0,
        inStock:     body.inStock     !== false,
        images:      body.images      || [],
        featured:    body.featured    || false,
        active:      body.active      !== false,
        includes:    body.includes    || [],
        metadata:    body.metadata    || {},
        startDate:   body.startDate   ? new Date(body.startDate) : null,
        endDate:     body.endDate     ? new Date(body.endDate)   : null,
      },
    });
    return NextResponse.json({ success: true, retreat });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Update failed." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const data = await req.json();
  const retreat = await db.retreat.update({ where: { id }, data });
  return NextResponse.json({ success: true, retreat });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await db.retreat.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

```

## 50. `app/api/admin/banner/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const banners = await db.banner.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ banners });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { text, color, bgColor, active } = await req.json();
  if (!text) return NextResponse.json({ error: "Text required." }, { status: 400 });
  const banner = await db.banner.create({ data: { text, color: color || "#c89f4f", bgColor: bgColor || "#1a3a22", active: active !== false } });
  return NextResponse.json({ success: true, banner });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, text, color, bgColor, active } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required." }, { status: 400 });
  const banner = await db.banner.update({ where: { id }, data: { text, color, bgColor, active } });
  return NextResponse.json({ success: true, banner });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await db.banner.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

```

## 51. `app/api/admin/wholesale/[id]/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { render } from "@react-email/components";
import WholesaleApproved from "@/emails/WholesaleApproved";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id }             = await params;
  const { status, userId } = await req.json();

  try {
    const application = await db.wholesaleApplication.update({
      where: { id },
      data:  { status },
    });

    // If approved — upgrade user role
    if (status === "APPROVED" && userId) {
      await db.user.update({ where: { id: userId }, data: { role: "WHOLESALE" } });
    }

    // Send approval email
    if (status === "APPROVED") {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const html    = await render(
        WholesaleApproved({
          name:         application.name,
          businessName: application.business,
          siteUrl,
        })
      );
      await resend.emails.send({
        from:    FROM_EMAIL,
        to:      application.email,
        subject: "Your Wholesale Access is Approved — Herbal Communities 🍯",
        html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Update failed." }, { status: 500 });
  }
}

```

## 52. `app/dashboard/admin/page.tsx`

```tsx
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Package, TreePalm, Users, Megaphone } from "lucide-react";

export default async function AdminDashboard() {
  if (!(await isAdmin())) redirect("/");

  const [productCount, retreatCount, pendingApps, banner] = await Promise.all([
    db.product.count({ where: { active: true } }),
    db.retreat.count({ where: { active: true } }),
    db.wholesaleApplication.count({ where: { status: "PENDING" } }),
    db.banner.findFirst({ where: { active: true } }),
  ]);

  const stats = [
    { label: "Active Products",  value: productCount, icon: <Package   className="w-5 h-5" />, href: "/dashboard/admin/products",  color: "text-jungle-400" },
    { label: "Active Retreats",  value: retreatCount, icon: <TreePalm  className="w-5 h-5" />, href: "/dashboard/admin/retreats",  color: "text-teal-400"   },
    { label: "Pending Wholesale",value: pendingApps,  icon: <Users     className="w-5 h-5" />, href: "/dashboard/admin/wholesale", color: pendingApps > 0 ? "text-amber-400" : "text-gray-400", urgent: pendingApps > 0 },
    { label: "Banner Status",    value: banner ? 1 : 0, icon: <Megaphone className="w-5 h-5" />, href: "/dashboard/admin/banner", color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-jungle-400 text-sm font-semibold uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-4xl font-bold text-white font-display">Dashboard</h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((s) => (
            <Link key={s.label} href={s.href}
              className={`glass rounded-2xl p-5 flex flex-col gap-3 border transition hover:border-jungle-600/50 ${(s as any).urgent ? "border-amber-warm/40 bg-amber-950/20" : "border-jungle-900/50"}`}
              style={(s as any).urgent ? { "--amber-warm": "#c89f4f" } as any : {}}>
              <div className={s.color}>{s.icon}</div>
              <div>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
              {(s as any).urgent && (
                <span className="text-xs font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full w-fit">Needs Review</span>
              )}
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 border border-jungle-900/50">
            <div className="flex items-center gap-3 mb-4">
              <Megaphone className="w-5 h-5" style={{ color: "#c89f4f" }} />
              <h2 className="font-bold text-white">Clearance Banner</h2>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${banner ? "bg-jungle-900/60 text-jungle-300" : "bg-gray-800 text-gray-500"}`}>
                {banner ? "Active" : "Inactive"}
              </span>
            </div>
            {banner
              ? <p className="text-sm text-gray-300 mb-4 line-clamp-2">"{banner.text}"</p>
              : <p className="text-sm text-gray-500 mb-4">No active banner.</p>
            }
            <Link href="/dashboard/admin/banner" className="text-sm font-semibold hover:underline" style={{ color: "#c89f4f" }}>
              Manage Banner →
            </Link>
          </div>

          <div className="glass rounded-2xl p-6 border border-jungle-900/50">
            <h2 className="font-bold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              {[
                { href: "/dashboard/admin/products/new",  label: "+ Add New Product"                                            },
                { href: "/dashboard/admin/retreats/new",  label: "+ Add New Retreat"                                            },
                { href: "/dashboard/admin/wholesale",     label: `Review Applications${pendingApps > 0 ? ` (${pendingApps})` : ""}` },
                { href: "/dashboard/admin/banner",        label: "✦ Edit Banner"                                                },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  className="flex items-center justify-between text-sm text-gray-300 hover:text-white hover:bg-jungle-900/40 px-3 py-2.5 rounded-xl transition">
                  <span>{item.label}</span>
                  <span className="text-jungle-400">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

## 53. `app/dashboard/admin/products/page.tsx`

```tsx
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import AdminProductList from "./AdminProductList";

export default async function AdminProductsPage() {
  if (!(await isAdmin())) redirect("/");
  const products = await db.product.findMany({ include: { variants: true }, orderBy: { createdAt: "desc" } });
  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard/admin" className="text-xs text-jungle-400 hover:text-jungle-300 mb-1 block">← Admin</Link>
            <h1 className="text-3xl font-bold text-white font-display">Products</h1>
            <p className="text-gray-500 text-sm mt-1">{products.length} total</p>
          </div>
          <Link href="/dashboard/admin/products/new"
            className="flex items-center gap-2 bg-jungle-600 hover:bg-jungle-500 text-white font-semibold px-5 py-3 rounded-xl transition">
            + Add Product
          </Link>
        </div>
        <AdminProductList products={products} />
      </div>
    </div>
  );
}

```

## 54. `app/dashboard/admin/products/AdminProductList.tsx`

```tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit2, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Variant  = { id: string; label: string; price: number; inStock: boolean; qty: number };
type Product  = { id: string; name: string; slug: string; category: string; type: string; images: string[]; active: boolean; featured: boolean; variants: Variant[] };

export default function AdminProductList({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = products.filter((p) => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase());
    const mf = filter === "all"      ? true
             : filter === "active"   ? p.active
             : filter === "inactive" ? !p.active
             : p.type.toLowerCase() === filter;
    return ms && mf;
  });

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !active }) });
    window.location.reload();
  }

  async function del(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…"
          className="bg-jungle-950/60 border border-jungle-800/60 text-white placeholder-gray-600 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-jungle-500 flex-1 min-w-48" />
        <div className="flex flex-wrap gap-2">
          {["all","retail","wholesale","active","inactive"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition ${filter === f ? "bg-jungle-600 text-white" : "bg-jungle-900/40 text-gray-400 hover:text-white border border-jungle-800/40"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl border border-jungle-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-jungle-900/60">
                {["Product","Category","Type","Variants","Status","Actions"].map((h) => (
                  <th key={h} className={`text-xs uppercase tracking-wider text-gray-500 px-5 py-4 font-semibold ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-jungle-900/30 hover:bg-jungle-950/40 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-jungle-900/60 overflow-hidden shrink-0 flex items-center justify-center">
                        {p.images[0]
                          ? <Image src={p.images[0]} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                          : <span className="text-lg">🌿</span>
                        }
                      </div>
                      <div>
                        <p className="font-medium text-white line-clamp-1">{p.name}</p>
                        {p.featured && <span className="text-xs flex items-center gap-0.5" style={{ color: "#c89f4f" }}><Star className="w-2.5 h-2.5" /> Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-400 capitalize">{p.category}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.type === "RETAIL" ? "bg-jungle-900/60 text-jungle-300" : p.type === "WHOLESALE" ? "bg-yellow-900/60 text-yellow-300" : "bg-teal-900/60 text-teal-300"}`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-400">
                    {p.variants.length} sizes{p.variants.length > 0 ? ` · From ${formatPrice(Math.min(...p.variants.map((v) => v.price)))}` : ""}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.active ? "bg-emerald-900/60 text-emerald-300" : "bg-gray-800 text-gray-500"}`}>
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/admin/products/${p.id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-jungle-800/60 transition"><Edit2 className="w-4 h-4" /></Link>
                      <button onClick={() => toggleActive(p.id, p.active)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-jungle-800/60 transition">
                        {p.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => del(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/40 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

```

## 55. `app/dashboard/admin/products/ProductForm.tsx`

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, X } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/utils";

type Variant = { label: string; price: string; qty: string; sku: string; inStock: boolean };
type Props   = { product?: any };

export default function ProductForm({ product }: Props) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const [form, setForm] = useState({
    name:        product?.name        || "",
    description: product?.description || "",
    sku:         product?.sku         || "",
    category:    product?.category    || "herbs",
    type:        product?.type        || "RETAIL",
    featured:    product?.featured    || false,
    active:      product?.active      !== false,
    metadata:    product?.metadata    ? JSON.stringify(product.metadata, null, 2) : "{}",
  });

  const [variants, setVariants] = useState<Variant[]>(
    product?.variants?.map((v: any) => ({
      label: v.label, price: String(v.price), qty: String(v.qty), sku: v.sku || "", inStock: v.inStock,
    })) || [{ label: "4oz", price: "", qty: "0", sku: "", inStock: true }]
  );

  const [images,   setImages]   = useState<string[]>(product?.images || []);
  const [imageUrl, setImageUrl] = useState("");

  function addVariant() { setVariants([...variants, { label: "", price: "", qty: "0", sku: "", inStock: true }]); }
  function rmVariant(i: number) { setVariants(variants.filter((_, idx) => idx !== i)); }
  function upVariant(i: number, k: keyof Variant, v: any) { const u = [...variants]; u[i] = { ...u[i], [k]: v }; setVariants(u); }
  function addImg() { if (imageUrl.trim()) { setImages([...images, imageUrl.trim()]); setImageUrl(""); } }

  async function submit() {
    if (!form.name || !form.category)        { setError("Name and category are required."); return; }
    if (variants.some((v) => !v.label || !v.price)) { setError("All variants need a label and price."); return; }
    setLoading(true); setError("");
    try {
      let metadata = {};
      try { metadata = JSON.parse(form.metadata); } catch {}
      const payload = { ...form, images, metadata, variants: variants.map((v) => ({ ...v, price: parseFloat(v.price), qty: parseInt(v.qty) || 0 })) };
      const url    = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = product ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data   = await res.json();
      if (data.success) { router.push("/dashboard/admin/products"); router.refresh(); }
      else setError(data.error || "Save failed.");
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  }

  const ic = "w-full bg-jungle-950/60 border border-jungle-800/60 focus:border-jungle-500 text-white placeholder-gray-600 px-4 py-3 rounded-xl outline-none transition text-sm";
  const lc = "block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5";

  return (
    <div className="flex flex-col gap-8">

      {/* Basic */}
      <div className="glass rounded-2xl p-6 border border-jungle-900/50">
        <h2 className="font-bold text-white mb-5">Basic Information</h2>
        <div className="flex flex-col gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={lc}>Name *</label><input className={ic} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Batana Oil" /></div>
            <div><label className={lc}>SKU</label><input className={ic} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="HERB-BAT-001" /></div>
          </div>
          <div><label className={lc}>Description</label><textarea className={`${ic} resize-none h-32`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the product, benefits, usage..." /></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={lc}>Category *</label>
              <select className={ic} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {PRODUCT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div><label className={lc}>Type *</label>
              <select className={ic} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="RETAIL">Retail</option>
                <option value="WHOLESALE">Wholesale</option>
                <option value="BOTH">Both</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-green-500 rounded" /> Active
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded" style={{ accentColor: "#c89f4f" }} /> Featured on Homepage
            </label>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="glass rounded-2xl p-6 border border-jungle-900/50">
        <h2 className="font-bold text-white mb-5">Images</h2>
        <div className="flex gap-2 mb-3">
          <input className={`${ic} flex-1`} placeholder="Paste image URL…" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addImg()} />
          <button onClick={addImg} className="bg-jungle-700 hover:bg-jungle-600 text-white px-4 rounded-xl transition"><Plus className="w-4 h-4" /></button>
        </div>
        <p className="text-xs text-gray-500 mb-4">First image is the main product image.</p>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt="" className="w-20 h-20 object-cover rounded-xl border border-jungle-800/60"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/80x80/0f2913/4a9e52?text=?"; }} />
                <button onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <X className="w-3 h-3" />
                </button>
                {i === 0 && <span className="absolute bottom-1 left-1 text-xs bg-jungle-800/80 text-jungle-300 px-1 rounded">Main</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Variants */}
      <div className="glass rounded-2xl p-6 border border-jungle-900/50">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white">Sizes / Variants</h2>
          <button onClick={addVariant} className="flex items-center gap-1.5 text-sm text-jungle-300 hover:text-white bg-jungle-900/60 border border-jungle-700/50 px-3 py-1.5 rounded-xl transition">
            <Plus className="w-3.5 h-3.5" /> Add Size
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="hidden md:grid grid-cols-12 gap-3 text-xs uppercase tracking-wider text-gray-500 font-semibold px-1">
            <span className="col-span-3">Label</span><span className="col-span-2">Price ($)</span><span className="col-span-2">Qty</span><span className="col-span-3">SKU</span><span className="col-span-1 text-center">Stock</span><span className="col-span-1" />
          </div>
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input className={`${ic} col-span-3`} placeholder="4oz" value={v.label} onChange={(e) => upVariant(i, "label", e.target.value)} />
              <input type="number" className={`${ic} col-span-2`} placeholder="0.00" value={v.price} onChange={(e) => upVariant(i, "price", e.target.value)} />
              <input type="number" className={`${ic} col-span-2`} placeholder="0" value={v.qty} onChange={(e) => upVariant(i, "qty", e.target.value)} />
              <input className={`${ic} col-span-3`} placeholder="SKU" value={v.sku} onChange={(e) => upVariant(i, "sku", e.target.value)} />
              <div className="col-span-1 flex justify-center">
                <input type="checkbox" checked={v.inStock} onChange={(e) => upVariant(i, "inStock", e.target.checked)} className="w-4 h-4 accent-green-500" />
              </div>
              <button onClick={() => rmVariant(i)} className="col-span-1 p-1.5 text-gray-600 hover:text-red-400 rounded-lg hover:bg-red-950/30 transition flex justify-center">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div className="glass rounded-2xl p-6 border border-jungle-900/50">
        <h2 className="font-bold text-white mb-2">Metadata (JSON)</h2>
        <p className="text-xs text-gray-500 mb-3">Optional. e.g. source country, organic status, usage notes.</p>
        <textarea className={`${ic} font-mono h-28 resize-none`} value={form.metadata} onChange={(e) => setForm({ ...form, metadata: e.target.value })} placeholder='{"source":"Honduras","organic":"true"}' />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button onClick={submit} disabled={loading}
        className="flex items-center justify-center gap-2 bg-jungle-600 hover:bg-jungle-500 disabled:opacity-60 text-white font-semibold px-8 py-4 rounded-xl transition w-fit">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {product ? "Save Changes" : "Create Product"}
      </button>
    </div>
  );
}

```

## 56. `app/dashboard/admin/products/new/page.tsx`

```tsx
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  if (!(await isAdmin())) redirect("/");
  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/admin/products" className="text-xs text-jungle-400 hover:text-jungle-300 mb-4 block">← Back to Products</Link>
        <h1 className="text-3xl font-bold text-white font-display mb-8">Add New Product</h1>
        <ProductForm />
      </div>
    </div>
  );
}

```

## 57. `app/dashboard/admin/products/[id]/page.tsx`

```tsx
import { isAdmin } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import ProductForm from "../ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/");
  const { id }  = await params;
  const product = await db.product.findUnique({ where: { id }, include: { variants: true } });
  if (!product) notFound();
  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/admin/products" className="text-xs text-jungle-400 hover:text-jungle-300 mb-4 block">← Back to Products</Link>
        <h1 className="text-3xl font-bold text-white font-display mb-2">Edit Product</h1>
        <p className="text-gray-500 text-sm mb-8">{product.name}</p>
        <ProductForm product={product} />
      </div>
    </div>
  );
}

```

## 58. `app/dashboard/admin/retreats/page.tsx`

```tsx
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import AdminRetreatList from "./AdminRetreatList";

export default async function AdminRetreatsPage() {
  if (!(await isAdmin())) redirect("/");
  const retreats = await db.retreat.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard/admin" className="text-xs text-jungle-400 hover:text-jungle-300 mb-1 block">← Admin</Link>
            <h1 className="text-3xl font-bold text-white font-display">Retreats</h1>
            <p className="text-gray-500 text-sm mt-1">{retreats.length} total</p>
          </div>
          <Link href="/dashboard/admin/retreats/new"
            className="flex items-center gap-2 bg-jungle-600 hover:bg-jungle-500 text-white font-semibold px-5 py-3 rounded-xl transition">
            + Add Retreat
          </Link>
        </div>
        <AdminRetreatList retreats={retreats} />
      </div>
    </div>
  );
}

```

## 59. `app/dashboard/admin/retreats/AdminRetreatList.tsx`

```tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Retreat = { id: string; name: string; location: string | null; country: string | null; price: number; spots: number; spotsLeft: number; inStock: boolean; active: boolean; featured: boolean; images: string[] };

export default function AdminRetreatList({ retreats }: { retreats: Retreat[] }) {
  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/retreats/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !active }) });
    window.location.reload();
  }
  async function del(id: string) {
    if (!confirm("Delete this retreat?")) return;
    await fetch(`/api/admin/retreats/${id}`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="glass rounded-2xl border border-jungle-900/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-jungle-900/60">
              {["Retreat","Location","Price","Spots","Status","Actions"].map((h) => (
                <th key={h} className={`text-xs uppercase tracking-wider text-gray-500 px-5 py-4 font-semibold ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {retreats.map((r) => (
              <tr key={r.id} className="border-b border-jungle-900/30 hover:bg-jungle-950/40 transition">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-jungle-900/60 flex items-center justify-center text-xl shrink-0">🏕️</div>
                    <p className="font-medium text-white line-clamp-1">{r.name}</p>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-400">{[r.location, r.country].filter(Boolean).join(", ") || "—"}</td>
                <td className="px-4 py-4 font-semibold" style={{ color: "#c89f4f" }}>{formatPrice(r.price)}</td>
                <td className="px-4 py-4 text-gray-400">{r.spotsLeft}/{r.spots}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${r.active ? "bg-emerald-900/60 text-emerald-300" : "bg-gray-800 text-gray-500"}`}>{r.active ? "Active" : "Inactive"}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${r.inStock ? "bg-jungle-900/60 text-jungle-300" : "bg-red-900/60 text-red-400"}`}>{r.inStock ? "Available" : "Fully Booked"}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/admin/retreats/${r.id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-jungle-800/60 transition"><Edit2 className="w-4 h-4" /></Link>
                    <button onClick={() => toggleActive(r.id, r.active)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-jungle-800/60 transition">
                      {r.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => del(r.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/40 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {retreats.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No retreats yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

```

## 60. `app/dashboard/admin/retreats/RetreatForm.tsx`

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, X } from "lucide-react";

type Props = { retreat?: any };

export default function RetreatForm({ retreat }: Props) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const [form, setForm] = useState({
    name:        retreat?.name        || "",
    description: retreat?.description || "",
    location:    retreat?.location    || "",
    country:     retreat?.country     || "",
    duration:    retreat?.duration    || "",
    price:       retreat?.price       ? String(retreat.price) : "",
    spots:       retreat?.spots       ? String(retreat.spots) : "",
    spotsLeft:   retreat?.spotsLeft   ? String(retreat.spotsLeft) : "",
    inStock:     retreat?.inStock     !== false,
    featured:    retreat?.featured    || false,
    active:      retreat?.active      !== false,
    startDate:   retreat?.startDate   ? new Date(retreat.startDate).toISOString().split("T")[0] : "",
    endDate:     retreat?.endDate     ? new Date(retreat.endDate).toISOString().split("T")[0]   : "",
    metadata:    retreat?.metadata    ? JSON.stringify(retreat.metadata, null, 2) : "{}",
  });

  const [includes, setIncludes] = useState<string[]>(retreat?.includes || []);
  const [newItem,  setNewItem]  = useState("");
  const [images,   setImages]   = useState<string[]>(retreat?.images || []);
  const [imageUrl, setImageUrl] = useState("");

  function addInclude() { if (newItem.trim()) { setIncludes([...includes, newItem.trim()]); setNewItem(""); } }
  function addImg()     { if (imageUrl.trim()) { setImages([...images, imageUrl.trim()]); setImageUrl(""); } }

  async function submit() {
    if (!form.name || !form.price) { setError("Name and price are required."); return; }
    setLoading(true); setError("");
    try {
      let metadata = {};
      try { metadata = JSON.parse(form.metadata); } catch {}
      const payload = {
        ...form,
        price:     parseFloat(form.price) || 0,
        spots:     parseInt(form.spots)   || 0,
        spotsLeft: parseInt(form.spotsLeft) || parseInt(form.spots) || 0,
        images, includes, metadata,
        startDate: form.startDate || null,
        endDate:   form.endDate   || null,
      };
      const url    = retreat ? `/api/admin/retreats/${retreat.id}` : "/api/admin/retreats";
      const method = retreat ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data   = await res.json();
      if (data.success) { router.push("/dashboard/admin/retreats"); router.refresh(); }
      else setError(data.error || "Save failed.");
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  }

  const ic = "w-full bg-jungle-950/60 border border-jungle-800/60 focus:border-jungle-500 text-white placeholder-gray-600 px-4 py-3 rounded-xl outline-none transition text-sm";
  const lc = "block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5";

  return (
    <div className="flex flex-col gap-8">

      <div className="glass rounded-2xl p-6 border border-jungle-900/50">
        <h2 className="font-bold text-white mb-5">Basic Information</h2>
        <div className="flex flex-col gap-4">
          <div><label className={lc}>Retreat Name *</label><input className={ic} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Guatemala Wellness Retreat" /></div>
          <div><label className={lc}>Description</label><textarea className={`${ic} resize-none h-36`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the retreat experience, itinerary, what to expect…" /></div>
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className={lc}>Location</label><input className={ic} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Lake Atitlán" /></div>
            <div><label className={lc}>Country</label><input className={ic} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g. Guatemala" /></div>
            <div><label className={lc}>Duration</label><input className={ic} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 7 days" /></div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className={lc}>Price ($) *</label><input type="number" className={ic} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="1500" /></div>
            <div><label className={lc}>Total Spots</label><input type="number" className={ic} value={form.spots} onChange={(e) => setForm({ ...form, spots: e.target.value })} placeholder="20" /></div>
            <div><label className={lc}>Spots Remaining</label><input type="number" className={ic} value={form.spotsLeft} onChange={(e) => setForm({ ...form, spotsLeft: e.target.value })} placeholder="20" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={lc}>Start Date</label><input type="date" className={ic} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
            <div><label className={lc}>End Date</label><input type="date" className={ic} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-green-500" /> Active
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="w-4 h-4 accent-green-500" /> Spots Available
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" style={{ accentColor: "#c89f4f" }} /> Featured
            </label>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="glass rounded-2xl p-6 border border-jungle-900/50">
        <h2 className="font-bold text-white mb-5">Images</h2>
        <div className="flex gap-2 mb-3">
          <input className={`${ic} flex-1`} placeholder="Paste image URL…" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addImg()} />
          <button onClick={addImg} className="bg-jungle-700 hover:bg-jungle-600 text-white px-4 rounded-xl transition"><Plus className="w-4 h-4" /></button>
        </div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt="" className="w-20 h-20 object-cover rounded-xl border border-jungle-800/60"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/80x80/0f2913/4a9e52?text=?"; }} />
                <button onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* What's Included */}
      <div className="glass rounded-2xl p-6 border border-jungle-900/50">
        <h2 className="font-bold text-white mb-5">What's Included</h2>
        <div className="flex gap-2 mb-4">
          <input className={`${ic} flex-1`} placeholder="e.g. Accommodation, Meals, Guided Tours…" value={newItem}
            onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addInclude()} />
          <button onClick={addInclude} className="bg-jungle-700 hover:bg-jungle-600 text-white px-4 rounded-xl transition"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-col gap-2">
          {includes.map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-jungle-900/40 rounded-xl px-4 py-2.5">
              <span className="text-jungle-400 text-sm">✓</span>
              <span className="text-sm text-gray-200 flex-1">{item}</span>
              <button onClick={() => setIncludes(includes.filter((_, idx) => idx !== i))} className="text-gray-600 hover:text-red-400 transition"><X className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div className="glass rounded-2xl p-6 border border-jungle-900/50">
        <h2 className="font-bold text-white mb-2">Metadata (JSON)</h2>
        <textarea className={`${ic} font-mono h-24 resize-none`} value={form.metadata} onChange={(e) => setForm({ ...form, metadata: e.target.value })} placeholder='{"retreat_type":"wellness","level":"beginner"}' />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button onClick={submit} disabled={loading}
        className="flex items-center justify-center gap-2 bg-jungle-600 hover:bg-jungle-500 disabled:opacity-60 text-white font-semibold px-8 py-4 rounded-xl transition w-fit">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {retreat ? "Save Changes" : "Create Retreat"}
      </button>
    </div>
  );
}

```

## 61. `app/dashboard/admin/retreats/new/page.tsx`

```tsx
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import RetreatForm from "../RetreatForm";

export default async function NewRetreatPage() {
  if (!(await isAdmin())) redirect("/");
  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/admin/retreats" className="text-xs text-jungle-400 hover:text-jungle-300 mb-4 block">← Back to Retreats</Link>
        <h1 className="text-3xl font-bold text-white font-display mb-8">Add New Retreat</h1>
        <RetreatForm />
      </div>
    </div>
  );
}

```

## 62. `app/dashboard/admin/retreats/[id]/page.tsx`

```tsx
import { isAdmin } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import RetreatForm from "../RetreatForm";

export default async function EditRetreatPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/");
  const { id }  = await params;
  const retreat = await db.retreat.findUnique({ where: { id } });
  if (!retreat) notFound();
  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/admin/retreats" className="text-xs text-jungle-400 hover:text-jungle-300 mb-4 block">← Back to Retreats</Link>
        <h1 className="text-3xl font-bold text-white font-display mb-2">Edit Retreat</h1>
        <p className="text-gray-500 text-sm mb-8">{retreat.name}</p>
        <RetreatForm retreat={retreat} />
      </div>
    </div>
  );
}

```

## 63. `app/dashboard/admin/wholesale/page.tsx`

```tsx
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import WholesaleApplicationManager from "./WholesaleApplicationManager";

export default async function AdminWholesalePage() {
  if (!(await isAdmin())) redirect("/");
  const applications = await db.wholesaleApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard/admin" className="text-xs text-jungle-400 hover:text-jungle-300 mb-4 block">← Admin</Link>
        <h1 className="text-3xl font-bold text-white font-display mb-1">Wholesale Applications</h1>
        <p className="text-gray-500 text-sm mb-8">
          {applications.filter((a) => a.status === "PENDING").length} pending · {applications.length} total
        </p>
        <WholesaleApplicationManager applications={applications} />
      </div>
    </div>
  );
}

```

## 64. `app/dashboard/admin/wholesale/WholesaleApplicationManager.tsx`

```tsx
"use client";
import { useState } from "react";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Clock } from "lucide-react";

type App = { id: string; name: string; business: string; email: string; phone: string; message: string | null; status: string; createdAt: Date; user: { id: string } | null };

export default function WholesaleApplicationManager({ applications }: { applications: App[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter,   setFilter]   = useState("PENDING");
  const [loading,  setLoading]  = useState<string | null>(null);

  const filtered = applications.filter((a) => filter === "ALL" || a.status === filter);

  async function update(id: string, status: "APPROVED" | "REJECTED", userId?: string | null) {
    setLoading(id);
    const res  = await fetch(`/api/admin/wholesale/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, userId }) });
    const data = await res.json();
    if (data.success) window.location.reload();
    setLoading(null);
  }

  const STATUS: Record<string, string> = {
    PENDING:  "bg-amber-900/60 text-amber-300",
    APPROVED: "bg-emerald-900/60 text-emerald-300",
    REJECTED: "bg-red-900/60 text-red-400",
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2 flex-wrap">
        {["PENDING","APPROVED","REJECTED","ALL"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${filter === f ? "bg-jungle-600 text-white" : "bg-jungle-900/40 border border-jungle-800/40 text-gray-400 hover:text-white"}`}>
            {f} ({f === "ALL" ? applications.length : applications.filter((a) => a.status === f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center text-gray-500">No {filter.toLowerCase()} applications.</div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((app) => (
          <div key={app.id} className={`glass rounded-2xl border overflow-hidden ${app.status === "PENDING" ? "border-amber-warm/20" : "border-jungle-900/40"}`}
            style={app.status === "PENDING" ? { "--amber-warm": "#c89f4f" } as any : {}}>
            <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-jungle-950/40"
              onClick={() => setExpanded(expanded === app.id ? null : app.id)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-jungle-800/60 flex items-center justify-center text-lg font-bold text-jungle-300 shrink-0">
                  {app.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white">{app.name}</p>
                  <p className="text-xs text-gray-400">{app.business} · {app.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS[app.status]}`}>{app.status}</span>
                <span className="text-xs text-gray-600">{new Date(app.createdAt).toLocaleDateString()}</span>
                {expanded === app.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </div>
            </div>

            {expanded === app.id && (
              <div className="px-5 pb-5 border-t border-jungle-900/40 pt-4">
                <div className="grid md:grid-cols-2 gap-4 mb-5">
                  <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p><p className="text-sm text-white">{app.phone}</p></div>
                  <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p><p className="text-sm text-white">{app.email}</p></div>
                  {app.message && (
                    <div className="md:col-span-2"><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Message</p><p className="text-sm text-gray-300 leading-relaxed">{app.message}</p></div>
                  )}
                </div>
                {app.status === "PENDING" && (
                  <div className="flex gap-3">
                    <button onClick={() => update(app.id, "APPROVED", app.user?.id)} disabled={loading === app.id}
                      className="flex items-center gap-2 bg-emerald-800/60 hover:bg-emerald-700 border border-emerald-700/50 text-emerald-300 font-semibold px-5 py-2.5 rounded-xl transition text-sm disabled:opacity-60">
                      <CheckCircle className="w-4 h-4" /> Approve Access
                    </button>
                    <button onClick={() => update(app.id, "REJECTED", app.user?.id)} disabled={loading === app.id}
                      className="flex items-center gap-2 bg-red-950/60 hover:bg-red-900/60 border border-red-800/50 text-red-400 font-semibold px-5 py-2.5 rounded-xl transition text-sm disabled:opacity-60">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

```

## 65. `app/dashboard/admin/banner/page.tsx`

```tsx
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import BannerManager from "./BannerManager";

export default async function AdminBannerPage() {
  if (!(await isAdmin())) redirect("/");
  const banners = await db.banner.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/admin" className="text-xs text-jungle-400 hover:text-jungle-300 mb-4 block">← Admin</Link>
        <h1 className="text-3xl font-bold text-white font-display mb-2">Clearance Banner</h1>
        <p className="text-gray-500 text-sm mb-8">Manage the scrolling announcement banner shown at the top of every page.</p>
        <BannerManager banners={banners} />
      </div>
    </div>
  );
}

```

## 66. `app/dashboard/admin/banner/BannerManager.tsx`

```tsx
"use client";
import { useState } from "react";
import { Loader2, Plus, Trash2, Eye, EyeOff } from "lucide-react";

type Banner = { id: string; text: string; color: string; bgColor: string; active: boolean };

export default function BannerManager({ banners: initial }: { banners: Banner[] }) {
  const [banners, setBanners] = useState<Banner[]>(initial);
  const [text,    setText]    = useState("");
  const [color,   setColor]   = useState("#c89f4f");
  const [bgColor, setBgColor] = useState("#1a3a22");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function create() {
    if (!text.trim()) { setError("Banner text is required."); return; }
    setLoading(true); setError("");
    const res  = await fetch("/api/admin/banner", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, color, bgColor, active: true }) });
    const data = await res.json();
    if (data.success) { setBanners([data.banner, ...banners]); setText(""); }
    else setError(data.error || "Failed.");
    setLoading(false);
  }

  async function toggle(b: Banner) {
    const res  = await fetch("/api/admin/banner", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: b.id, active: !b.active }) });
    const data = await res.json();
    if (data.success) setBanners(banners.map((x) => x.id === b.id ? { ...x, active: !x.active } : x));
  }

  async function remove(id: string) {
    if (!confirm("Delete this banner?")) return;
    const res  = await fetch("/api/admin/banner", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const data = await res.json();
    if (data.success) setBanners(banners.filter((b) => b.id !== id));
  }

  const inputClass = "w-full bg-jungle-950/60 border border-jungle-800/60 focus:border-jungle-500 text-white placeholder-gray-600 px-4 py-3 rounded-xl outline-none transition text-sm";

  return (
    <div className="flex flex-col gap-6">
      {/* Preview */}
      {text && (
        <div className="overflow-hidden rounded-xl py-2 text-sm font-semibold tracking-wide" style={{ backgroundColor: bgColor, color }}>
          <div className="flex gap-8 whitespace-nowrap px-4">
            {Array(6).fill(null).map((_, i) => <span key={i}>✦ {text}</span>)}
          </div>
        </div>
      )}

      {/* Create */}
      <div className="glass rounded-2xl p-6 border border-jungle-900/50">
        <h2 className="font-bold text-white mb-5">Create New Banner</h2>
        <div className="flex flex-col gap-4">
          <textarea
            className={`${inputClass} resize-none h-20`}
            placeholder="e.g. 🌿 SUMMER SALE — 20% off all herbs this week only! Free shipping on orders over $75."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Text Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-jungle-800/60 bg-transparent cursor-pointer" />
                <input className={inputClass} value={color} onChange={(e) => setColor(e.target.value)} placeholder="#c89f4f" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Background Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-jungle-800/60 bg-transparent cursor-pointer" />
                <input className={inputClass} value={bgColor} onChange={(e) => setBgColor(e.target.value)} placeholder="#1a3a22" />
              </div>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button onClick={create} disabled={loading}
            className="flex items-center justify-center gap-2 bg-jungle-600 hover:bg-jungle-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Create Banner
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {banners.length === 0 && (
          <div className="glass rounded-2xl p-8 text-center text-gray-500">No banners yet.</div>
        )}
        {banners.map((b) => (
          <div key={b.id} className={`glass rounded-2xl border p-5 flex items-center gap-4 ${b.active ? "border-jungle-600/40" : "border-jungle-900/40 opacity-60"}`}>
            <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: b.color, boxShadow: `0 0 8px ${b.color}` }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{b.text}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${b.active ? "bg-jungle-900/60 text-jungle-300" : "bg-gray-800 text-gray-500"}`}>
                  {b.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggle(b)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-jungle-800/60 transition">
                {b.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => remove(b.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/40 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

```

## 67. `app/dashboard/wholesale/page.tsx`

```tsx
import { getCurrentDbUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { syncUser } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Lock, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import WholesaleOrderButton from "./WholesaleOrderButton";

const HONEY_CATALOG = [
  { name: "Melipona Beechi",          region: "Guatemala", emoji: "🍯", priceNoLabel: 450,  priceLabeled: 660,  halfLiterNoLabel: 240, halfLiterLabeled: 360, desc: "Native to Mesoamerica. Rich fruity flavors — peach, maracuya, hibiscus. Known as Xunan Kab. Anti-diabetic, anti-inflammatory, neuroprotective." },
  { name: "Melipona Yucatanica",       region: "Guatemala", emoji: "🍯", priceNoLabel: 650,  priceLabeled: 850,  halfLiterNoLabel: 350, halfLiterLabeled: 460, desc: "White honey — clear, crystalline appearance. Spiced notes of cinnamon, nutmeg, apricot. Best variety for eye applications due to its light color." },
  { name: "Scaptotrigona Mexicana",    region: "Guatemala", emoji: "🍯", priceNoLabel: 650,  priceLabeled: 850,  halfLiterNoLabel: 350, halfLiterLabeled: 460, desc: "Unique floral taste with a hint of sourness. Can be used as a sweetener, in jams, orally, or directly in the eyes." },
  { name: "Cephalotrigona Zexmeniae",  region: "Guatemala", emoji: "🍯", priceNoLabel: 900,  priceLabeled: 1150, halfLiterNoLabel: 480, halfLiterLabeled: 620, desc: "Extremely rare. Only active hives in Guatemala. Higher antioxidant and anti-inflammatory properties. Orange/gold color." },
  { name: "Tetragonisca Angustula",    region: "Guatemala", emoji: "🍯", priceNoLabel: 500,  priceLabeled: 720,  halfLiterNoLabel: 280, halfLiterLabeled: 400, desc: "Produces very little honey — once a year only. Fragile bee, difficult to maintain. Meliponini family. Small batch, artisan quality." },
];

export default async function WholesaleDashboard() {
  await syncUser();
  const user = await getCurrentDbUser();
  if (!user) redirect("/sign-in");

  const isApproved = user.role === "WHOLESALE" || user.role === "ADMIN";
  const application = await db.wholesaleApplication.findUnique({ where: { userId: user.id } });
  const isPending  = application?.status === "PENDING";

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-jungle-400 text-sm font-semibold uppercase tracking-widest mb-2">Wholesale Dashboard</p>
          <h1 className="text-4xl font-bold text-white font-display">
            {isApproved ? `Welcome back, ${user.name?.split(" ")[0] || "Partner"}` : "Wholesale Access"}
          </h1>
          {isApproved && (
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Approved Wholesale Partner</span>
            </div>
          )}
        </div>

        {/* Pending state */}
        {!isApproved && isPending && (
          <div className="max-w-lg glass rounded-2xl p-8 border border-amber-warm/20 flex flex-col items-center text-center gap-4 mb-10"
            style={{ "--amber-warm": "#c89f4f" } as any}>
            <Clock className="w-12 h-12 text-amber-warm" style={{ color: "#c89f4f" }} />
            <h2 className="text-xl font-bold text-white">Application Under Review</h2>
            <p className="text-gray-400 text-sm">Your wholesale application has been received and is pending admin approval. You'll receive an email once approved.</p>
          </div>
        )}

        {/* Not applied */}
        {!isApproved && !application && (
          <div className="max-w-lg glass rounded-2xl p-8 border border-jungle-900/50 flex flex-col items-center text-center gap-4 mb-10">
            <Lock className="w-12 h-12 text-jungle-500" />
            <h2 className="text-xl font-bold text-white">Apply for Wholesale Access</h2>
            <p className="text-gray-400 text-sm">Submit an application to unlock wholesale pricing and bulk ordering.</p>
            <Link href="/wholesale" className="bg-jungle-600 hover:bg-jungle-500 text-white font-semibold px-6 py-3 rounded-xl transition">
              Apply Now →
            </Link>
          </div>
        )}

        {/* Catalog — blurred if not approved */}
        <div className="relative">
          <div className={isApproved ? "" : "blur-lock select-none"}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white font-display mb-1">Melipona Stingless Bee Honey</h2>
              <p className="text-gray-400 text-sm">Liter pricing · Half-liter available · With or without custom labeling · Prices may vary by quantity</p>
            </div>

            <div className="flex flex-col gap-6">
              {HONEY_CATALOG.map((honey) => (
                <div key={honey.name} className="glass rounded-2xl border border-amber-warm/10 overflow-hidden"
                  style={{ "--amber-warm": "#c89f4f" } as any}>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-3xl">{honey.emoji}</span>
                          <div>
                            <h3 className="font-bold text-white text-lg">{honey.name}</h3>
                            <p className="text-xs text-jungle-400 flex items-center gap-1">🇬🇹 {honey.region}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{honey.desc}</p>
                      </div>

                      <div className="md:w-80 shrink-0">
                        <div className="bg-jungle-950/60 rounded-xl overflow-hidden border border-jungle-900/40">
                          <div className="grid grid-cols-3 text-xs uppercase tracking-wider text-gray-500 font-semibold px-4 py-2.5 border-b border-jungle-900/40">
                            <span>Size</span><span className="text-center">No Label</span><span className="text-right">With Label</span>
                          </div>
                          {[
                            { size: "½ Liter", noLabel: honey.halfLiterNoLabel, labeled: honey.halfLiterLabeled },
                            { size: "1 Liter",  noLabel: honey.priceNoLabel,    labeled: honey.priceLabeled    },
                          ].map((row) => (
                            <div key={row.size} className="grid grid-cols-3 px-4 py-3 border-b border-jungle-900/30 last:border-0 hover:bg-jungle-900/20 transition">
                              <span className="text-sm text-white font-medium">{row.size}</span>
                              <span className="text-center text-sm font-bold" style={{ color: "#c89f4f" }}>{formatPrice(row.noLabel)}</span>
                              <span className="text-right text-sm font-bold" style={{ color: "#c89f4f" }}>{formatPrice(row.labeled)}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 mt-2 text-right">Bulk discounts available · Contact for large orders</p>

                        {isApproved && (
                          <div className="mt-3 flex gap-2">
                            <WholesaleOrderButton honeyName={honey.name} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 glass rounded-2xl p-6 border border-jungle-900/50">
              <h3 className="font-bold text-white mb-2">Ordering Information</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
                <div><p className="text-jungle-300 font-semibold mb-1">Minimum Orders</p><p>No minimum quantity. Half-liter and full-liter options available.</p></div>
                <div><p className="text-jungle-300 font-semibold mb-1">Custom Labeling</p><p>Labels designed and applied in Guatemala before shipping. Additional lead time may apply.</p></div>
                <div><p className="text-jungle-300 font-semibold mb-1">Shipping</p><p>Wholesale orders ship from Guatemala. Contact us to discuss freight and customs.</p></div>
                <div><p className="text-jungle-300 font-semibold mb-1">Questions?</p>
                  <p>Reach us on <a href="https://www.instagram.com/herbcom_" target="_blank" rel="noopener noreferrer" className="text-jungle-300 hover:text-white transition">Instagram</a> or <a href="https://www.facebook.com/share/1Fry7QcUcm/" target="_blank" rel="noopener noreferrer" className="text-jungle-300 hover:text-white transition">Facebook</a>.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lock overlay for non-approved */}
          {!isApproved && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4 text-center border max-w-sm pointer-events-auto"
                style={{ borderColor: "rgba(200,159,79,0.3)" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center border" style={{ background: "rgba(200,159,79,0.1)", borderColor: "rgba(200,159,79,0.3)" }}>
                  <Lock className="w-8 h-8" style={{ color: "#c89f4f" }} />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Wholesale Access Locked</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {isPending ? "Your application is pending admin approval." : "Apply for wholesale access to view pricing."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

```

## 68. `app/dashboard/wholesale/WholesaleOrderButton.tsx`

```tsx
"use client";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

export default function WholesaleOrderButton({ honeyName }: { honeyName: string }) {
  const [open, setOpen] = useState(false);
  const msg = encodeURIComponent(`Hi, I'm interested in placing a wholesale order for ${honeyName}. Can you provide more details on availability and shipping?`);

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-jungle-800/60 hover:bg-jungle-700 border border-jungle-700/50 text-jungle-300 py-2 rounded-xl transition">
        <MessageSquare className="w-3.5 h-3.5" /> Inquire
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
          <div className="glass rounded-2xl p-6 max-w-sm w-full border border-jungle-700/50" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-white mb-3">Order Inquiry — {honeyName}</h3>
            <p className="text-sm text-gray-400 mb-5">Contact us via Instagram or Facebook to place a wholesale order.</p>
            <div className="flex flex-col gap-3">
              <a href={`https://www.instagram.com/herbcom_`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl transition hover:opacity-90">
                📸 Message on Instagram
              </a>
              <a href={`https://www.facebook.com/share/1Fry7QcUcm/`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition">
                👍 Message on Facebook
              </a>
            </div>
            <button onClick={() => setOpen(false)} className="mt-4 w-full text-sm text-gray-500 hover:text-gray-300 transition">Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

```
