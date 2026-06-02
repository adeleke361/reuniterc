# ReuniteRC Product Specification

## Product Identity

Name: ReuniteRC

Subtitle: Digital Reunification and Lost-and-Found solution for Major Programmes in Redemption City.

ReuniteRC is not a wearable, pass or pre-registration product. It is a digital support layer for the existing Redemption City Information Bureau process.

## Validated Problem

Major programmes in Redemption City bring very large crowds into a time-sensitive, high-emotion environment. Children, elderly attendees, vulnerable attendees and group members can become separated from their people. Attendees also lose important items such as bags, phones, wallets, books and cards.

Staff need a trustworthy way to capture reports, compare related records, escalate responsibly, verify handovers, verify item ownership and measure response performance without replacing Information Bureau judgement.

Network connectivity can become intermittent during large programmes, so the system must remain useful for authorised staff who already loaded the app and must provide a clear physical fallback when online forms cannot load.

## Existing Trusted Process

Redemption City already has an Information Bureau behind the auditorium. Separated-person cases can be reported there. The existing process uses authorised handling and public announcements through the altar/PA speaker system to help families or group leaders reconnect.

ReuniteRC strengthens this process by adding structured digital operations. It does not replace the Information Bureau, authorised staff judgement or PA announcements.

## Reunite Points

ReuniteRC uses official physical Reunite Points placed around camp. A Reunite Point may be a poster, placard, billboard or help desk sign.

Each Reunite Point displays:

- an online reporting QR code for when internet works;
- a visible Point Code such as `RP-014`;
- a visible location name such as `Arena Rear`;
- no-internet fallback instructions;
- official branding, visible short URL and tamper-check guidance.

Important rule: a Reunite Point identifies a reporting location, not a person.

## Value Proposition

ReuniteRC provides:

- structured reports for "I am looking for a separated person";
- structured reports for "I found someone who needs help";
- structured reports for "I lost an item";
- structured reports for "I found an item";
- rule-based assisted person and item matching with human confirmation;
- verified person handover before safe reunion;
- proof-of-ownership verification before item release;
- PA announcement escalation support;
- staff offline capture with later synchronisation;
- aggregate operational intelligence for leadership.

## Connectivity Model

Online mode:

- A person scans a Reunite Point and submits a report to the Information Bureau dashboard when internet works.

Staff offline mode:

- When network is poor but authorised staff or volunteers already loaded the app, they can record reports offline.
- Reports are stored locally and sync when connectivity returns.

No-internet physical fallback:

- If the QR form cannot load because there is no internet, the Reunite Point still displays a Point Code.
- The person reports the Point Code to an official volunteer, usher, security point or the Information Bureau.

PA fallback:

- PA/public announcement remains the trusted fallback for urgent or unresolved cases.

ReuniteRC must not claim that public users can submit digitally with zero internet if they have never loaded the form.

## Users And Roles

Information Bureau Coordinator:

- access operations dashboard;
- review and confirm suggested person and item matches;
- approve verified person handovers;
- release items after proof-of-ownership verification;
- escalate unresolved cases for PA announcements;
- review analytics and hotspots.

HelpPoint Volunteer:

- create looking-for-person and found-person reports;
- create lost-item and found-item reports;
- record Reunite Point context;
- submit cases for coordinator review;
- view only assigned or permitted operational information.

Leadership Viewer:

- view aggregate operational dashboard;
- review event-level trends, response times and hotspots;
- no access to sensitive case details.

Public Reporter / Attendee:

- submit reports only;
- no access to staff dashboard, sensitive notes, matches or contact details.

## MVP Workflows

### Looking-For-Person Report

1. A reporter uses a Reunite Point or official staff route to report a separated person.
2. The report captures the Point Code, approximate time, last known location, person category and non-sensitive description tags.
3. Staff-only notes are kept out of public views.
4. The case becomes available for assisted matching after Information Bureau review.
5. The action creates an audit record.

### Found-Person Report

1. A HelpPoint volunteer or public reporter records a found or assisted person.
2. The report captures person category, approximate age band, location, time and non-sensitive tags.
3. Sensitive notes remain staff-only.
4. The case is submitted for coordinator review.
5. If staff connectivity is degraded, the report is queued locally and synced later.

### Lost-Item Report

1. A reporter records a lost item from a Reunite Point or official staff route.
2. The report captures item category, description tags, location and time.
3. Hidden verification details are staff-only and used only for proof of ownership.
4. The case becomes available for item matching.

### Found-Item Report

1. A volunteer or public reporter records an item found at or near a Reunite Point.
2. Staff records category, description tags, found location and hidden verification details where appropriate.
3. No direct public contact between finder and claimant is exposed.
4. The case is submitted for coordinator review.

### Assisted Match Review

1. The person match engine compares looking-for-person and found-person reports.
2. The item match engine compares lost-item and found-item reports.
3. Scores are transparent and rule-based.
4. A coordinator confirms or rejects each recommendation.
5. A match suggestion alone never resolves a case.

### Verified Person Handover

1. Coordinator opens a confirmed person match.
2. Information Bureau verification is completed.
3. Staff records method, notes and handover timestamp.
4. The case closes as safely reunited only after verified handover.
5. The action creates audit records and updates metrics.

### Verified Item Release

1. Coordinator opens a confirmed item match.
2. Claimant proof of ownership is checked using staff-only detail and claim context.
3. Staff records proof method, notes and release timestamp.
4. The item case closes only after proof-of-ownership verification.
5. The action creates audit records and updates metrics.

### PA Escalation

1. Unresolved cases can be escalated by an authorised coordinator.
2. Staff prepares privacy-conscious announcement text.
3. PA escalation status is tracked.
4. PA remains a fallback workflow and never resolves a case by itself.

### Offline Capture And Sync

1. Staff enters degraded connectivity mode.
2. New person reports, item reports and draft PA requests can be stored locally.
3. Pending operations remain `pending_sync` until stable sync succeeds.
4. Match confirmation, person handover and item release are blocked offline.
5. Sync success or failure is auditable.

## Primary Demo Scenario

Event: Congress Night 2026.

1. A missing-child report is created from Arena Rear Reunite Point `RP-014`.
2. A found-child report is created from the same Reunite Point.
3. The Person Match Engine recommends a strong match using point proximity, time, category, age band, group reference and description tags.
4. A coordinator confirms the match and completes Information Bureau handover verification.
5. The person cases close as safely reunited.
6. A lost-bag report and found-bag report demonstrate item matching and proof-of-ownership release.
7. Separate fictional examples demonstrate PA fallback and queued offline person/item reports.

## Success Measures

- Median time from first person report to safe reunion.
- Median time from first item report to item release.
- Number of open looking-for-person cases.
- Number of found-person cases awaiting match.
- Number of open lost-item cases.
- Number of found-item cases awaiting release.
- Number and percentage of safely reunited person cases.
- Number and percentage of released item cases.
- Number of PA escalations.
- Offline reports pending and successfully synced.
- Case activity by Reunite Point.
- Hotspot indicators by location and time window.
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
- Separate connectivity equipment for the Stage 2 prototype.
