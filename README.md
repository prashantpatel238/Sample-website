# smart-kirana-store

Production-ready Kirana Shop eCommerce web app built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **MongoDB + Mongoose**, **NextAuth JWT**, **Razorpay**, and **Redux Toolkit**.

## Features

- JWT based auth with admin/customer roles and protected routes
- Homepage with hero, featured products, categories, offers, testimonials
- Product catalog: search, category filter, price sort, detail pages
- Admin product CRUD and stock management
- Cart with Redux Toolkit + localStorage persistence
- Checkout with address capture + Razorpay/COD
- Order history for users, order status workflow, admin order updates
- Admin dashboard stats (users/orders/revenue)
- SEO metadata + product JSON-LD schema + sitemap API
- Responsive green/white grocery UI, sticky header, toast notifications

## Project Structure

```txt
/app
  /api
  /admin
  /products
  /cart
  /checkout
  /orders
/components
/lib
/models
/store
/utils
/types
/scripts
```

## Environment Setup

1. Copy env template:

```bash
cp .env.example .env.local
```

2. Configure variables:

- `MONGODB_URI` - Mongo connection string
- `NEXTAUTH_SECRET` - long random secret for JWT signing
- `NEXTAUTH_URL` - app URL (e.g. `http://localhost:3000`)
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

## Installation & Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Seed Sample Data

Option A: script

```bash
npm run seed
```

Option B: API route (when app is running)

```bash
curl -X POST http://localhost:3000/api/seed
```

Creates:
- Admin user: `admin@smartkirana.store` / `Admin@123`
- Sample products

## API Overview

- `POST /api/register`
- `GET, POST /api/products`
- `GET /api/orders` (auth)
- `POST /api/checkout` (auth)
- `POST /api/razorpay/order` (auth)
- `GET /api/admin/stats` (admin)
- `PUT, DELETE /api/admin/products/:id` (admin)
- `PATCH /api/admin/orders/:id` (admin)
- `GET /api/sitemap`
- `POST /api/seed`

## Production Notes

- Use managed MongoDB with IP allowlist + credentials security.
- Keep `.env.local` secret and never commit it.
- Configure Razorpay webhook verification in production (optional extension).
- Deploy on Vercel or Node runtime with env variables configured.
