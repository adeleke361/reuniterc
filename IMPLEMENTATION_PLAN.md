# ReuniteRC Implementation Plan

## Phase 0: Foundation

Acceptance criteria:

- Git repository exists.
- Next.js TypeScript Tailwind scaffold is present.
- Documentation covers product, architecture, data model, API contracts and implementation phases.
- No feature screens are built beyond a minimal runnable placeholder.
- Repository is ready for dependency installation and Vercel configuration.

Status: complete in this scaffold.

## Phase 1: Safety Kernel

Scope:

- Create typed domain models.
- Create repository interfaces.
- Implement seeded fictional demo-data adapter.
- Implement role and permission helpers.
- Add explicit workflow state machine and assisted match logic.
- Add unit tests for permissions, state transitions, handover safety, PA escalation, offline sync and leadership aggregation.

Status: superseded by Phase 1B concept alignment after validation.

## Phase 1B: Concept Alignment Refactor

Scope:

- Align ReuniteRC with the Reunite Point recovery model.
- Remove discarded QR identity concepts from the active prototype direction.
- Add `ReunitePoint`, `PersonCase`, `ItemCase`, `PersonMatchRecommendation`, `ItemMatchRecommendation`, `PersonHandoverRecord` and `ItemReleaseRecord`.
- Split matching into Person Match Engine and Item Match Engine.
- Add proof-of-ownership verification before item release.
- Update offline queue operation types for all four report intents.
- Update leadership analytics to include aggregate person and item reports only.
- Update documentation, seed data and tests.

Acceptance criteria:

- Demo data represents Congress Night 2026 and Reunite Points `RP-001`, `RP-014`, `RP-002` and `RP-007`.
- Reunite Points identify reporting locations, not people.
- No real identities are used.
- UI can read data through services, not hard-coded page constants.
- Person and item match actions are audit-log-ready.
- Offline reports remain `pending_sync` until successful synchronisation.
- Connected Information Bureau workflow is required for match confirmation, person handover and item release.
- Leadership analytics are aggregate-only.
- PA escalation never resolves a case by itself.

Status: implemented in the Phase 1B kernel.

## Phase 2A: Operations Shell And Dashboard

Scope:

- Build premium command-centre layout.
- Add `/dashboard` with event status, metrics, recent activity, hotspots, urgent cases and connectivity status.
- Show Reunite Point context and pending offline reports.
- Add loading, empty and error states.
- Add guided Congress Night demo flow.
- Add Reunite Point poster previews.
- Add report, match, handover, item release, PA fallback and leadership routes.

Acceptance criteria:

- Dashboard is responsive and visually polished.
- Leadership viewer sees aggregate metrics only.
- Coordinator sees operational panels.
- Connectivity status is visible.
- No sensitive public data is exposed.
- Degraded connectivity blocks final reunion and item release in the prototype.
- Reset Demo restores baseline runtime state.

Status: completed as the Phase 2A guided prototype experience.

## Phase 2B: Public And Staff Report Capture

Scope:

- Build report entry flows for:
  - looking for a separated person;
  - found person needing help;
  - lost item;
  - found item.
- Use Reunite Point code or URL context.
- Add structured validation.
- Create audit entries through service layer.
- Add success/error states.

Acceptance criteria:

- Public reporters can submit reports only.
- Staff can create reports from authorised workflows.
- Required fields are validated.
- Sensitive notes are clearly staff-only.
- Submitted cases appear in dashboard and match centres.

## Phase 3: Reunite Point Management And Poster Assets

Scope:

- Add Reunite Point records.
- Render official short URL and point code.
- Support poster metadata: point code, location name, fallback instruction, tamper-check instruction and official branding fields.

Acceptance criteria:

- QR content does not include personal details.
- Reunite Point code is visible for no-internet fallback.
- Fake-poster risk is addressed with official branding and tamper guidance.

## Phase 4: Assisted Match Centres

Scope:

- Build person match centre.
- Build item match centre.
- Display recommendation tiers and transparent scoring reasons.
- Allow coordinator confirmation or rejection.

Acceptance criteria:

- Person scoring considers Reunite Point proximity, time, category, age, group reference and non-sensitive tags.
- Item scoring considers category, Reunite Point or zone, time, description tags and staff-only hidden detail.
- No UI describes the rule-based engines as machine-learning.
- Human confirmation is required.

## Phase 5: Verified Handover, Item Release And PA Escalation

Scope:

- Build person handover workflow.
- Build item release workflow.
- Build PA escalation queue.
- Enforce verification before final closure.

Acceptance criteria:

- A confirmed person match can close only after verified handover.
- A confirmed item match can close only after proof-of-ownership verification.
- PA escalation is available only to coordinators.
- Announcement text avoids sensitive over-disclosure.
- PA escalation never resolves a case.

## Phase 6: Offline Queue And Sync

Scope:

- Add Dexie IndexedDB queue.
- Add degraded connectivity toggle.
- Queue person and item report mutations locally.
- Queue draft PA escalation requests locally.
- Add sync replay and status panel.

Acceptance criteria:

- Staff can create reports while degraded if the app is already loaded.
- Reports appear in pending sync state.
- Restoring connectivity syncs operations into demo repositories.
- Duplicate submissions are prevented by idempotency keys.
- Offline mode does not allow match confirmation, person handover or item release.
- Public users are not promised zero-internet digital submission if the form never loaded.

## Phase 7: Supabase Integration

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
- Sensitive fields are protected by RLS.

## Phase 8: Analytics And Submission Assets

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
- Tests for aggregate-only leadership analytics.
- Accessibility checks for critical forms.
- Manual browser QA for desktop and mobile layouts.
- Vercel production build verification.

## Deployment Checklist

- Install dependencies with npm.
- Confirm `npm run lint` passes.
- Confirm `npm run typecheck` passes.
- Confirm `npm run test` passes.
- Confirm `npm run build` passes.
- Configure Vercel project.
- Add Supabase environment variables when live backend is available.
- Verify no real data or credentials are committed.
- Verify visible QR content contains no personal details.
- Verify demo data is fictional.
- Add repository URL and deployed URL to submission.
