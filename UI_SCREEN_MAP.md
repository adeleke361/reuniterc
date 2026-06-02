# ReuniteRC UI Screen Map

## Route Map

| Route | Primary role | Purpose |
| --- | --- | --- |
| `/` | Judge / public viewer | Premium product entry and demo launch |
| `/demo` | Judge / coordinator | Guided Congress Night 2026 simulation |
| `/reunite-points` | Coordinator / volunteer | Printable Reunite Point poster previews |
| `/report/person` | Public reporter / staff | Looking-for-person and found-person report capture |
| `/report/item` | Public reporter / staff | Lost-item and found-item report capture |
| `/matches/person` | Information Bureau Coordinator | Person match review with transparent rule reasons |
| `/matches/item` | Information Bureau Coordinator | Item match review with proof requirement |
| `/handover/person/[id]` | Information Bureau Coordinator | Verified person reunion workflow |
| `/release/item/[id]` | Information Bureau Coordinator | Verified item release workflow |
| `/announcements` | Information Bureau Coordinator | PA fallback queue |
| `/dashboard` | Information Bureau Coordinator | Operational command dashboard |
| `/analytics` | Leadership Viewer | Aggregate-only leadership analytics |

## Guided Demo Flow

1. View Reunite Point `RP-014` Arena Rear.
2. Report a fictional missing child.
3. Report a fictional found child from `RP-014`.
4. Review the rule-based person match recommendation.
5. Complete verified reunion.
6. Review the lost/found bag match.
7. Complete proof-of-ownership item release.
8. Toggle degraded connectivity and queue a staff report.
9. View PA fallback.
10. View aggregate leadership outcome.

## Role Boundaries

- Public Reporter / Attendee can submit reports only.
- HelpPoint Volunteer can create scoped reports and queue offline reports.
- Information Bureau Coordinator can review matches, confirm matches, complete handovers, release items and manage PA fallback.
- Leadership Viewer sees aggregate metrics only.

## Safety Boundaries Reflected In UI

- Reunite Points identify locations, not people.
- Match recommendations do not resolve cases.
- Person reunion requires verified handover.
- Item release requires proof of ownership.
- Degraded connectivity blocks final person reunion and item release.
- PA fallback does not automatically resolve cases.
- Leadership analytics omit sensitive details.
