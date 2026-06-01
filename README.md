# ReuniteRC

ReuniteRC is an offline-resilient digital operating layer for family reunification support during major Redemption City programmes such as Convention and Congress.

It is being built for Kingdom Hack 3.0 as a civic safety platform prototype that strengthens the existing Information Bureau and PA announcement workflow.

## Product Promise

Every separation case should be securely captured, assisted, matched, handed over and measurable, even when connectivity is unstable.

## What This Prototype Will Demonstrate

- Structured missing and found-person case logging.
- Optional QR SafeCard/SafeBand generation with secure token-only QR content.
- Rule-based assisted matching with human confirmation.
- Verified guardian or group leader handover before closure.
- PA announcement escalation support.
- Offline case capture with later synchronisation.
- Event leadership dashboard with response performance and hotspot indicators.

## Safety Principles

- Demo data must be fictional.
- QR codes must not contain names, phone numbers or sensitive personal details.
- Sensitive case details are authorised-staff information.
- No public live tracking of vulnerable persons.
- No facial recognition.
- PA announcement is a fallback escalation workflow.
- Safely reunited status requires verified handover.

## Tech Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui-compatible component architecture.
- Lucide React icons.
- Supabase PostgreSQL and Supabase Auth architecture.
- Dexie/IndexedDB offline mutation queue.
- qrcode.react for token QR rendering.
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
npm run build
```

## Documentation

- `PRODUCT_SPEC.md`: problem, workflow, users, MVP flows and non-goals.
- `ARCHITECTURE.md`: layered architecture, auth, offline approach, security and deployment.
- `DATA_MODEL.md`: planned Supabase entities, relationships, indexes and privacy notes.
- `API_CONTRACTS.md`: planned route/action contracts and role access.
- `IMPLEMENTATION_PLAN.md`: sequenced build phases, acceptance criteria, tests and deployment checklist.
- `AGENTS.md`: operating guide for future Codex work.

## Current Status

Phase 0 foundation scaffold is present. Dependencies have not been installed in this environment because package downloads require explicit approval.
