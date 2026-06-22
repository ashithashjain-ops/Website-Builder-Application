# Stackly

Stackly is a website builder app. Users can create projects, choose templates, edit pages in a drag-and-drop builder, export HTML, and later publish sites online.

The project has two parts:

- `app/`, `components/`, `store/`, `lib/`: Next.js frontend.
- `backend/`: Express + MongoDB API.

For the full pending work list, see `stackly_project_context.md`.

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS, Zustand.
- Builder: dnd-kit, custom builder components, local project/design stores.
- Backend: Node.js, Express, MongoDB, JWT auth.
- Payments: Razorpay first, Stripe optional.
- Deploy target: static frontend plus separate backend API.

## Requirements

- Node.js installed.
- npm installed.
- MongoDB connection string for real backend flows.

## Setup

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create backend env file:

```bash
copy .env.example .env
```

Then fill the important values in `backend/.env`:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- SMTP values if email OTP should send real emails.
- Razorpay values if payments should work.
- Google OAuth values if Google sign-in should work.

## Run Locally

Run frontend only:

```bash
npm run dev:next
```

Run backend only:

```bash
npm run backend
```

Run frontend and backend together:

```bash
npm run dev:full
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

## Useful Scripts

```bash
npm run dev:next      # Start frontend only
npm run backend       # Start backend only
npm run dev:full      # Start frontend + backend
npm run build         # Build frontend static export
npm run lint          # Run ESLint
npm run deploy        # Build and deploy frontend output to GitHub Pages
```

Backend scripts:

```bash
cd backend
npm start             # Start backend
npm run dev           # Start backend with watch mode
npm run test:email    # Send test email using SMTP config
```

## Project Structure

```text
app/                  Next.js pages and layouts
components/           UI, dashboard, builder, analytics, asset components
components/builder/   Main website builder UI
components/draggable/ Builder-rendered blocks
lib/                  API clients, export logic, helpers
store/                Zustand stores
types/                TypeScript types
backend/              Express API server
backend/src/          Backend routes, controllers, models, services
backend/docs/         API docs and Postman collection
public/               Static images and icons
```

## Current Status

Already completed:

- Website builder UI.
- Dashboard UI.
- Auth pages.
- SEO export support.
- Responsive builder style overrides.
- BlockSpec migration.
- Starter templates for all main categories.
- Local project, asset, and analytics storage.

Still pending:

- Finish backend foundation and production configuration.
- Connect auth pages to persistent backend sessions.
- Replace project `localStorage` with MongoDB API.
- Save builder state to backend.
- Replace IndexedDB assets with cloud uploads.
- Add publishing, deployment history, live site links, and custom domains.
- Connect analytics to real backend data.
- Add subscription management and premium feature gates.

## API Docs

- Backend API reference: `backend/docs/API.md`
- Postman collection: `backend/docs/POSTMAN_COLLECTION.json`

## Notes

- The frontend is configured as a static export, so all backend calls happen from the browser.
- Keep CORS configured for the frontend domain.
- Do not commit real `.env` secrets.
- Use `stackly_project_context.md` as the main planning file.
