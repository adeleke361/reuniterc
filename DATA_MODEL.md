# ReuniteRC Data Model

This document describes the planned Supabase PostgreSQL schema. All sample data must be fictional.

## Domain Status Values

The Phase 1B TypeScript domain kernel defines explicit unions for operational status values.

Person case status:

- `pending_sync`
- `report_created`
- `under_review`
- `possible_match_suggested`
- `match_confirmed_by_information_bureau`
- `verified_handover_completed`
- `safely_reunited`
- `closed_unresolved`

Item case status:

- `pending_sync`
- `report_created`
- `under_review`
- `possible_match_suggested`
- `match_confirmed_by_information_bureau`
- `proof_of_ownership_verified`
- `item_released`
- `closed_unresolved`

Other status values:

- match status: `suggested`, `confirmed`, `rejected`;
- escalation status: `draft`, `queued`, `announced`, `cancelled`;
- offline sync status: `pending`, `synced`, `failed`;
- connectivity status: `stable`, `degraded`.

`pending_sync` is used for locally captured offline reports until synchronisation succeeds. `safely_reunited` requires a verified person handover record. `item_released` requires an item release record with proof-of-ownership verification.

## Entity: events

Purpose: programme or service context for cases.

Important fields:

- `id uuid primary key`
- `name text not null`
- `starts_at timestamptz not null`
- `ends_at timestamptz`
- `status text not null`
- `venue_label text`
- `created_at timestamptz not null default now()`

Indexes:

- `events(status)`
- `events(starts_at)`

Privacy notes:

- Event records are operational and generally non-sensitive.

## Entity: reunite_points

Purpose: official poster, placard, billboard or help sign locations.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `code text not null`
- `name text not null`
- `zone text not null`
- `proximity_group text not null`
- `location_label text not null`
- `poster_type text not null`
- `official_short_url text not null`
- `fallback_instruction text not null`
- `tamper_check_instruction text not null`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes:

- `reunite_points(event_id, is_active)`
- `reunite_points(event_id, code) unique`
- `reunite_points(proximity_group)`
- `reunite_points(zone)`

Privacy notes:

- A Reunite Point identifies a reporting location, not a person.
- Visible QR codes must not contain personal details.
- Printed signs should include official branding, a visible short URL, Point Code and tamper-check guidance to reduce fake-poster risk.

## Entity: actor_profiles

Purpose: map authenticated or demo users to operational roles.

Important fields:

- `id uuid primary key`
- `auth_user_id uuid unique`
- `display_name text not null`
- `role text not null`
- `assigned_point_id uuid references reunite_points(id)`
- `is_active boolean not null default true`
- `is_demo boolean not null default false`
- `created_at timestamptz not null default now()`

Indexes:

- `actor_profiles(auth_user_id)`
- `actor_profiles(role, is_active)`
- `actor_profiles(assigned_point_id)`

Privacy notes:

- Staff contact details should be minimised and protected by RLS.
- Public reporter records, if stored, should be minimal and should not grant dashboard access.

## Entity: person_cases

Purpose: separated-person and found-person reports.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `report_source_point_id uuid references reunite_points(id)`
- `case_intent text not null`
- `status text not null`
- `person_category text not null`
- `approximate_age_band text not null`
- `reported_at timestamptz not null`
- `last_seen_or_found_location text not null`
- `group_or_church_reference text`
- `non_sensitive_description_tags text[] not null default '{}'`
- `sensitive_notes text`
- `urgency text not null default 'standard'`
- `public_reporter_reference text`
- `created_by_staff_id uuid references actor_profiles(id)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `resolved_at timestamptz`

Indexes:

- `person_cases(event_id, status)`
- `person_cases(event_id, case_intent, status)`
- `person_cases(report_source_point_id, reported_at)`
- `person_cases using gin(non_sensitive_description_tags)`

Privacy notes:

- Sensitive notes are staff-only.
- Public reporter references should be minimal and should not expose direct contact to unrelated parties.
- Leadership analytics must use aggregate data.
- Offline-created reports may exist locally as `pending_sync` before server synchronisation.

## Entity: item_cases

Purpose: lost-item and found-item reports.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `report_source_point_id uuid references reunite_points(id)`
- `item_intent text not null`
- `status text not null`
- `item_category text not null`
- `item_color_or_description_tags text[] not null default '{}'`
- `reported_at timestamptz not null`
- `last_seen_or_found_location text not null`
- `hidden_verification_detail text`
- `claimant_reference text`
- `urgency text not null default 'standard'`
- `public_reporter_reference text`
- `created_by_staff_id uuid references actor_profiles(id)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `resolved_at timestamptz`

Indexes:

- `item_cases(event_id, status)`
- `item_cases(event_id, item_intent, status)`
- `item_cases(report_source_point_id, reported_at)`
- `item_cases(item_category, status)`
- `item_cases using gin(item_color_or_description_tags)`

Privacy notes:

- Hidden verification detail is staff-only.
- Claimant and finder details must not be exposed to each other through public views.
- Item release requires proof-of-ownership verification.

## Entity: person_match_recommendations

Purpose: suggested, confirmed or rejected links between looking-for-person and found-person cases.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `looking_case_id uuid references person_cases(id)`
- `found_case_id uuid references person_cases(id)`
- `score integer not null`
- `tier text not null`
- `reasons jsonb not null`
- `status text not null`
- `reviewed_by_staff_id uuid references actor_profiles(id)`
- `reviewed_at timestamptz`
- `created_at timestamptz not null default now()`

Indexes:

- `person_match_recommendations(event_id, status)`
- `person_match_recommendations(looking_case_id)`
- `person_match_recommendations(found_case_id)`

Privacy notes:

- Match reasons must avoid unnecessary personal disclosure.
- Public users must not see sensitive matches.
- Human verification is required before reunion.

## Entity: item_match_recommendations

Purpose: suggested, confirmed or rejected links between lost-item and found-item cases.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `lost_item_case_id uuid references item_cases(id)`
- `found_item_case_id uuid references item_cases(id)`
- `score integer not null`
- `tier text not null`
- `reasons jsonb not null`
- `status text not null`
- `reviewed_by_staff_id uuid references actor_profiles(id)`
- `reviewed_at timestamptz`
- `created_at timestamptz not null default now()`

Indexes:

- `item_match_recommendations(event_id, status)`
- `item_match_recommendations(lost_item_case_id)`
- `item_match_recommendations(found_item_case_id)`

Privacy notes:

- Hidden verification compatibility is staff-only.
- Proof of ownership is required before release.

## Entity: person_handover_records

Purpose: verified reunion closure.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `match_id uuid references person_match_recommendations(id)`
- `looking_case_id uuid references person_cases(id)`
- `found_case_id uuid references person_cases(id)`
- `verified_reporter_reference text`
- `verification_method text not null`
- `verification_notes text`
- `approved_by_staff_id uuid references actor_profiles(id)`
- `handed_over_at timestamptz not null`
- `created_at timestamptz not null default now()`

Indexes:

- `person_handover_records(event_id, handed_over_at)`
- `person_handover_records(match_id)`
- `person_handover_records(looking_case_id)`
- `person_handover_records(found_case_id)`

Privacy notes:

- Verification notes are sensitive and coordinator-only.
- A person case cannot become safely reunited without a handover record.

## Entity: item_release_records

Purpose: verified item release closure.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `match_id uuid references item_match_recommendations(id)`
- `lost_item_case_id uuid references item_cases(id)`
- `found_item_case_id uuid references item_cases(id)`
- `claimant_reference text`
- `proof_of_ownership_method text not null`
- `proof_notes text`
- `released_by_staff_id uuid references actor_profiles(id)`
- `released_at timestamptz not null`
- `created_at timestamptz not null default now()`

Indexes:

- `item_release_records(event_id, released_at)`
- `item_release_records(match_id)`
- `item_release_records(lost_item_case_id)`
- `item_release_records(found_item_case_id)`

Privacy notes:

- Proof notes are sensitive and coordinator-only.
- A found item cannot be released without proof-of-ownership verification.

## Entity: announcement_escalations

Purpose: track PA escalation requests and status.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `case_kind text not null`
- `case_id uuid not null`
- `status text not null`
- `announcement_text text not null`
- `requested_by_staff_id uuid references actor_profiles(id)`
- `requested_at timestamptz not null default now()`
- `announced_at timestamptz`

Indexes:

- `announcement_escalations(event_id, status)`
- `announcement_escalations(case_kind, case_id)`

Privacy notes:

- Announcement text must be privacy-conscious and avoid unnecessary sensitive details.
- PA escalation never resolves a person or item case by itself.

## Entity: offline_sync_operations

Purpose: audit and reconcile queued offline mutations.

Important fields:

- `id uuid primary key`
- `client_operation_id text not null unique`
- `operation_type text not null`
- `actor_staff_id uuid references actor_profiles(id)`
- `local_entity_id uuid`
- `payload jsonb not null`
- `status text not null`
- `attempt_count integer not null default 0`
- `last_error text`
- `created_at timestamptz not null default now()`
- `synced_at timestamptz`

Indexes:

- `offline_sync_operations(status, created_at)`
- `offline_sync_operations(operation_type)`

Privacy notes:

- Payloads can include sensitive case details and must follow staff-only access policies.
- Offline payloads are limited to new person reports, new item reports and draft PA escalation requests.
- Match confirmation, person handover and item release are intentionally excluded from offline sync operations.

## Entity: audit_logs

Purpose: append-only record of important actions.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `actor_staff_id uuid references actor_profiles(id)`
- `action text not null`
- `entity_type text not null`
- `entity_id uuid`
- `metadata jsonb not null default '{}'`
- `created_at timestamptz not null default now()`

Indexes:

- `audit_logs(event_id, created_at)`
- `audit_logs(actor_staff_id, created_at)`
- `audit_logs(entity_type, entity_id)`
- `audit_logs(action)`

Privacy notes:

- Audit logs should be append-only.
- Metadata must avoid storing more sensitive detail than necessary.

## Relationship Summary

- An event has many Reunite Points, actor profiles, person cases and item cases.
- A Reunite Point can be the report source for many person and item cases.
- Person match recommendations connect one looking-for-person case to one found-person case.
- Item match recommendations connect one lost-item case to one found-item case.
- Person handover records close confirmed person cases as safely reunited.
- Item release records close confirmed item cases as released.
- Announcement escalations reference unresolved person or item cases.
- Offline sync operations record queued mutations and may reference local pending records.
- Audit logs reference important state changes across entities.
