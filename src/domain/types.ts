export type ISODateString = string;
export type EntityId = string;

export type StaffRole =
  | "information_bureau_coordinator"
  | "helppoint_volunteer"
  | "leadership_viewer"
  | "guardian_group_leader";

export type EventStatus = "scheduled" | "active" | "completed";
export type PersonCategory = "child" | "elderly_attendee" | "adult" | "group_member";
export type CaseType = "missing" | "found";
export type CaseStatus =
  | "pending_sync"
  | "reported"
  | "under_review"
  | "match_pending_handover"
  | "safely_reunited"
  | "closed_unresolved";
export type Urgency = "standard" | "elevated" | "urgent";
export type MatchStatus = "suggested" | "confirmed" | "rejected";
export type EscalationStatus = "draft" | "queued" | "announced" | "resolved" | "cancelled";
export type ConnectivityStatus = "stable" | "degraded";
export type SafetyCardStatus = "active" | "revoked";
export type OfflineOperationType =
  | "create_missing_case"
  | "create_found_case"
  | "draft_announcement_escalation";
export type OfflineSyncStatus = "pending" | "synced" | "failed";
export type MatchRecommendationTier =
  | "strong_match_recommendation"
  | "review_recommended"
  | "insufficient_confidence";
export type AgeBand = "0-5" | "6-8" | "9-12" | "13-17" | "18-59" | "60+" | "unknown";
export type ProximityGroup =
  | "auditorium"
  | "arena_rear"
  | "main_gate"
  | "transport"
  | "other";

export type AuditEventType =
  | "safecard.registered"
  | "safecard.lookup"
  | "case.created"
  | "case.review_started"
  | "case.synced"
  | "match.suggested"
  | "match.confirmed"
  | "match.rejected"
  | "handover.verified"
  | "case.safely_reunited"
  | "announcement.drafted"
  | "announcement.escalated"
  | "offline.queued"
  | "offline.synced"
  | "offline.failed";

export interface Event {
  id: EntityId;
  name: string;
  status: EventStatus;
  startsAt: ISODateString;
  endsAt?: ISODateString;
  venueLabel: string;
  createdAt: ISODateString;
}

export interface HelpPoint {
  id: EntityId;
  eventId: EntityId;
  name: string;
  zone: string;
  proximityGroup: ProximityGroup;
  locationLabel: string;
  isActive: boolean;
  createdAt: ISODateString;
}

export interface StaffProfile {
  id: EntityId;
  authUserId?: EntityId;
  displayName: string;
  role: StaffRole;
  helpPointId?: EntityId;
  isActive: boolean;
  isDemo: boolean;
  createdAt: ISODateString;
}

export interface Guardian {
  id: EntityId;
  eventId: EntityId;
  displayLabel: string;
  relationshipLabel?: string;
  contactHint?: string;
  isDemo: boolean;
  createdAt: ISODateString;
}

export interface SafetyCard {
  id: EntityId;
  eventId: EntityId;
  guardianId?: EntityId;
  tokenHash: string;
  tokenLast4: string;
  label?: string;
  status: SafetyCardStatus;
  createdAt: ISODateString;
  revokedAt?: ISODateString;
}

export interface SeparationCase {
  id: EntityId;
  eventId: EntityId;
  caseType: CaseType;
  status: CaseStatus;
  personCategory: PersonCategory;
  approxAgeBand: AgeBand;
  reportedAt: ISODateString;
  lastSeenOrFoundLocation: string;
  helpPointId: EntityId;
  safetyCardId?: EntityId;
  descriptionTags: string[];
  sensitiveNotes?: string;
  urgency: Urgency;
  createdByStaffId: EntityId;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  resolvedAt?: ISODateString;
}

export interface MatchReason {
  code:
    | "exact_safecard_token"
    | "person_category"
    | "age_band"
    | "location_proximity"
    | "time_proximity"
    | "description_tags"
    | "human_verification_required";
  label: string;
  points: number;
}

export interface CaseMatch {
  id: EntityId;
  eventId: EntityId;
  missingCaseId: EntityId;
  foundCaseId: EntityId;
  score: number;
  tier: MatchRecommendationTier;
  reasons: MatchReason[];
  status: MatchStatus;
  reviewedByStaffId?: EntityId;
  reviewedAt?: ISODateString;
  createdAt: ISODateString;
}

export interface HandoverRecord {
  id: EntityId;
  eventId: EntityId;
  matchId: EntityId;
  missingCaseId: EntityId;
  foundCaseId: EntityId;
  guardianId?: EntityId;
  verificationMethod: string;
  verificationNotes?: string;
  approvedByStaffId: EntityId;
  handedOverAt: ISODateString;
  createdAt: ISODateString;
}

export interface AnnouncementEscalation {
  id: EntityId;
  eventId: EntityId;
  caseId: EntityId;
  status: EscalationStatus;
  announcementText: string;
  requestedByStaffId: EntityId;
  requestedAt: ISODateString;
  announcedAt?: ISODateString;
  resolvedAt?: ISODateString;
}

export type OfflineOperationPayload =
  | {
      caseType: "missing";
      eventId: EntityId;
      helpPointId: EntityId;
      personCategory: PersonCategory;
      approxAgeBand: AgeBand;
      reportedAt: ISODateString;
      lastSeenLocation: string;
      descriptionTags: string[];
      sensitiveNotes?: string;
      urgency: Urgency;
      safetyCardToken?: string;
    }
  | {
      caseType: "found";
      eventId: EntityId;
      helpPointId: EntityId;
      personCategory: PersonCategory;
      approxAgeBand: AgeBand;
      reportedAt: ISODateString;
      foundLocation: string;
      descriptionTags: string[];
      sensitiveNotes?: string;
      urgency: Urgency;
      safetyCardToken?: string;
    }
  | {
      operation: "draft_announcement_escalation";
      eventId: EntityId;
      caseId: EntityId;
      announcementText: string;
      requestedAt: ISODateString;
    };

export interface OfflineSyncOperation {
  id: EntityId;
  clientOperationId: string;
  operationType: OfflineOperationType;
  actorStaffId: EntityId;
  localEntityId?: EntityId;
  payload: OfflineOperationPayload;
  status: OfflineSyncStatus;
  attemptCount: number;
  lastError?: string;
  createdAt: ISODateString;
  syncedAt?: ISODateString;
}

export interface AuditLog {
  id: EntityId;
  eventId: EntityId;
  actorStaffId?: EntityId;
  action: AuditEventType;
  entityType:
    | "event"
    | "help_point"
    | "staff_profile"
    | "guardian"
    | "safety_card"
    | "separation_case"
    | "case_match"
    | "handover_record"
    | "announcement_escalation"
    | "offline_sync_operation";
  entityId?: EntityId;
  metadata: Record<string, string | number | boolean | null>;
  createdAt: ISODateString;
}

export interface DashboardHotspot {
  locationLabel: string;
  caseCount: number;
}

export interface DashboardSummary {
  view: "operations" | "leadership_aggregate";
  eventId: EntityId;
  eventName: string;
  connectivityStatus: ConnectivityStatus;
  openMissingCases: number;
  foundAwaitingMatch: number;
  safelyReunitedTotal: number;
  medianReunionMinutes: number | null;
  paEscalations: number;
  offlineReportsPendingSync: number;
  urgentUnresolvedCases: number;
  hotspots: DashboardHotspot[];
  sensitiveCaseDetailsIncluded: false;
}
