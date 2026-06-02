# ReuniteRC API Contracts

The prototype may implement these as Next.js route handlers or server actions. Payloads are shown as REST-style contracts for clarity. All examples use fictional data.

## Implementation Pattern

The locked Supabase design is hybrid:

- authenticated workflow mutations should use server actions when the Supabase adapter is added;
- sync/API-style operations may use route handlers where appropriate;
- the Phase 1B demo adapter uses in-memory repositories behind the same service contracts.

Offline sync is limited to new person reports, new item reports and draft PA escalation requests. Match confirmation, person handover and item release require connected Information Bureau workflow.

## Shared Error Shape

```json
{
  "ok": false,
  "error": {
    "code": "forbidden",
    "message": "You are not authorised to perform this action."
  }
}
```

## List Reunite Points

Route: `GET /api/reunite-points?eventId=evt_congress_night_2026`

Authorised roles:

- `information_bureau_coordinator`
- `helppoint_volunteer`
- `leadership_viewer`

Success:

```json
{
  "ok": true,
  "data": [
    {
      "id": "point_arena_rear",
      "code": "RP-014",
      "name": "Arena Rear Reunite Point",
      "zone": "Arena Rear",
      "locationLabel": "Arena Rear access walkway",
      "officialShortUrl": "https://rc.example/rp014",
      "fallbackInstruction": "If the QR form does not load, report this Point Code to an official volunteer, usher, security point or the Information Bureau.",
      "tamperCheckInstruction": "Confirm official branding, visible short URL and intact poster serial before scanning."
    }
  ]
}
```

Notes:

- A Reunite Point identifies a reporting location, not a person.
- QR content must not contain personal or sensitive case details.

## Submit Looking-For-Person Report

Route: `POST /api/person-cases/looking`

Authorised roles:

- `information_bureau_coordinator`
- `helppoint_volunteer`
- `public_reporter`

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "reportSourcePointId": "point_arena_rear",
  "personCategory": "child",
  "approximateAgeBand": "6-8",
  "reportedAt": "2026-08-10T20:15:00Z",
  "lastSeenOrFoundLocation": "Arena Rear access walkway",
  "groupOrChurchReference": "Fictional Province Alpha Group",
  "nonSensitiveDescriptionTags": ["blue-top", "small-backpack"],
  "sensitiveNotes": "Fictional staff-only note.",
  "urgency": "urgent",
  "publicReporterReference": "Fictional reporter reference"
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "caseId": "person_looking_001",
    "status": "report_created"
  }
}
```

## Submit Found-Person Report

Route: `POST /api/person-cases/found`

Authorised roles:

- `information_bureau_coordinator`
- `helppoint_volunteer`
- `public_reporter`

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "reportSourcePointId": "point_arena_rear",
  "personCategory": "child",
  "approximateAgeBand": "6-8",
  "reportedAt": "2026-08-10T20:26:00Z",
  "lastSeenOrFoundLocation": "Arena Rear volunteer desk",
  "groupOrChurchReference": "Fictional Province Alpha Group",
  "nonSensitiveDescriptionTags": ["blue-top", "small-backpack"],
  "sensitiveNotes": "Fictional staff-only note.",
  "urgency": "urgent"
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "caseId": "person_found_001",
    "status": "report_created"
  }
}
```

## Submit Lost-Item Report

Route: `POST /api/item-cases/lost`

Authorised roles:

- `information_bureau_coordinator`
- `helppoint_volunteer`
- `public_reporter`

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "reportSourcePointId": "point_arena_rear",
  "itemCategory": "bag",
  "itemColorOrDescriptionTags": ["black-bag", "notebook-sticker"],
  "reportedAt": "2026-08-10T20:10:00Z",
  "lastSeenOrFoundLocation": "Arena Rear seating row",
  "hiddenVerificationDetail": "Fictional yellow ribbon on inner zipper",
  "claimantReference": "Fictional claimant reference",
  "urgency": "standard"
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "caseId": "item_lost_001",
    "status": "report_created"
  }
}
```

## Submit Found-Item Report

Route: `POST /api/item-cases/found`

Authorised roles:

- `information_bureau_coordinator`
- `helppoint_volunteer`
- `public_reporter`

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "reportSourcePointId": "point_arena_rear",
  "itemCategory": "bag",
  "itemColorOrDescriptionTags": ["black-bag", "notebook-sticker"],
  "reportedAt": "2026-08-10T20:42:00Z",
  "lastSeenOrFoundLocation": "Arena Rear volunteer desk",
  "hiddenVerificationDetail": "Fictional yellow ribbon on inner zipper",
  "urgency": "standard"
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "caseId": "item_found_001",
    "status": "report_created"
  }
}
```

## Compute Suggested Person Matches

Route: `POST /api/person-matches/suggest`

Authorised roles:

- `information_bureau_coordinator`

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "lookingCaseId": "person_looking_001"
}
```

Success:

```json
{
  "ok": true,
  "data": [
    {
      "lookingCaseId": "person_looking_001",
      "foundCaseId": "person_found_001",
      "score": 100,
      "tier": "strong_match_recommendation",
      "reasons": [
        "Same or nearby Reunite Point proximity group",
        "Reports within 30 minutes",
        "Same person category",
        "Compatible age band",
        "Group reference overlap",
        "Non-sensitive description tags overlap",
        "Human verification required before reunion."
      ]
    }
  ]
}
```

Notes:

- This is a transparent rule-based engine.
- Human verification is required before reunion.

## Compute Suggested Item Matches

Route: `POST /api/item-matches/suggest`

Authorised roles:

- `information_bureau_coordinator`

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "lostItemCaseId": "item_lost_001"
}
```

Success:

```json
{
  "ok": true,
  "data": [
    {
      "lostItemCaseId": "item_lost_001",
      "foundItemCaseId": "item_found_001",
      "score": 100,
      "tier": "strong_match_recommendation",
      "reasons": [
        "Same item category",
        "Same or compatible Reunite Point zone",
        "Reasonable report-time window",
        "Colour or description tags overlap",
        "Staff-only hidden verification detail is compatible",
        "Proof of ownership required before release."
      ]
    }
  ]
}
```

Notes:

- Hidden verification detail must remain staff-only.
- Proof of ownership is required before release.

## Confirm Or Reject Person Match

Route: `POST /api/person-matches/{matchId}/decision`

Authorised roles:

- `information_bureau_coordinator`

Request:

```json
{
  "decision": "confirmed",
  "reviewNotes": "Fictional coordinator confirmation."
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "matchId": "person_match_001",
    "status": "confirmed"
  }
}
```

Connected-workflow error:

```json
{
  "ok": false,
  "error": {
    "code": "connected_workflow_required",
    "message": "Match confirmation requires connected Information Bureau workflow."
  }
}
```

## Confirm Or Reject Item Match

Route: `POST /api/item-matches/{matchId}/decision`

Authorised roles:

- `information_bureau_coordinator`

Request:

```json
{
  "decision": "confirmed",
  "reviewNotes": "Fictional item match confirmation."
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "matchId": "item_match_001",
    "status": "confirmed"
  }
}
```

## Record Verified Person Handover

Route: `POST /api/person-handovers`

Authorised roles:

- `information_bureau_coordinator`

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "matchId": "person_match_001",
  "verifiedReporterReference": "Fictional reporter reference",
  "verificationMethod": "Information Bureau interview and group reference check",
  "verificationNotes": "Fictional verification note for authorised staff only.",
  "handedOverAt": "2026-08-10T20:42:00Z"
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "handoverId": "person_handover_001",
    "caseStatus": "safely_reunited"
  }
}
```

## Record Verified Item Release

Route: `POST /api/item-releases`

Authorised roles:

- `information_bureau_coordinator`

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "matchId": "item_match_001",
  "claimantReference": "Fictional claimant reference",
  "proofOfOwnershipMethod": "Hidden item detail and claimant description matched",
  "proofNotes": "Fictional proof note for authorised staff only.",
  "releasedAt": "2026-08-10T20:50:00Z"
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "releaseId": "item_release_001",
    "caseStatus": "item_released"
  }
}
```

## Escalate To PA Announcement

Route: `POST /api/announcements`

Authorised roles:

- `information_bureau_coordinator`

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "caseKind": "person_case",
  "caseId": "person_looking_002",
  "announcementText": "Privacy-conscious fictional announcement text.",
  "reason": "Unresolved after coordinator review"
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "announcementId": "announcement_demo_001",
    "status": "queued"
  }
}
```

Notes:

- PA escalation does not resolve person or item cases.

## Dashboard Metrics

Route: `GET /api/dashboard?eventId=evt_congress_night_2026`

Authorised roles:

- `information_bureau_coordinator`
- `leadership_viewer` with aggregate response only

Success:

```json
{
  "ok": true,
  "data": {
    "eventName": "Congress Night 2026",
    "connectivityStatus": "stable",
    "personReportsTotal": 12,
    "itemReportsTotal": 7,
    "openLookingForPersonCases": 3,
    "foundPersonsAwaitingMatch": 2,
    "openLostItemCases": 2,
    "foundItemsAwaitingMatch": 1,
    "safelyReunitedTotal": 4,
    "releasedItemsTotal": 3,
    "medianReunionMinutes": 24,
    "medianItemReleaseMinutes": 31,
    "paEscalations": 1,
    "offlineReportsPendingSync": 0,
    "sensitiveCaseDetailsIncluded": false
  }
}
```

## Synchronise Offline Queue

Route: `POST /api/sync/offline`

Authorised roles:

- `information_bureau_coordinator`
- `helppoint_volunteer`

Request:

```json
{
  "operations": [
    {
      "clientOperationId": "offline_demo_001",
      "operationType": "create_found_person_report",
      "createdAt": "2026-08-10T20:30:00Z",
      "payload": {
        "eventId": "evt_congress_night_2026",
        "reportSourcePointId": "point_arena_rear",
        "caseIntent": "found_person",
        "personCategory": "child",
        "approximateAgeBand": "6-8",
        "lastSeenOrFoundLocation": "Arena Rear volunteer desk"
      }
    }
  ]
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "synced": [
      {
        "clientOperationId": "offline_demo_001",
        "serverEntityId": "person_found_002",
        "status": "synced"
      }
    ],
    "failed": []
  }
}
```

Offline operation constraints:

- `create_looking_for_person_report`, `create_found_person_report`, `create_lost_item_report` and `create_found_item_report` may create local `pending_sync` records before sync.
- `draft_announcement_escalation` may be queued offline as a draft only.
- Match decisions, verified handovers and item releases are not accepted through offline sync.
