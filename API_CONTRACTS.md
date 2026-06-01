# ReuniteRC API Contracts

The prototype may implement these as Next.js route handlers or server actions. Payloads are shown as REST-style contracts for clarity. All examples use fictional data.

## Implementation Pattern

The locked Supabase design is hybrid:

- authenticated workflow mutations should use server actions when the Supabase adapter is added;
- sync/API-style operations may use route handlers where appropriate;
- the Phase 1 demo adapter uses in-memory repositories behind the same service contracts.

Offline sync is limited to new missing-person reports, found-person reports and draft PA escalation requests. Match confirmation, guardian verification and final handover closure require connected coordinator workflow.

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

## Register Safety Card

Route: `POST /api/safety-cards`

Authorised roles:

- `information_bureau_coordinator`
- `helppoint_volunteer`
- `guardian_group_leader` for limited self-registration flow

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "guardianDisplayLabel": "Fictional Parent A",
  "relationshipLabel": "Parent",
  "cardLabel": "Child SafeCard 01"
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "safetyCardId": "card_demo_001",
    "qrToken": "demo-secure-random-token-only",
    "tokenLast4": "only"
  }
}
```

Notes:

- `qrToken` is returned only at generation time.
- QR content must contain only the secure token.
- Server storage should use a token hash.
- Production token generation must occur server-side with cryptographically secure randomness.

## Authorised SafeCard Token Lookup

Route: `POST /api/safety-cards/lookup`

Authorised roles:

- `information_bureau_coordinator`
- `helppoint_volunteer`

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "qrToken": "demo-secure-random-token-only"
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "safetyCardId": "card_demo_001",
    "tokenLast4": "only",
    "status": "active",
    "guardianDisplayLabel": "Fictional Parent A"
  }
}
```

Error:

```json
{
  "ok": false,
  "error": {
    "code": "not_found",
    "message": "No active Safety Card was found for that token."
  }
}
```

## Submit Missing-Person Case

Route: `POST /api/cases/missing`

Authorised roles:

- `information_bureau_coordinator`
- `helppoint_volunteer`

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "personCategory": "child",
  "approxAgeBand": "6-8",
  "reportedAt": "2026-08-10T20:15:00Z",
  "lastSeenLocation": "Auditorium East Entrance",
  "safetyCardToken": "optional-secure-token",
  "descriptionTags": ["blue-top", "small-backpack"],
  "sensitiveNotes": "Fictional demo note for authorised staff only."
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "caseId": "case_missing_001",
    "status": "open"
  }
}
```

Validation error:

```json
{
  "ok": false,
  "error": {
    "code": "validation_error",
    "message": "Person category and report location are required."
  }
}
```

## Submit Found-Person Case

Route: `POST /api/cases/found`

Authorised roles:

- `information_bureau_coordinator`
- `helppoint_volunteer`

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "helpPointId": "hp_b",
  "personCategory": "child",
  "approxAgeBand": "6-8",
  "reportedAt": "2026-08-10T20:26:00Z",
  "foundLocation": "HelpPoint B",
  "safetyCardToken": "optional-secure-token",
  "descriptionTags": ["blue-top", "small-backpack"],
  "sensitiveNotes": "Fictional demo note for authorised staff only."
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "caseId": "case_found_001",
    "status": "awaiting_match"
  }
}
```

## List Open Cases

Route: `GET /api/cases?eventId=evt_congress_night_2026&status=open`

Authorised roles:

- `information_bureau_coordinator`
- `helppoint_volunteer` with scoped visibility
- `leadership_viewer` only for anonymised summary mode

Success:

```json
{
  "ok": true,
  "data": [
    {
      "caseId": "case_missing_001",
      "caseType": "missing",
      "status": "open",
      "personCategory": "child",
      "approxAgeBand": "6-8",
      "locationLabel": "Auditorium East Entrance",
      "reportedAt": "2026-08-10T20:15:00Z"
    }
  ]
}
```

## Compute Suggested Matches

Route: `POST /api/matches/suggest`

Authorised roles:

- `information_bureau_coordinator`

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "caseId": "case_missing_001"
}
```

Success:

```json
{
  "ok": true,
  "data": [
    {
      "missingCaseId": "case_missing_001",
      "foundCaseId": "case_found_001",
      "score": 96,
      "reasons": [
        "Exact SafeCard token match",
        "Same person category",
        "Compatible age band",
        "Reported within 15 minutes",
        "Two shared description tags"
      ]
    }
  ]
}
```

Notes:

- This is a rule-based assisted match engine, not AI.
- Human confirmation is required.

## Confirm Or Reject Match

Route: `POST /api/matches/{matchId}/decision`

Authorised roles:

- `information_bureau_coordinator`

Request:

```json
{
  "decision": "confirmed",
  "reviewNotes": "Fictional demo coordinator confirmation."
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "matchId": "match_demo_001",
    "status": "confirmed"
  }
}
```

## Record Verified Handover

Route: `POST /api/handover`

Authorised roles:

- `information_bureau_coordinator`

Request:

```json
{
  "eventId": "evt_congress_night_2026",
  "matchId": "match_demo_001",
  "verificationMethod": "SafeCard token plus staff interview",
  "verificationNotes": "Fictional verification note for authorised staff only.",
  "handedOverAt": "2026-08-10T20:42:00Z"
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "handoverId": "handover_demo_001",
    "caseStatus": "safely_reunited"
  }
}
```

Error:

```json
{
  "ok": false,
  "error": {
    "code": "match_not_confirmed",
    "message": "A match must be confirmed before handover can be recorded."
  }
}
```

Connected-workflow error:

```json
{
  "ok": false,
  "error": {
    "code": "connected_workflow_required",
    "message": "Verified handover closure requires connected coordinator workflow."
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
  "caseId": "case_missing_002",
  "announcementText": "Privacy-conscious fictional announcement text.",
  "reason": "Unresolved after coordinator review"
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "announcementId": "ann_demo_001",
    "status": "queued"
  }
}
```

## Dashboard Metrics

Route: `GET /api/dashboard?eventId=evt_congress_night_2026`

Authorised roles:

- `information_bureau_coordinator`
- `leadership_viewer` with anonymised response

Success:

```json
{
  "ok": true,
  "data": {
    "eventName": "Congress Night 2026",
    "connectivityStatus": "stable",
    "openMissingCases": 3,
    "foundAwaitingMatch": 2,
    "safelyReunitedTotal": 18,
    "medianReunionMinutes": 24,
    "paEscalations": 1,
    "offlineReportsPendingSync": 0,
    "hotspots": [
      {
        "locationLabel": "Auditorium East Entrance",
        "caseCount": 4
      }
    ]
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
      "operationType": "submit_found_case",
      "createdAt": "2026-08-10T20:30:00Z",
      "payload": {
        "eventId": "evt_congress_night_2026",
        "helpPointId": "hp_b",
        "personCategory": "child",
        "approxAgeBand": "6-8",
        "foundLocation": "HelpPoint B"
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
        "serverEntityId": "case_found_002",
        "status": "synced"
      }
    ],
    "failed": []
  }
}
```

Offline operation constraints:

- `submit_missing_case` and `submit_found_case` may create local `pending_sync` records before sync.
- `draft_announcement_escalation` may be queued offline as a draft only.
- Match decisions and verified handovers are not accepted through offline sync.
