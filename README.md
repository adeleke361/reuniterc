# ReuniteRC

ReuniteRC is a digital reunification and lost-and-found solution for major programmes in Redemption City.

It is being built for Kingdom Hack 3.0 as a civic safety platform prototype that strengthens the existing Information Bureau and PA fallback workflow.

No one should get lost in the crowd. No case should get lost in the process.

## Product Promise

Every separation or lost-and-found case should be securely captured, assisted, matched, verified, handed over or released, and measurable, even when connectivity is unstable.

## Phase 2A Prototype

Phase 2A builds a guided, interactive Congress Night 2026 demo around the final Reunite Point model. Phase 2A.2 adds demo polish for Stage 2 prototype readiness: the `/demo` route now reveals outcomes step-by-step, and Reunite Point posters can be printed, copied and exported as PNG assets.

Built routes:

- `/`: premium landing page and demo launch.
- `/demo`: guided Congress Night simulation.
- `/reunite-points`: Reunite Point poster generator with print, selected PNG export and short URL copy controls.
- `/report/person`: looking-for-person and found-person report capture.
- `/report/item`: lost-item and found-item report capture.
- `/matches/person`: Information Bureau person match review.
- `/matches/item`: Information Bureau item match review.
- `/handover/person/[id]`: verified person reunion workflow.
- `/release/item/[id]`: verified item release workflow.
- `/announcements`: PA fallback queue.
- `/dashboard`: Information Bureau command dashboard.
- `/analytics`: aggregate-only leadership view.

## Demo Walkthrough

1. Open `/demo`.
2. Start at Reunite Point `RP-014` Arena Rear.
3. Progress through missing-child report, found-child report from `RP-014`, person match recommendation, guardian/group verification and Safely Reunited.
4. Continue through lost-and-found item match and proof-of-ownership item release.
5. Toggle degraded connectivity in `/demo` and queue a report.
6. Confirm that final reunion and item release are blocked while degraded.
7. Open `/announcements` for public announcement fallback and `/analytics` for aggregate leadership outcomes.

The guided demo does not show match scores before the match review step, does not show Safely Reunited before verified handover, does not show Item Released before proof-of-ownership verification and does not surface offline queued report count before the offline queue test.

The rule-based recommendation scores are intentionally realistic demo values: `92` for the person match and `87` for the item match.

## Safety Principles

- Demo data is fictional.
- QR codes must not contain names, phone numbers or sensitive personal details.
- Reunite Points identify reporting locations, not people.
- Sensitive case details are authorised-staff information.
- No public live tracking of vulnerable persons.
- No facial recognition.
- Public announcement fallback is an escalation workflow.
- Safe reunion requires verified handover.
- Item release requires proof-of-ownership verification.
- Final reunion and item release are blocked offline.
- Leadership analytics remain aggregate-only.

## Tech Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui-compatible component architecture.
- Lucide React icons.
- Supabase PostgreSQL and Supabase Auth architecture.
- Dexie/IndexedDB offline mutation queue direction.
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
- `ARCHITECTURE.md`: layered architecture, auth, offline approach, UI runtime notes, security and deployment.
- `DATA_MODEL.md`: planned Supabase entities, relationships, indexes and privacy notes.
- `API_CONTRACTS.md`: planned route/action contracts and role access.
- `IMPLEMENTATION_PLAN.md`: sequenced build phases, acceptance criteria, tests and deployment checklist.
- `DECISIONS.md`: locked product, architecture, UI and safeguarding decisions.
- `DEMO_SCRIPT.md`: 3-minute live pitch walkthrough.
- `UI_SCREEN_MAP.md`: route, role and flow reference.
- `AGENTS.md`: operating guide for future Codex work.
