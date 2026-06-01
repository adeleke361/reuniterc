# ReuniteRC Implementation Plan

## Phase 0: Foundation

Acceptance criteria:

- Git repository exists.
- Next.js TypeScript Tailwind scaffold is present.
- Documentation covers product, architecture, data model, API contracts and implementation phases.
- No feature screens are built beyond a minimal runnable placeholder.
- Repository is ready for dependency installation and Vercel configuration.

Status: complete in this scaffold, pending dependency installation.

## Phase 1: Domain And Demo Data Foundation

Scope:

- Create typed domain models.
- Create repository interfaces for events, cases, SafeCards, matches, handovers, announcements and audit logs.
- Implement seeded fictional demo-data adapter.
- Implement role and permission helpers.
- Add explicit workflow state machine and Assisted Match Engine.
- Add unit tests for permissions, state transitions, handover safety, match scoring, PA escalation, offline sync and leadership aggregation.

Acceptance criteria:

- Demo data represents Congress Night 2026 and authorised HelpPoints.
- No real identities are used.
- UI can read data through services, not hard-coded page constants.
- Match and handover actions are audit-log-ready.
- Offline reports remain `pending_sync` until successful synchronisation.
- Connected coordinator workflow is required for match confirmation, guardian verification and final handover closure.
- Leadership dashboard summary is aggregate/anonymised.

Status: implemented in the Phase 1 safety kernel.

## Phase 2: Operations Shell And Dashboard

Scope:

- Build premium command-centre layout.
- Add simulated login role selector.
- Add `/dashboard` with event status, metrics, recent activity, hotspots, urgent cases and connectivity status.
- Add loading, empty and error states.

Acceptance criteria:

- Dashboard is responsive and visually polished.
- Leadership viewer sees anonymised metrics only.
- Coordinator sees operational panels.
- Connectivity status is visible.

## Phase 3: Case Capture Workflows

Scope:

- Build `/cases/missing` and `/cases/found`.
- Add structured validation.
- Add SafeCard token entry.
- Create audit entries through service layer.
- Add success/error states.

Acceptance criteria:

- Staff can submit missing and found cases.
- Required fields are validated.
- Sensitive notes are clearly staff-only.
- Submitted cases appear in dashboard and match centre.

## Phase 4: SafeCard Flow

Scope:

- Build `/safecard`.
- Generate secure random token client-side or server-side according to final implementation choice.
- Render QR with token only.
- Store token hash in repository layer.

Acceptance criteria:

- QR code never contains names, phone numbers or sensitive details.
- Token lookup works for authorised staff.
- Revoked/inactive cards cannot be used for match scoring.

## Phase 5: Assisted Match Centre

Scope:

- Build rule-based scoring engine.
- Build `/matches`.
- Display recommendation reasons.
- Allow coordinator confirmation or rejection.

Acceptance criteria:

- Exact SafeCard token match heavily influences score.
- Person category, age band, location, time and tags are considered.
- No UI claims facial recognition or AI.
- Human confirmation is required.

## Phase 6: Verified Handover And PA Escalation

Scope:

- Build `/handover/[id]`.
- Build `/announcements`.
- Enforce handover before safely reunited closure.
- Add privacy-conscious PA escalation queue.

Acceptance criteria:

- A confirmed match can be closed only after verification.
- Handover creates audit records.
- PA escalation is available only to coordinators.
- Announcement text avoids sensitive over-disclosure.

## Phase 7: Offline Queue And Sync

Scope:

- Add Dexie IndexedDB queue.
- Add degraded connectivity toggle.
- Queue case submission mutations locally.
- Add sync replay and status panel.

Acceptance criteria:

- User can create a case while degraded.
- Case appears in pending sync state.
- Restoring connectivity syncs the operation into demo repositories.
- Duplicate submissions are prevented by idempotency keys.
- Offline mode does not allow match confirmation, guardian verification or final handover closure.

## Phase 8: Supabase Integration

Scope:

- Add Supabase client.
- Add migrations and seed data.
- Implement Supabase repository adapter.
- Add Supabase Auth session mapping.
- Draft RLS policies.
- Implement authenticated workflow mutations with server actions.
- Use route handlers for sync/API-style operations where appropriate.

Acceptance criteria:

- Demo adapter can be swapped for Supabase adapter by configuration.
- Database schema matches `DATA_MODEL.md`.
- Staff role boundaries are enforced.
- Build remains Vercel-compatible.
- SafeCard raw tokens are generated server-side and only token hashes are persisted.

## Phase 9: Analytics And Submission Assets

Scope:

- Build `/analytics`.
- Finalise README and deployment notes.
- Prepare architecture schematic PDF if requested.
- Prepare business pitch deck PDF if requested.

Acceptance criteria:

- Metrics support Stage 2 judging story.
- Judges can understand value proposition, stack and demo scenario.
- Deployment URL and GitHub URL are ready for submission.

## Test Plan

- TypeScript strict type checks.
- ESLint checks.
- Unit tests for domain rules and match scoring.
- Service tests for case status transitions.
- Offline sync tests for queue, replay and idempotency.
- Accessibility checks for critical forms.
- Manual browser QA for desktop and mobile layouts.
- Vercel production build verification.

## Deployment Checklist

- Install dependencies with npm.
- Confirm `npm run lint` passes.
- Confirm `npm run typecheck` passes.
- Confirm `npm run build` passes.
- Configure Vercel project.
- Add Supabase environment variables when live backend is available.
- Verify no real data or credentials are committed.
- Verify QR content contains token only.
- Verify demo data is fictional.
- Add repository URL and deployed URL to submission.
