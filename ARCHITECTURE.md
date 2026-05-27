# ReuniteRC Architecture

## Overview

ReuniteRC is a Next.js App Router application designed for Vercel deployment, Supabase-backed persistence and offline-resilient case capture. The first prototype uses seeded fictional demo data behind stable service interfaces. Supabase adapters can replace or augment demo repositories without rewriting product UI.

## Layered Architecture

Presentation layer:

- Next.js App Router routes.
- React Server Components where useful.
- Client components for forms, QR rendering, scanner entry, offline status and sync controls.
- Tailwind CSS and shadcn/ui-compatible primitives.

Application service layer:

- case submission use cases;
- SafeCard registration and token lookup;
- assisted match computation;
- handover recording;
- PA escalation;
- dashboard metrics;
- offline sync orchestration.

Domain layer:

- typed entities and value objects;
- case status transitions;
- rule-based match scoring;
- role permissions;
- audit event definitions.

Repository layer:

- demo-data adapter for immediate prototype use;
- offline queue adapter backed by IndexedDB/Dexie;
- Supabase adapter for PostgreSQL persistence;
- shared repository interfaces for testability.

Infrastructure layer:

- Supabase client setup;
- Supabase Auth session handling;
- IndexedDB schema and sync queue;
- server actions or REST route handlers;
- deployment and environment configuration.

## Technology Stack

- Next.js App Router.
- TypeScript with strict mode.
- Tailwind CSS.
- shadcn/ui-compatible components.
- Lucide React icons.
- Supabase PostgreSQL for persistence.
- Supabase Auth for staff authentication and role-aware access.
- Dexie-backed IndexedDB queue for offline mutations.
- qrcode.react for secure token QR rendering.
- Vercel for deployment.
- npm package manager.

## Authentication And Authorisation

Supabase Auth is the planned identity provider. Staff accounts authenticate through Supabase. Staff profile records map authenticated users to application roles.

Planned roles:

- `information_bureau_coordinator`;
- `helppoint_volunteer`;
- `leadership_viewer`;
- `guardian_group_leader`.

Authorisation principles:

- Coordinator can view operational case details, confirm matches, approve handovers and escalate to PA.
- Volunteer can create cases and view limited case status needed for assigned workflows.
- Leadership viewer receives read-only anonymised metrics and hotspot data.
- Guardian/group leader has SafeCard registration only and no staff dashboard access.

Supabase Row Level Security should enforce role boundaries at the database layer. Application services should also check role permissions before performing sensitive actions.

## Offline-First Approach

The prototype must support real offline-style capture:

- A local connectivity state can be toggled to simulate degraded conditions.
- Mutations that cannot be sent immediately are written to IndexedDB.
- Each queued operation stores operation type, payload, client timestamp, actor role, idempotency key and sync status.
- When connectivity is restored, the sync service replays queued operations through the same application service contracts.
- Sync results update local operation records and create audit entries.

Conflict handling:

- Use server-generated canonical IDs for synced records.
- Use client-generated idempotency keys to prevent duplicate case creation.
- Prefer append-only audit logs for critical events.
- Do not allow offline handover closure unless the verification step can be recorded and later reconciled.

## Data Security Approach

- SafeCard QR codes encode only secure random tokens.
- Sensitive details remain in authorised staff views.
- Leadership views should aggregate or anonymise case data.
- Avoid storing phone numbers or direct identifiers in demo QR content.
- Use HTTPS in deployment.
- Store Supabase keys in environment variables.
- Use Supabase RLS policies for table access.
- Keep audit logs for critical state transitions.
- Use privacy-conscious PA announcement content.
- Do not implement facial recognition.

## Deployment Approach

Target deployment platform: Vercel.

Deployment expectations:

- `npm run build` must pass.
- Environment variables are configured in Vercel project settings.
- Supabase project URL and anon key are provided through environment variables.
- Database migrations live under a future `supabase/migrations` directory.
- Seeded fictional data can be loaded for demo environments.

## Integration Assumptions

- Information Bureau staff operate the coordinator dashboard.
- HelpPoints are authorised points inside the event environment.
- PA announcement execution remains outside the app, but escalation status is tracked.
- Live Supabase credentials may not be available during early prototyping.
- Network availability may be unstable during large programmes.
- QR scanning can be represented initially by manual token entry, then enhanced with camera scanning if appropriate.
