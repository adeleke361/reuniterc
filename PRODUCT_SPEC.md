# ReuniteRC Product Specification

## Validated Problem

Major programmes in Redemption City bring very large crowds into a time-sensitive, high-emotion environment. Children, elderly attendees and group members can become separated from guardians or leaders. When this happens, the operating need is not just to record that someone is missing or found. Staff need a trustworthy way to capture the case, compare related reports, escalate responsibly, verify the guardian or group leader and measure how quickly the reunion happened.

Network connectivity can become intermittent during large programmes, so the system must remain useful during degraded connectivity and synchronise later.

## Existing Trusted Process

Redemption City already has an Information Bureau behind the auditorium. Separated-person cases can be reported there. The existing process uses authorised handling and public announcements through the altar/PA speaker system to help families or group leaders reconnect.

ReuniteRC strengthens this process by adding structured digital operations. It does not replace the Information Bureau, authorised staff judgement or PA announcements.

## Value Proposition

ReuniteRC is an offline-resilient digital operating layer for the Information Bureau and authorised HelpPoints. It provides:

- structured missing and found-person case logging;
- optional QR SafeBand or Safety Card generation using secure random tokens;
- rule-based assisted matching with human confirmation;
- verified guardian or group leader handover;
- PA announcement escalation support;
- offline case capture and later synchronisation;
- post-event operational intelligence for leadership.

## Users And Roles

Information Bureau Coordinator:

- access operations dashboard;
- review and confirm suggested matches;
- approve verified handovers;
- escalate unresolved cases for PA announcements;
- review analytics and hotspots.

HelpPoint Volunteer:

- create missing-person reports;
- record found/assisted persons;
- scan or enter SafeCard tokens;
- submit cases for coordinator review;
- view only assigned or permitted operational information.

Leadership Viewer:

- view anonymised operational dashboard;
- review event-level trends, response times and hotspots;
- no access to sensitive case details.

Guardian / Group Leader:

- optionally register a SafeCard;
- present a SafeCard token during help requests;
- no access to staff dashboard.

## MVP Workflows

### Missing-Person Case

1. Guardian or group leader reports a separated person at the Information Bureau or HelpPoint.
2. Authorised staff captures structured details, approximate time, last known location and non-sensitive description tags.
3. If a SafeCard token is available, staff scans or enters the token.
4. The case becomes available for assisted matching.
5. The action creates an audit record.

### Found/Assisted-Person Case

1. A HelpPoint volunteer records a found or assisted person.
2. Staff captures person category, approximate age band, location, time and non-sensitive tags.
3. If a SafeCard is present, staff scans or enters the secure token.
4. The case is submitted for coordinator review.
5. If connectivity is degraded, the report is queued locally and synced later.

### Assisted Match Review

1. The rule-based engine scores compatible missing and found cases.
2. Scores are based on exact token match, person category, approximate age band, location compatibility, time proximity and selected description tags.
3. The UI explains why each match is recommended.
4. A coordinator confirms or rejects the match.

### Verified Handover

1. Coordinator opens a confirmed match.
2. Guardian or group leader verification is completed.
3. Staff records verifier, method, notes and handover timestamp.
4. The case closes as safely reunited only after this handover step.
5. The action creates audit records and updates metrics.

### PA Escalation

1. Unresolved cases can be escalated by an authorised coordinator.
2. Staff prepares privacy-conscious announcement text.
3. PA escalation status is tracked.
4. PA remains a fallback workflow, not the primary handling mechanism.

### Offline Capture And Sync

1. Staff toggles or enters degraded connectivity mode.
2. New case submissions are stored in IndexedDB.
3. Pending operations are visible to authorised staff.
4. When connectivity is restored, operations sync into the case system.
5. Sync success or failure is auditable.

## Primary Demo Scenario

Event: Congress Night 2026.

1. A parent reports a separated child at the Information Bureau.
2. A volunteer at HelpPoint B records a found child and scans a SafeCard token.
3. The Assisted Match Engine links both cases using exact token match and compatible metadata.
4. A coordinator completes guardian verification.
5. The case closes as safely reunited.
6. Dashboard response-time metrics update.
7. A second fictional sample case demonstrates degraded connectivity, local queueing and PA escalation availability.

## Success Measures

- Median time from first report to safe reunion.
- Number of open missing-person cases.
- Number of found-person cases awaiting match.
- Number and percentage of safely reunited cases.
- Number of PA escalations.
- Offline reports pending and successfully synced.
- Case activity by HelpPoint.
- Separation hotspot indicators by location and time window.
- Audit completeness for critical actions.

## Non-Goals

- Public live tracking of children or vulnerable persons.
- Public search portal for sensitive case records.
- Facial recognition or biometric matching.
- Storing personal details inside QR codes.
- Replacing the Information Bureau, trained staff or PA system.
- Real attendee data in the prototype.
- Unverified self-service case closure.
- Emergency medical triage features beyond referral notes.
