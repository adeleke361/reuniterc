# ReuniteRC UI Screen Map

## Route Map

| Route | Primary role | Purpose |
| --- | --- | --- |
| `/` | Judge / public viewer | Premium product entry and demo launch |
| `/demo` | Judge / coordinator | Guided Congress Night 2026 simulation with staged outcome reveal |
| `/reunite-points` | Coordinator / volunteer | Reunite Point poster generator with print, PNG export and short URL copy |
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

1. Ready / View `RP-014`.
2. Missing child reported.
3. Found child reported from `RP-014`.
4. Person match recommended.
5. Guardian/group verification.
6. Safely Reunited.
7. Lost-and-found item match.
8. Proof-of-ownership item release.
9. Low-connectivity/offline queue test.
10. Leadership outcome.

The demo starts without completed outcomes. Match scores appear only at match review, Safely Reunited appears only after verified handover, Item Released appears only after proof-of-ownership verification, and offline queued report count appears only during the offline queue test.

## Poster Generator

- Print selected poster.
- Download selected poster as PNG.
- Copy short URL.
- Print all posters.
- Poster content includes ReuniteRC branding, QR representation, Point Code, location name, realistic short URL, no-internet fallback instruction and tamper-check guidance.

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
- Public announcement fallback does not automatically resolve cases.
- Leadership analytics omit sensitive details.

## Stage 2 Prototype Readiness

- Guided demo behaviour is sequenced for judging.
- Poster export supports operational handouts.
- Demo data is fictional and visible case handling stays within authorised workflows.
