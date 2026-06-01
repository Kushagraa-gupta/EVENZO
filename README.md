# Evenzo

**Your gateway to every experience**

A full-stack event booking platform built with the MERN stack — MongoDB, Express.js, React (Vite), and Node.js.

## Features

- **Attendees** — Browse events, book free/paid tickets, QR digital tickets, cancel bookings
- **Organizers** — Create multi-step events, manage ticket types, view bookings, QR check-in scanner, analytics
- **Admins** — Platform stats, user management, organizer approvals, refunds
- **Payments** — Stripe Checkout (INR) with webhook confirmation
- **Emails** — Welcome, booking confirmation, cancellation, organizer approval/rejection
- **Security** — JWT httpOnly cookies, refresh token rotation, rate limiting, helmet, CORS, Zod validation

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Tailwind CSS, React Router, TanStack Query, Framer Motion, Recharts, React Hook Form, Zod |
| Backend | Node.js, Express, Mongoose, JWT, Stripe, Nodemailer, Cloudinary, QR codes |
| Database | MongoDB Atlas / local MongoDB |

## Project Structure

```
evenzo/
├── client/     # React frontend (Vite)
├── server/     # Express API
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (for paid events)
- Cloudinary account (optional, for image uploads)
- Gmail SMTP (optional, for emails)

### 1. Clone & Install

```bash
cd "project evenzo"
cd server && npm install
cd ../client && npm install
```

### 2. Environment Variables

**server/.env**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/evenzo
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=noreply@evenzo.com
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Seed Database

```bash
cd server
npm run seed
```

**Test accounts** (password: `password123`):
| Role | Email |
|------|-------|
| Admin | admin@evenzo.com |
| Organizer | organizer@evenzo.com |
| Attendee | attendee@evenzo.com |

### 4. Run Development Servers

**One command (recommended)** — from project root:

```bash
npm install          # installs concurrently at root
npm run install:all  # server + client deps
npm run dev          # starts API + frontend together
```

**Or separately:**

```bash
# Terminal 1 — API
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5001 (default; use 5001 if 5000 is taken)

### Stripe Webhook (local)

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in server/.env.

## API Routes

| Prefix | Description |
|--------|-------------|
| `/api/auth` | Register, login, logout, profile, password reset |
| `/api/events` | Event CRUD, filters, organizer events |
| `/api/bookings` | Bookings, cancel, check-in |
| `/api/payments` | Stripe checkout, webhook, refunds |
| `/api/upload` | Cloudinary image upload |
| `/api/admin` | Admin panel APIs |

## Deployment

### Frontend (Vercel)
1. Connect repo, set root to `client`
2. Build: `npm run build`, Output: `dist`
3. Add `VITE_API_URL` and `VITE_STRIPE_PUBLISHABLE_KEY` env vars

### Backend (Railway)
1. Deploy `server` directory
2. Add all server `.env` variables
3. Set `CLIENT_URL` to your Vercel URL
4. Configure Stripe webhook to `https://your-api.railway.app/api/payments/webhook`

### MongoDB Atlas
1. Create cluster at mongodb.com/atlas
2. Add connection string to `MONGO_URI`

## License

MIT
