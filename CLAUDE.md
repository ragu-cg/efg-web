# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build static export (outputs to /out/)
npm run start    # Start production server
npm run lint     # Run ESLint
```

```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report (threshold: 80%)
```

Tests live in `__tests__/` mirroring the source structure. Jest 30 + React Testing Library. Config in `jest.config.js` (CommonJS). Coverage collected from `lib/htmlUtils.ts`, `pages/api/contact.ts`, `pages/api/booking.ts`, `pages/contact.tsx`.

## Architecture

This is a **Next.js 13 static site** (Pages Router, not App Router) for EFG Training Services — a course/training company in Singapore. The site is fully static for speed and security. Course content was previously fetched from WordPress GraphQL at build time; it is now stored in local JSON files so the build has no WordPress dependency. For course booking, there is an internal ASP-based system that exposes an API.

### Key architectural decisions

- **Static export**: `next.config.js` sets `output: "export"`, so all pages are pre-rendered to HTML in `/out/`. There is no ISR or server-side rendering in production. API routes (`/api/booking`, `/api/contact`) exist for email sending but only work in dev/build; they are not part of the static export.
- **TypeScript build errors are ignored**: `ignoreBuildErrors: true` in `next.config.js`. The project builds even with TS errors.
- **Data sources**: All course data is now served from local JSON files in `/public/jsons/` — no WordPress calls at build time. `lib/api.ts` still exists but is no longer used by any page. External APIs at `efgtrainingservices.com` handle course schedules and bookings (called client-side at runtime).
- **HTML security**: All user-facing fields passed to Nodemailer are escaped via `lib/htmlUtils.ts` (`escapeHtml`). WordPress HTML content rendered via `dangerouslySetInnerHTML` is sanitized with `sanitize-html` allowlist in `pages/courses/[slug].tsx`.

### Data flow

1. `/public/jsons/course-details.json` — flat slug-keyed map of all 27 courses with full detail (title, content, fees, duration, language, featuredImage, applicationForm, `courseID`). This is the single source of truth for course pages. To add or update a course, edit this file.
2. `pages/courses/[slug].tsx` — `getStaticPaths` reads slug keys from `course-details.json`; `getStaticProps` looks up by slug. No network calls at build time.
3. `/public/jsons/*.json` — static data for nav links (`data.json`), footer (`footer.json`, `footer-full.json`), and the booking form (`booking.json`).
4. Schedule API (`NEXT_PUBLIC_COURSE_SCHEDULE_API_URL`) and booking API (`NEXT_PUBLIC_COURSE_BOOKING_API_URL`) are called client-side at runtime from `schedule.tsx`, `schedule/[courseId].tsx`, and `booking.tsx`.

### courseID mapping

7 of the 27 courses have a `courseID` field in `course-details.json` that maps to the schedule/booking API. The remaining 20 have no schedule data yet. When `courseID` is present, "Register now" links to `/schedule/:courseID` (filtered view); otherwise it falls back to `/schedule` (all courses).

### Routing

```
pages/index.tsx              → /
pages/courses.tsx            → /courses
pages/courses/[slug].tsx     → /courses/:slug  (SSG with getStaticPaths)
pages/booking.tsx            → /booking
pages/contact.tsx            → /contact
pages/schedule.tsx           → /schedule        (all courses, client-side schedule API)
pages/schedule/[courseId].tsx → /schedule/:id   (single course schedule, e.g. /schedule/PWCSO)
pages/api/booking.ts         → /api/booking   (Nodemailer, dev only)
pages/api/contact.ts         → /api/contact   (Nodemailer, dev only)
```

### Styling

Uses a mix of **Mantine v5** (CSS-in-JS via `createStyles()`) and **SCSS modules**. Dark/light mode is handled by Mantine's `ColorSchemeProvider` in `pages/_app.tsx`, with the preference persisted via `cookies-next`.

### Layout

`layouts/layout.tsx` wraps all pages with the navbar and footer. Applied globally in `pages/_app.tsx`.

## Environment Variables

Required in `.env.local`:

- `WORDPRESS_API_URL` — WordPress GraphQL endpoint (only needed if re-fetching course data to update JSONs; not used at build time)
- `NEXT_PUBLIC_COURSE_SCHEDULE_API_URL` — External schedule API (POST with `reqdate=YYYY-MM-DD`)
- `NEXT_PUBLIC_COURSE_BOOKING_API_URL` — External booking API
- Gmail SMTP credentials for Nodemailer (contact/booking emails)
