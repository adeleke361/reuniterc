# Phase 0 Review Summary

## Validated Problem And Product Promise

ReuniteRC supports the existing Redemption City Information Bureau workflow for major programmes such as Congress and Convention. During large gatherings, children, elderly attendees or group members may become separated from guardians or leaders. The current trusted process allows cases to be reported at the Information Bureau behind the auditorium and uses authorised handling plus PA announcements when escalation is needed.

Product promise: every separation case should be securely captured, assisted, matched, handed over and measurable, even when connectivity is unstable.

## Architecture Layers

- Presentation layer: Next.js App Router routes, React components, Tailwind CSS, shadcn/ui-compatible primitives and Lucide icons.
- Application service layer: case intake, SafeCard registration and lookup, match suggestion, match decision, handover, PA escalation, dashboard metrics and offline sync use cases.
- Domain layer: typed entities, role permissions, case status transitions, match scoring rules and audit event names.
- Repository layer: demo-data adapter first, then Supabase adapter behind the same interfaces.
- Offline layer: Dexie/IndexedDB mutation queue with idempotency keys, pending states and replay on restored connectivity.
- Infrastructure layer: Supabase client, Supabase Auth, PostgreSQL migrations, environment configuration and Vercel deployment.

## Proposed Application Routes

- `/`: product entry and role-aware access point.
- `/login`: simulated or Supabase-backed staff sign-in.
- `/dashboard`: operations command centre.
- `/cases/missing`: report missing or separated person.
- `/cases/found`: record found or assisted person.
- `/matches`: assisted match centre with recommendation reasons.
- `/handover/[id]`: verified reunion workflow.
- `/safecard`: optional SafeBand or Safety Card generator.
- `/announcements`: PA escalation queue.
- `/analytics`: anonymised event intelligence and hotspot reporting.

## Planned Data Entities And Key Relationships

- `events`: parent context for operational activity.
- `help_points`: authorised assistance locations linked to events.
- `staff_profiles`: authenticated staff records mapped to roles and optional HelpPoints.
- `guardians`: optional guardian or group leader records linked to events.
- `safety_cards`: secure token records linked to events and optional guardians.
- `separation_cases`: missing or found/assisted case records linked to events, HelpPoints, staff and optional Safety Cards.
- `case_matches`: suggested, confirmed or rejected links between missing and found cases.
- `handover_records`: verified reunion closure records linked to matches, cases, guardians and approving staff.
- `announcement_escalations`: PA escalation requests linked to cases and events.
- `offline_sync_operations`: queued mutation records with replay status and idempotency metadata.
- `audit_logs`: append-only records for important actions across the system.

Key relationship rule: a case may only become `safely_reunited` after a verified handover record is created.

## Roles And Permissions

- Information Bureau Coordinator: view operational dashboard, review matches, confirm or reject matches, record handovers, approve PA escalation and view analytics.
- HelpPoint Volunteer: create missing/found reports, enter or scan SafeCard tokens, submit cases for review and view only scoped operational information.
- Leadership Viewer: view read-only anonymised metrics, trends and hotspots without sensitive case details.
- Guardian / Group Leader: use optional SafeCard registration flow only and has no staff dashboard access.

Supabase Auth is planned for identity, with staff profile role mapping and Row Level Security enforcing database access boundaries.

## Offline Capture And Sync Strategy

The prototype will include a degraded connectivity toggle. When degraded connectivity is active, supported mutations such as missing/found case submission are stored in IndexedDB through Dexie. Each queued operation should include operation type, payload, actor, client timestamp, idempotency key, status, attempt count and last error.

When connectivity is restored, the sync service replays queued operations through the same service contracts used online. Successful sync writes canonical records into the active repository and records audit events. Failed sync attempts remain visible for authorised staff review.

## Assisted Match Engine Scoring Logic

The match engine is rule-based, not AI. It should score missing and found cases using:

- exact SafeCard token match, where available;
- person category compatibility;
- approximate age-band compatibility;
- location compatibility;
- time proximity;
- shared non-sensitive description tags.

The interface must show recommendation reasons and require coordinator confirmation before a match affects handover workflow.

## Privacy, Safeguarding And Audit Controls

- Use only fictional demo identities and fictional case data.
- Do not implement public live tracking.
- Do not place names, phone numbers or sensitive personal information in QR codes.
- SafeCard QR content must contain only a secure random token.
- Store token hashes server-side where persistence is available.
- Treat sensitive case notes as authorised-staff information.
- Require verified handover before safe reunion closure.
- Record important state transitions in audit logs.
- Do not implement facial recognition.
- Keep PA announcement as a fallback escalation workflow with privacy-conscious text.
- Leadership dashboards must aggregate or anonymise sensitive operational data.

## Phase 1 Scope

Phase 1 should implement the domain and demo-data foundation only:

- typed domain models;
- role and permission helpers;
- case status transition definitions;
- repository interfaces;
- seeded fictional Congress Night 2026 demo data;
- demo repositories for events, cases, SafeCards, matches, handovers, announcements and audit logs;
- rule-based match scoring module;
- basic tests for permissions, status transitions and match scoring.

Phase 1 should not build the full product UI yet.

## Phase 1 Acceptance Criteria

- Demo data is clearly fictional and includes Congress Night 2026 plus authorised HelpPoints.
- UI and services read through repository/service abstractions, not hard-coded page constants.
- Role permissions are typed and enforceable at service boundaries.
- Case status transitions prevent unverified `safely_reunited` closure.
- Match scoring produces transparent reasons.
- Exact SafeCard token match is weighted highest.
- No match result claims to be AI-generated.
- Audit-log-friendly action names exist for critical workflows.
- Lint, typecheck and build pass.

## Unresolved Architecture Decisions

- Whether initial Supabase integration should use route handlers, server actions or a hybrid.
- Whether SafeCard token generation should occur only server-side or support a client-generated token followed by server hashing.
- Whether camera QR scanning is needed for the first judged prototype or manual token entry is sufficient.
- Exact Row Level Security policy shape for scoped HelpPoint volunteer visibility.
- Conflict resolution policy for offline edits to records that changed while disconnected.
- Whether leadership analytics should use database views, service-layer aggregation or both.
- Final deployment environment naming and Supabase project separation between demo and production-like judging environments.
