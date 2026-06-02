# ReuniteRC Agent Guide

This repository is for ReuniteRC, a competition-grade civic safety platform prototype for Kingdom Hack 3.0.

## Product Context

ReuniteRC is a digital reunification and lost-and-found solution for major programmes in Redemption City.

It supports the existing Redemption City Information Bureau workflow used during major programmes such as Convention and Congress. The Information Bureau remains the operational owner for separated-person and found-item handling, with PA/public announcement as a trusted fallback for urgent or unresolved cases.

The product uses official physical Reunite Points: posters, placards, billboards or help signs placed at key locations around camp. A Reunite Point identifies a reporting location, not a person.

Core promise: every separation or lost-and-found case should be securely captured, assisted, matched, verified, handed over or released, and measurable, even when connectivity is unstable.

## Safety And Privacy Rules

- Use only fictional demo identities and fictional case information.
- Do not implement public live tracking of children, elderly attendees or other vulnerable people.
- Do not place names, phone numbers or sensitive personal details inside visible QR codes.
- Reunite Point QR codes must support online reporting location context only.
- Sensitive case details are authorised-staff information.
- Closing a person case as safely reunited must require a verified handover step.
- Releasing an item must require proof-of-ownership verification.
- Important actions should create audit records.
- Do not implement facial recognition.
- PA/public announcement is a fallback escalation workflow, not a replacement for authorised case handling.
- Demo data must be clearly fictional and must not resemble real attendee records.
- Public users must not see sensitive matches, staff notes, claimant contact details or finder contact details.

## Roles

- Information Bureau Coordinator: dashboard access, match review, handover approval, item release, PA escalation and analytics.
- HelpPoint Volunteer: create person and item reports, record Reunite Point context, and submit cases for review.
- Leadership Viewer: read-only aggregate operational dashboard.
- Public Reporter / Attendee: submit reports only.

## Technical Direction

- Next.js App Router.
- TypeScript with strict typing.
- Tailwind CSS.
- shadcn/ui-compatible component structure where appropriate.
- Lucide React icons.
- Supabase PostgreSQL and Supabase Auth architecture.
- IndexedDB offline mutation queue, preferably Dexie.
- qrcode.react or equivalent for Reunite Point QR rendering.
- Vercel-compatible deployment.
- npm package manager.

## Architecture Rules

- Keep domain logic separate from UI components.
- Use a service/repository abstraction so demo data can later be backed by Supabase.
- Do not block visual prototyping on live Supabase credentials.
- Offline capture must be real in the prototype: degraded connectivity should queue local staff mutations and later sync them.
- The assisted match engines are rule-based. Do not describe them as machine-learning unless that is introduced and documented later.
- Human confirmation is required for suggested matches and verified handover.
- Proof-of-ownership confirmation is required before item release.
- Match confirmation, person handover and item release cannot complete while offline.
- Keep the Stage 2 connectivity model software-only; do not add separate connectivity equipment to the prototype scope.

## Design Direction

ReuniteRC should feel like a premium civic safety operations command centre:

- Almost-black background.
- Teal/cyan primary accents.
- Strong modern typography.
- Refined spacing and card hierarchy.
- High-quality status and priority badges.
- Subtle grid/radar/operations visual language.
- Accessible contrast.
- Responsive desktop-first workflows.

Avoid generic admin templates, decorative clutter and marketing-only screens once product UI work begins.

## Coding Conventions

- Prefer small, typed modules with clear names.
- Keep files focused by feature or layer.
- Validate user input at form and service boundaries.
- Model loading, empty and error states for user-facing workflows.
- Use audit-log-friendly action names in services.
- Do not hard-code credentials or real sensitive data.
- Keep comments sparse and useful.
- Run `npm run lint` and `npm run typecheck` when dependencies are installed.

## Suggested Folder Direction

- `src/app`: App Router routes and route layouts.
- `src/components`: reusable UI components.
- `src/domain`: domain models, match scoring and business rules.
- `src/services`: application services and use cases.
- `src/repositories`: demo, offline and Supabase repository adapters.
- `src/offline`: IndexedDB queue and sync orchestration.
- `src/lib`: shared utilities and third-party client setup.
- `supabase`: migrations, seed data and database documentation.
