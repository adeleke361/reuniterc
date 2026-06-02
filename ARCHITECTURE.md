# ReuniteRC Architecture

## Overview

ReuniteRC is a Next.js App Router application designed for Vercel deployment, Supabase-backed persistence and offline-resilient staff case capture. The first prototype uses seeded fictional demo data behind stable service interfaces. Supabase adapters can replace or augment demo repositories without rewriting product UI.

ReuniteRC is a digital support layer for the existing Information Bureau process. Official Reunite Points provide online reporting entry points and physical fallback instructions.

## Locked Architecture Decisions

- Supabase access uses a hybrid pattern. Authenticated workflow mutations should use server actions when the Supabase adapter is added. Sync/API-style operations may use route handlers where appropriate.
- Reunite Point QR codes identify the official reporting URL and reporting location context. They must not contain names, phone numbers or sensitive case data.
- A Reunite Point identifies a reporting location, not a person.
- Offline mode may capture new looking-for-person reports, found-person reports, lost-item reports, found-item reports and draft PA escalation requests when authorised staff already loaded the app.
- Match confirmation, person handover, item release and final closure require connected Information Bureau workflow.
- Demo analytics use service-layer aggregation. Production may add secured database views for aggregate leadership reporting.
- Initial prototype sessions may be clearly labelled fictional demo role sessions. The architecture remains prepared for Supabase Auth and Row Level Security.
- The Stage 2 prototype keeps connectivity software-only and does not add separate connectivity equipment to the scope.

## Layered Architecture

Presentation layer:

- Next.js App Router routes.
- React Server Components where useful.
- Client components for forms, Reunite Point context, offline status and sync controls.
- Tailwind CSS and shadcn/ui-compatible primitives.

Application service layer:

- Reunite Point listing;
- person report submission;
- item report submission;
- person match computation;
- item match computation;
- match decision handling;
- person handover recording;
- item release recording;
- PA escalation;
- dashboard metrics;
- offline sync orchestration.

Domain layer:

- typed entities and value objects;
- person case status transitions;
- item case status transitions;
- rule-based person match scoring;
- rule-based item match scoring;
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
- server actions for authenticated workflow mutations;
- route handlers for sync/API-style operations where appropriate;
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
- qrcode.react for Reunite Point QR rendering.
- Vercel for deployment.
- npm package manager.

## Authentication And Authorisation

Supabase Auth is the planned identity provider. Staff accounts authenticate through Supabase. Actor profile records map authenticated users to application roles.

The initial prototype may use clearly labelled fictional demo role sessions so judges can exercise workflows without live Supabase credentials. Demo sessions must never be presented as production authentication.

Planned roles:

- `information_bureau_coordinator`;
- `helppoint_volunteer`;
- `leadership_viewer`;
- `public_reporter`.

Authorisation principles:

- Coordinator can view operational case details, confirm or reject matches, approve handovers, release items and escalate to PA.
- Volunteer can create reports and view limited case status needed for assigned Reunite Point workflows.
- Leadership viewer receives read-only aggregate metrics and hotspot data.
- Public reporter can submit reports only and has no staff dashboard access.

Supabase Row Level Security should enforce role boundaries at the database layer. Application services should also check role permissions before performing sensitive actions.

## Offline-First Approach

The prototype must support real offline-style staff capture:

- A local connectivity state can be toggled to simulate degraded conditions.
- New looking-for-person, found-person, lost-item and found-item reports that cannot be sent immediately are written to IndexedDB.
- Draft PA escalation requests may be queued offline.
- Each queued operation stores operation type, payload, client timestamp, actor role, idempotency key and sync status.
- When connectivity is restored, the sync service replays queued operations through the same application service contracts.
- Sync results update local operation records and create audit entries.

Safeguarding boundary:

- Match confirmation must require connected Information Bureau workflow.
- Person handover must require connected Information Bureau workflow.
- Item release must require connected proof-of-ownership workflow.
- Offline mode must not create conflicting or unsafe closure records.

No-internet physical fallback:

- If the QR form cannot load, the poster still displays a Point Code.
- The person reports the Point Code to an official volunteer, usher, security point or Information Bureau.
- PA/public-announcement process remains the trusted fallback for urgent or unresolved cases.

Conflict handling:

- Use server-generated canonical IDs for synced records.
- Use client-generated idempotency keys to prevent duplicate case creation.
- Prefer append-only audit logs for critical events.
- Do not allow offline handover or release closure.

## Data Security Approach

- Reunite Point QR content must not contain personal details.
- Sensitive details remain in authorised staff views.
- Leadership views must aggregate case data.
- Hidden item verification details are staff-only.
- Do not expose direct public contact between claimant and finder.
- Use HTTPS in deployment.
- Store Supabase keys in environment variables.
- Use Supabase RLS policies for table access.
- Keep audit logs for critical state transitions.
- Use privacy-conscious PA announcement content.
- Do not implement facial recognition.
- Include official branding, visible short URL, Point Code and tamper-check guidance on Reunite Points.

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
- HelpPoint volunteers are authorised staff inside the event environment.
- PA announcement execution remains outside the app, but escalation status is tracked.
- Live Supabase credentials may not be available during early prototyping.
- Network availability may be unstable during large programmes.
- Public digital reporting requires internet if the form has not already loaded.

## Phase 1B Concept Alignment Kernel

Phase 1B aligns the typed domain and service kernel with the Reunite Point recovery model:

- strict TypeScript entities for events, Reunite Points, actor profiles, person cases, item cases, match recommendations, handover records, release records, announcements, offline sync operations and audit logs;
- explicit person and item state transition rules;
- typed role permission helpers;
- repository interfaces for all core operational stores;
- in-memory demo repositories seeded with fictional Congress Night 2026 data;
- rule-based Person Match Engine with transparent scoring reasons;
- rule-based Item Match Engine with transparent scoring reasons;
- service-layer dashboard aggregation for operational and leadership views;
- unit tests for permissions, state transitions, handover safety, item release safety, match scoring, PA escalation, offline sync and aggregate analytics.
