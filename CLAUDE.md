# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build static export (outputs to /out/)
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

This is a **Next.js 13 static site** (Pages Router, not App Router) for EFG Training Services — a course/training company in Singapore. I wanted to have a static site for speed and security. So created a wordpress site separately and used a graphql api to fetch data from it. For course booking, i have internal ASP based sytem which exposes a API to read the booking details and data.

### Key architectural decisions

- **Static export**: `next.config.js` sets `output: "export"`, so all pages are pre-rendered to HTML in `/out/`. There is no ISR or server-side rendering in production. API routes (`/api/booking`, `/api/contact`) exist for email sending but only work in dev/build; they are not part of the static export.
- **TypeScript build errors are ignored**: `ignoreBuildErrors: true` in `next.config.js`. The project builds even with TS errors.
- **Data sources**: Course content comes from a WordPress GraphQL API (URL in `.env.local` as `WORDPRESS_API_URL`). Static JSON files in `/public/jsons/` cache navigation, footer, and course listing data. External APIs at `efgtrainingservices.com` handle course schedules and bookings.

### Data flow

1. `/lib/api.ts` — GraphQL queries to WordPress (courses, featured posts, course details by slug)
2. Page `getStaticProps()` / `getStaticPaths()` calls these at build time to pre-render pages
3. `/public/jsons/*.json` — static data for nav links, footer, and course listings
4. External booking/schedule APIs are called client-side from `booking.tsx` and `schedule.tsx`

### Routing

```
pages/index.tsx              → /
pages/courses.tsx            → /courses
pages/courses/[slug].tsx     → /courses/:slug  (SSG with getStaticPaths)
pages/booking.tsx            → /booking
pages/contact.tsx            → /contact
pages/api/booking.js         → /api/booking   (Nodemailer, dev only)
pages/api/contact.js         → /api/contact   (Nodemailer, dev only)
```

### Styling

Uses a mix of **Mantine v5** (CSS-in-JS via `createStyles()`) and **SCSS modules**. Dark/light mode is handled by Mantine's `ColorSchemeProvider` in `pages/_app.tsx`, with the preference persisted via `cookies-next`.

### Layout

`layouts/layout.tsx` wraps all pages with the navbar and footer. Applied globally in `pages/_app.tsx`.

## Environment Variables

Required in `.env.local`:

- `WORDPRESS_API_URL` — WordPress GraphQL endpoint
- `NEXT_PUBLIC_COURSE_SCHEDULE_API_URL` — External schedule API
- `NEXT_PUBLIC_COURSE_BOOKING_API_URL` — External booking API
- Gmail SMTP credentials for Nodemailer (contact/booking emails)
