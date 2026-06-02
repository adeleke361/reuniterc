# ReuniteRC Decisions

## Locked Product Decisions

- ReuniteRC is a digital support layer for the existing Redemption City Information Bureau process.
- ReuniteRC uses official physical Reunite Points with QR, Point Code, location name, fallback instruction, official branding and tamper-check guidance.
- A Reunite Point identifies a reporting location, not a person.
- The Information Bureau remains the operational owner.
- PA/public announcement remains the trusted fallback for urgent or unresolved cases.
- The Stage 2 prototype keeps connectivity software-only and does not add separate connectivity equipment to the scope.

## Locked Connectivity Decisions

- Online mode: when internet works, a user scans a Reunite Point and submits a report to the Information Bureau dashboard.
- Staff offline mode: when network is poor but authorised staff already loaded the app, they can record reports offline for later sync.
- No-internet physical fallback: if the form cannot load, the printed Reunite Point still provides a Point Code for reporting to official staff.
- PA fallback: PA/public announcement remains available for urgent or unresolved cases.
- The app must not claim that public users can submit digitally with zero internet if they never loaded the form.

## Completed Phase 1B Domain Design

Phase 1B implements the Reunite Point alignment kernel:

- strict domain models for Event, ReunitePoint, ActorProfile, PersonCase, ItemCase, PersonMatchRecommendation, ItemMatchRecommendation, PersonHandoverRecord, ItemReleaseRecord, AnnouncementEscalation, OfflineSyncOperation and AuditLog;
- typed unions for staff roles, person category, person case intent, item intent, case status, item category, urgency, match status, escalation status, connectivity status and audit event type;
- explicit person and item state machines;
- typed permission helpers for coordinator, volunteer, leadership viewer and public reporter roles;
- repository interfaces for events, Reunite Points, person cases, item cases, person matches, item matches, handovers, item releases, announcements, audit logs and offline queues;
- in-memory demo repositories seeded with fictional Congress Night 2026 data;
- application services for Reunite Point listing, report creation, person match suggestion, item match suggestion, match decisions, person handover completion, item release completion, PA escalation, dashboard summary, leadership analytics, offline queueing and offline sync;
- rule-based Person Match Engine with transparent scoring reasons and human verification requirement;
- rule-based Item Match Engine with transparent scoring reasons and proof-of-ownership requirement;
- automated tests using TypeScript plus Node's built-in test runner.

## Safeguarding Decisions

- A suggested match never closes a person or item case.
- A confirmed match moves cases to Information Bureau confirmation status, not final closure.
- `safely_reunited` requires a verified person handover record.
- `item_released` requires proof-of-ownership verification and an item release record.
- PA escalation does not close or resolve a case.
- Rejected matches remain in audit history.
- Offline-created reports remain `pending_sync` until stable sync succeeds.
- Match confirmation, person handover and item release are blocked offline.
- Leadership dashboard summaries contain aggregate values only.
- Public reporters can submit reports only.

## Security And Abuse Controls

- Printed Reunite Points should show official branding, visible short URL, Point Code and tamper-check instruction.
- Public views must not expose sensitive notes, hidden item details, matches or direct contact details.
- Claimants and finders should not contact each other directly through the app.
- Item release requires proof of ownership.
- Person handover requires Information Bureau verification.
- Demo data remains fictional.

## Phase 2A UI Decisions

- The strongest screen is `/demo`, a guided Congress Night 2026 simulation with a top progress timeline.
- Reusable components are used for shell, event status, connectivity, Reunite Point posters, metrics, badges, match cards, verification checklists, PA queue, offline queue, activity timeline and leadership analytics.
- The visual language uses dark graphite surfaces, cyan/teal active operations, amber pending states, restrained red for urgent unresolved cases and emerald for resolved outcomes.
- Report forms demonstrate the four final report intents and Reunite Point context without creating public access to matches or sensitive details.
- Poster previews show ReuniteRC branding, Point Code, location, short URL, QR rendering, fallback instruction and tamper-check guidance.
- Guided demo state is stored locally in the browser and can be reset to the baseline scenario.
- UI closure controls mirror the Phase 1B service rules: degraded connectivity blocks final person reunion and item release.
- The leadership route renders aggregate metrics only.
- No deployment is performed in Phase 2A.

## Remaining Decisions Before Supabase Integration

- Exact RLS policy SQL for Reunite Point-scoped volunteer case visibility.
- Whether production dashboard metrics should be implemented first with service aggregation, secured database views or both.
- Final deployment environment naming for demo versus production-like judging environments.
- Final official short URL pattern for printed Reunite Points.
