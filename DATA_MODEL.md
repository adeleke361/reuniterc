# ReuniteRC Data Model

This document describes the planned Supabase PostgreSQL schema. All sample data must be fictional.

## Domain Status Values

The Phase 1 TypeScript domain kernel defines explicit unions for operational status values:

- case status: `pending_sync`, `reported`, `under_review`, `match_pending_handover`, `safely_reunited`, `closed_unresolved`;
- match status: `suggested`, `confirmed`, `rejected`;
- escalation status: `draft`, `queued`, `announced`, `resolved`, `cancelled`;
- offline sync status: `pending`, `synced`, `failed`;
- connectivity status: `stable`, `degraded`.

`pending_sync` is used for locally captured offline reports until synchronisation succeeds. `safely_reunited` requires a verified handover record.

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

## Entity: help_points

Purpose: authorised physical assistance locations.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `name text not null`
- `zone text`
- `location_label text not null`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`

Indexes:

- `help_points(event_id, is_active)`
- `help_points(zone)`

## Entity: staff_profiles

Purpose: map authenticated staff users to operational roles.

Important fields:

- `id uuid primary key`
- `auth_user_id uuid unique`
- `display_name text not null`
- `role text not null`
- `help_point_id uuid references help_points(id)`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`

Indexes:

- `staff_profiles(auth_user_id)`
- `staff_profiles(role, is_active)`

Privacy notes:

- Staff contact details should be minimised and protected by RLS.

## Entity: guardians

Purpose: optional guardian or group leader profile for SafeCard use and verified handover.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `display_label text not null`
- `relationship_label text`
- `contact_hint text`
- `created_at timestamptz not null default now()`

Indexes:

- `guardians(event_id)`

Privacy notes:

- Avoid exposing guardian details outside authorised workflows.
- Do not encode guardian data in QR codes.

## Entity: safety_cards

Purpose: QR SafeCard/SafeBand token registration.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `guardian_id uuid references guardians(id)`
- `token_hash text not null unique`
- `token_last4 text not null`
- `label text`
- `status text not null`
- `created_at timestamptz not null default now()`
- `revoked_at timestamptz`

Indexes:

- `safety_cards(event_id, status)`
- `safety_cards(token_hash)`

Privacy notes:

- Store a hash of the secure token server-side.
- Display QR codes containing only the raw secure random token at generation time.
- Never store names or phone numbers inside QR content.

## Entity: separation_cases

Purpose: missing or found/assisted case records.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `case_type text not null`
- `status text not null`
- `person_category text not null`
- `approx_age_band text`
- `reported_at timestamptz not null`
- `last_seen_or_found_location text`
- `help_point_id uuid references help_points(id)`
- `safety_card_id uuid references safety_cards(id)`
- `description_tags text[] not null default '{}'`
- `sensitive_notes text`
- `priority text not null default 'standard'`
- `created_by_staff_id uuid references staff_profiles(id)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes:

- `separation_cases(event_id, status)`
- `separation_cases(case_type, status)`
- `separation_cases(safety_card_id)`
- `separation_cases(help_point_id, reported_at)`
- `separation_cases using gin(description_tags)`

Privacy notes:

- Sensitive notes are staff-only.
- Leadership analytics must use anonymised or aggregated data.
- Offline-created case records may exist locally as `pending_sync` before server synchronisation.

## Entity: case_matches

Purpose: suggested, confirmed or rejected links between missing and found cases.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `missing_case_id uuid references separation_cases(id)`
- `found_case_id uuid references separation_cases(id)`
- `score integer not null`
- `reasons jsonb not null`
- `status text not null`
- `reviewed_by_staff_id uuid references staff_profiles(id)`
- `reviewed_at timestamptz`
- `created_at timestamptz not null default now()`

Indexes:

- `case_matches(event_id, status)`
- `case_matches(missing_case_id)`
- `case_matches(found_case_id)`

Privacy notes:

- Match reasons must avoid unnecessary personal disclosure.

## Entity: handover_records

Purpose: verified reunion closure.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `match_id uuid references case_matches(id)`
- `case_id uuid references separation_cases(id)`
- `guardian_id uuid references guardians(id)`
- `verification_method text not null`
- `verification_notes text`
- `approved_by_staff_id uuid references staff_profiles(id)`
- `handed_over_at timestamptz not null`
- `created_at timestamptz not null default now()`

Indexes:

- `handover_records(event_id, handed_over_at)`
- `handover_records(match_id)`
- `handover_records(case_id)`

Privacy notes:

- Verification notes are sensitive and coordinator-only.
- A case cannot become safely reunited without a handover record.

## Entity: announcement_escalations

Purpose: track PA escalation requests and status.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `case_id uuid references separation_cases(id)`
- `status text not null`
- `announcement_text text not null`
- `requested_by_staff_id uuid references staff_profiles(id)`
- `requested_at timestamptz not null default now()`
- `announced_at timestamptz`
- `resolved_at timestamptz`

Indexes:

- `announcement_escalations(event_id, status)`
- `announcement_escalations(case_id)`

Privacy notes:

- Announcement text must be privacy-conscious and avoid unnecessary sensitive details.

## Entity: offline_sync_operations

Purpose: audit and reconcile queued offline mutations.

Important fields:

- `id uuid primary key`
- `client_operation_id text not null unique`
- `operation_type text not null`
- `actor_staff_id uuid references staff_profiles(id)`
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
- Offline payloads are limited to new missing reports, found reports and draft PA escalation requests.
- Match confirmation, guardian verification and final handover closure are intentionally excluded from offline sync operations.

## Entity: audit_logs

Purpose: append-only record of important actions.

Important fields:

- `id uuid primary key`
- `event_id uuid references events(id)`
- `actor_staff_id uuid references staff_profiles(id)`
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

- An event has many HelpPoints, staff profiles, guardians, SafeCards and cases.
- A guardian may have one or more SafeCards.
- A separation case may reference one SafeCard and one HelpPoint.
- Case matches connect one missing case to one found case.
- Handover records close confirmed cases as safely reunited.
- Announcement escalations reference unresolved cases.
- Offline sync operations record queued mutations and may reference a local pending case record.
- Audit logs reference important state changes across entities.

## SafeCard Token Privacy

Production storage must contain only `token_hash` and `token_last4`. Raw QR tokens are generated server-side and returned only at generation time for display/printing. Demo data may use fictional token strings for tests and manual lookup, but repository and service interfaces remain hash-based.
