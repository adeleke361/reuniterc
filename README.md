# ReuniteRC

ReuniteRC is a digital reunification and lost-and-found solution for major programmes in Redemption City.

It is being built for Kingdom Hack 3.0 as a civic safety platform prototype that strengthens the existing Information Bureau and PA announcement workflow.

## Product Promise

Every separation or lost-and-found case should be securely captured, assisted, matched, verified, handed over or released, and measurable, even when connectivity is unstable.

## What This Prototype Demonstrates

- Official Reunite Points with visible Point Codes and no-internet fallback instructions.
- Structured looking-for-person and found-person reports.
- Structured lost-item and found-item reports.
- Rule-based person matching with human confirmation.
- Rule-based item matching with proof-of-ownership verification.
- Verified person handover before safe reunion.
- Verified item release before closure.
- PA announcement escalation support.
- Staff offline report capture with later synchronisation.
- Aggregate leadership dashboard metrics.

## Safety Principles

- Demo data must be fictional.
- QR codes must not contain names, phone numbers or sensitive personal details.
- Reunite Points identify reporting locations, not people.
- Sensitive case details are authorised-staff information.
- No public live tracking of vulnerable persons.
- No facial recognition.
- PA announcement is a fallback escalation workflow.
- Safe reunion requires verified handover.
- Item release requires proof-of-ownership verification.
- Final reunion and item release are blocked offline.

## Tech Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui-compatible component architecture.
- Lucide React icons.
- Supabase PostgreSQL and Supabase Auth architecture.
- Dexie/IndexedDB offline mutation queue.
- qrcode.react for Reunite Point QR rendering.
- Vercel deployment.
- npm package manager.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Run checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Documentation

- `PRODUCT_SPEC.md`: problem, workflow, users, MVP flows and non-goals.
- `ARCHITECTURE.md`: layered architecture, auth, offline approach, security and deployment.
- `DATA_MODEL.md`: planned Supabase entities, relationships, indexes and privacy notes.
- `API_CONTRACTS.md`: planned route/action contracts and role access.
- `IMPLEMENTATION_PLAN.md`: sequenced build phases, acceptance criteria, tests and deployment checklist.
- `DECISIONS.md`: locked product, architecture and safeguarding decisions.
- `AGENTS.md`: operating guide for future Codex work.

## Current Status

Phase 1B concept alignment is implemented. The active kernel supports Reunite Points, person cases, item cases, rule-based person and item matching, verified handover, verified item release, PA escalation, offline report queueing and aggregate analytics.

No Phase 2A UI has been built yet.
