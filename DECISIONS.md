# ReuniteRC Decisions

## Locked Architecture Decisions

- Supabase access pattern: hybrid. Authenticated workflow mutations use server actions when the Supabase adapter is added. Sync/API-style operations may use route handlers where appropriate.
- SafeCard token security: production uses server-generated cryptographically secure random tokens. Persistent storage stores only token hashes, not raw QR tokens. Demo lookup is fictional and hash-interface-compatible.
- QR scanning: judged MVP supports QR card generation and simulated/manual token lookup. Camera scanning is optional later.
- Offline safety boundary: offline mode may capture new missing reports, found reports and draft PA escalation requests. Match confirmation, guardian verification and final handover closure require connected coordinator workflow to prevent conflicting or unsafe handovers.
- Analytics: demo adapter uses service-layer aggregation. Production may add secured database views for anonymised leadership reporting.
- Authentication: initial prototype may use clearly labelled fictional demo role sessions. Production architecture remains prepared for Supabase Auth and Row Level Security.
- Git branch: local branch renamed from `master` to `main` before the Phase 1 commit.

## Completed Phase 1 Domain Design

Phase 1 implements the ReuniteRC Safety Kernel:

- strict domain models for Event, HelpPoint, StaffProfile, Guardian, SafetyCard, SeparationCase, CaseMatch, HandoverRecord, AnnouncementEscalation, OfflineSyncOperation and AuditLog;
- typed unions for staff roles, person category, case type, case status, urgency, match status, escalation status, connectivity status and audit event type;
- explicit case state machine;
- typed permission helpers for coordinator, volunteer, leadership viewer and guardian/group leader roles;
- repository interfaces for events, HelpPoints, Safety Cards, separation cases, matches, handovers, announcements, audit logs and offline queues;
- in-memory demo repositories seeded with fictional Congress Night 2026 data;
- application services for case creation, Safety Card registration, match suggestion, match decisions, handover completion, PA escalation, dashboard summary, offline queueing and offline sync;
- rule-based Assisted Match Engine with transparent scoring reasons and human verification requirement;
- automated tests using TypeScript plus Node's built-in test runner.

## Safeguarding Decisions

- A suggested match never closes a case.
- A confirmed match moves cases to `match_pending_handover`, not `safely_reunited`.
- `safely_reunited` requires a verified handover record.
- PA escalation does not close or resolve a case.
- Rejected matches remain in audit history.
- Offline-created reports remain `pending_sync` until stable sync succeeds.
- Leadership dashboard summaries contain aggregate values only.

## Remaining Decisions Before Supabase Integration

- Exact RLS policy SQL for HelpPoint-scoped volunteer case visibility.
- Whether production dashboard metrics should be implemented first with service aggregation, secured database views or both.
- Final deployment environment naming for demo versus production-like judging environments.
