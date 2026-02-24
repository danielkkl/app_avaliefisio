# Beyond Avaliação

## Overview

Beyond Avaliação is a SaaS web application for physiotherapists (fisioterapeutas) to create, manage, and track patient evaluation forms (fichas de avaliação fisioterapêutica). The application allows clinicians to document comprehensive patient assessments including identification, vital signs, anthropometric measurements, pain evaluation (EVA scale), range of motion, muscle strength, and treatment strategies.

The app follows a freemium model with plans for Stripe payment integration and features a dashboard with statistics, a list view of evaluations, detailed evaluation forms broken into tabbed sections, and individual evaluation detail views.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure

The project uses a single repository with three main directories:

- **`client/`** — React frontend (SPA)
- **`server/`** — Express.js backend API
- **`shared/`** — Shared types, schemas, and route definitions used by both client and server

There is also an `extracted_source/beyond-avaliacao/` directory containing reference documentation and an older version of the project (MySQL-based, tRPC-based). The active codebase uses PostgreSQL and REST APIs — ignore the extracted source for implementation decisions.

### Frontend Architecture

- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight client-side router)
- **State/Data Fetching**: TanStack React Query for server state management
- **Forms**: React Hook Form with Zod validation via `@hookform/resolvers`
- **UI Components**: shadcn/ui (New York style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (clinical blue/teal palette)
- **Build Tool**: Vite
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

The frontend has a protected route pattern — unauthenticated users see a landing page at `/login`, authenticated users get an `AppLayout` with a sidebar navigation. Pages include Dashboard, FichasList, FichaForm (create/edit), and FichaDetail.

### Backend Architecture

- **Framework**: Express.js with TypeScript, running on Node.js
- **Runtime**: `tsx` for development, esbuild for production bundling
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **Route Definitions**: Shared route contracts defined in `shared/routes.ts` with Zod schemas for input validation and response types
- **Authentication**: Replit Auth (OpenID Connect via Passport.js with session-based auth stored in PostgreSQL)
- **Session Store**: `connect-pg-simple` backed by the `sessions` table in PostgreSQL

The server uses a storage layer pattern (`IStorage` interface in `server/storage.ts`) with a `DatabaseStorage` implementation using Drizzle ORM.

### Database

- **Database**: PostgreSQL (required, provisioned via Replit)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-Zod conversion
- **Schema Location**: `shared/schema.ts` (main tables) and `shared/models/auth.ts` (auth tables)
- **Migrations**: Drizzle Kit with `drizzle-kit push` command (`npm run db:push`)

Key tables:
- **`users`** — User accounts (required for Replit Auth, uses varchar ID with `gen_random_uuid()`)
- **`sessions`** — Session storage (required for Replit Auth)
- **`fichas`** — Patient evaluation forms with extensive fields covering identification, habits, vital signs, pain assessment, range of motion, muscle strength, and treatment strategies
- **`user_plans`** — Subscription plan tracking (free/premium with Stripe fields)

### Authentication Flow

Authentication uses Replit Auth (OpenID Connect):
1. Users click login → redirected to `/api/login` → Replit OIDC flow
2. On callback, user is upserted into the `users` table
3. Sessions stored in PostgreSQL via `connect-pg-simple`
4. Protected routes use `isAuthenticated` middleware
5. Frontend checks auth state via `GET /api/auth/user`

### API Routes

All API routes are defined in `shared/routes.ts` with typed contracts:
- `GET /api/fichas` — List all evaluations
- `GET /api/fichas/:id` — Get single evaluation
- `POST /api/fichas` — Create evaluation
- `PUT /api/fichas/:id` — Update evaluation
- `DELETE /api/fichas/:id` — Delete evaluation
- `GET /api/auth/user` — Get current user
- `GET /api/login` — Initiate Replit Auth
- `GET /api/logout` — Logout

### Build System

- **Development**: Vite dev server with HMR proxied through Express
- **Production Build**: Vite builds frontend to `dist/public/`, esbuild bundles server to `dist/index.cjs`
- **Build Script**: Custom `script/build.ts` handles both client and server builds with dependency allowlisting for bundling

## External Dependencies

### Required Services
- **PostgreSQL Database** — Primary data store (provisioned via Replit, connection via `DATABASE_URL` env var)
- **Replit Auth** — OpenID Connect authentication (requires `REPL_ID`, `ISSUER_URL`, `SESSION_SECRET` env vars)

### Planned/Partial Integrations
- **Stripe** — Payment processing for premium subscriptions (infrastructure exists in schema with `user_plans` table; build script bundles Stripe)
- **Google Drive** — PDF storage for premium users (referenced in extracted source documentation)

### Key NPM Packages
- `drizzle-orm` + `drizzle-kit` — Database ORM and migration tooling
- `express` + `express-session` — HTTP server and session management
- `passport` — Authentication middleware
- `openid-client` — OpenID Connect client for Replit Auth
- `zod` — Runtime schema validation (shared between client and server)
- `@tanstack/react-query` — Client-side data fetching
- `react-hook-form` — Form state management
- `date-fns` — Date formatting (Portuguese locale support)
- `wouter` — Client-side routing
- shadcn/ui ecosystem (Radix UI, Tailwind CSS, class-variance-authority, clsx, tailwind-merge)