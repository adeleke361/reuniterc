export type ISODateString = string;
export type EntityId = string;

export type StaffRole =
  | "information_bureau_coordinator"
  | "helppoint_volunteer"
  | "leadership_viewer"
  | "public_reporter";

export type EventStatus = "scheduled" | "active" | "completed";
export type PersonCategory = "child" | "elderly_attendee" | "vulnerable_attendee" | "group_member";
export type PersonCaseIntent = "looking_for_person" | "found_person";
export type ItemCaseIntent = "lost_item" | "found_item";
export type PersonCaseStatus =
  | "pending_sync"
  | "report_created"
  | "under_review"
  | "possible_match_suggested"
  | "match_confirmed_by_information_bureau"
  | "verified_handover_completed"
  | "safely_reunited"
  | "closed_unresolved";
export type ItemCaseStatus =
  | "pending_sync"
  | "report_created"
  | "under_review"
  | "possible_match_suggested"
  | "match_confirmed_by_information_bureau"
  | "proof_of_ownership_verified"
  | "item_released"
  | "closed_unresolved";
export type Urgency = "standard" | "elevated" | "urgent";
export type MatchStatus = "suggested" | "confirmed" | "rejected";
export type EscalationStatus = "draft" | "queued" | "announced" | "cancelled";
export type ConnectivityStatus = "stable" | "degraded";
export type OfflineOperationType =
  | "create_looking_for_person_report"
  | "create_found_person_report"
  | "create_lost_item_report"
  | "create_found_item_report"
  | "draft_announcement_escalation";
export type OfflineSyncStatus = "pending" | "synced" | "failed";
export type MatchRecommendationTier =
  | "strong_match_recommendation"
  | "review_recommended"
  | "insufficient_confidence";
export type AgeBand = "0-5" | "6-8" | "9-12" | "13-17" | "18-59" | "60+" | "unknown";
export type PosterType = "A4 Poster" | "Placard" | "Billboard" | "Help Desk Sign";
export type ProximityGroup =
  | "information_bureau"
  | "arena_rear"
  | "main_gate"
  | "c_gate"
  | "auditorium"
  | "other";
export type ItemCategory =
  | "phone"
  | "bag"
  | "wallet"
  | "bible_or_book"
  | "id_or_card"
  | "clothing"
  | "other";
export type AnnouncementCaseKind = "person_case" | "item_case";

export type AuditEventType =
  | "reunite_point.listed"
  | "person_case.created"
  | "person_case.review_started"
  | "person_case.synced"
  | "person_case.safely_reunited"
  | "item_case.created"
  | "item_case.review_started"
  | "item_case.synced"
  | "item_case.item_released"
  | "person_match.suggested"
  | "person_match.confirmed"
  | "person_match.rejected"
  | "item_match.suggested"
  | "item_match.confirmed"
  | "item_match.rejected"
  | "person_handover.completed"
  | "item_release.completed"
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

export interface ReunitePoint {
  id: EntityId;
  eventId: EntityId;
  code: string;
  name: string;
  zone: string;
  proximityGroup: ProximityGroup;
  locationLabel: string;
  posterType: PosterType;
  officialShortUrl: string;
  fallbackInstruction: string;
  tamperCheckInstruction: string;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ActorProfile {
  id: EntityId;
  authUserId?: EntityId;
  displayName: string;
  role: StaffRole;
  assignedPointId?: EntityId;
  isActive: boolean;
  isDemo: boolean;
  createdAt: ISODateString;
}

export interface PersonCase {
  id: EntityId;
  eventId: EntityId;
  reportSourcePointId: EntityId;
  caseIntent: PersonCaseIntent;
  status: PersonCaseStatus;
  personCategory: PersonCategory;
  approximateAgeBand: AgeBand;
  reportedAt: ISODateString;
  lastSeenOrFoundLocation: string;
  groupOrChurchReference?: string;
  nonSensitiveDescriptionTags: string[];
  sensitiveNotes?: string;
  urgency: Urgency;
  publicReporterReference?: string;
  createdByStaffId?: EntityId;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  resolvedAt?: ISODateString;
}

export interface ItemCase {
  id: EntityId;
  eventId: EntityId;
  reportSourcePointId: EntityId;
  itemIntent: ItemCaseIntent;
  status: ItemCaseStatus;
  itemCategory: ItemCategory;
  itemColorOrDescriptionTags: string[];
  reportedAt: ISODateString;
  lastSeenOrFoundLocation: string;
  hiddenVerificationDetail?: string;
  claimantReference?: string;
  urgency: Urgency;
  publicReporterReference?: string;
  createdByStaffId?: EntityId;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  resolvedAt?: ISODateString;
}

export interface MatchReason {
  code:
    | "reunite_point_proximity"
    | "time_proximity"
    | "person_category"
    | "age_band"
    | "group_reference"
    | "description_tags"
    | "human_verification_required"
    | "item_category"
    | "item_description_tags"
    | "hidden_verification_detail"
    | "proof_of_ownership_required";
  label: string;
  points: number;
  staffOnly?: boolean;
}

export interface PersonMatchRecommendation {
  id: EntityId;
  eventId: EntityId;
  lookingCaseId: EntityId;
  foundCaseId: EntityId;
  score: number;
  tier: MatchRecommendationTier;
  reasons: MatchReason[];
  status: MatchStatus;
  reviewedByStaffId?: EntityId;
  reviewedAt?: ISODateString;
  createdAt: ISODateString;
}

export interface ItemMatchRecommendation {
  id: EntityId;
  eventId: EntityId;
  lostItemCaseId: EntityId;
  foundItemCaseId: EntityId;
  score: number;
  tier: MatchRecommendationTier;
  reasons: MatchReason[];
  status: MatchStatus;
  reviewedByStaffId?: EntityId;
  reviewedAt?: ISODateString;
  createdAt: ISODateString;
}

export interface PersonHandoverRecord {
  id: EntityId;
  eventId: EntityId;
  matchId: EntityId;
  lookingCaseId: EntityId;
  foundCaseId: EntityId;
  verifiedReporterReference?: string;
  verificationMethod: string;
  verificationNotes?: string;
  approvedByStaffId: EntityId;
  handedOverAt: ISODateString;
  createdAt: ISODateString;
}

export interface ItemReleaseRecord {
  id: EntityId;
  eventId: EntityId;
  matchId: EntityId;
  lostItemCaseId: EntityId;
  foundItemCaseId: EntityId;
  claimantReference?: string;
  proofOfOwnershipMethod: string;
  proofNotes?: string;
  releasedByStaffId: EntityId;
  releasedAt: ISODateString;
  createdAt: ISODateString;
}

export interface AnnouncementEscalation {
  id: EntityId;
  eventId: EntityId;
  caseKind: AnnouncementCaseKind;
  caseId: EntityId;
  status: EscalationStatus;
  announcementText: string;
  requestedByStaffId: EntityId;
  requestedAt: ISODateString;
  announcedAt?: ISODateString;
}

export type OfflineOperationPayload =
  | {
      caseIntent: "looking_for_person";
      eventId: EntityId;
      reportSourcePointId: EntityId;
      personCategory: PersonCategory;
      approximateAgeBand: AgeBand;
      reportedAt: ISODateString;
      lastSeenOrFoundLocation: string;
      groupOrChurchReference?: string;
      nonSensitiveDescriptionTags: string[];
      sensitiveNotes?: string;
      urgency: Urgency;
      publicReporterReference?: string;
    }
  | {
      caseIntent: "found_person";
      eventId: EntityId;
      reportSourcePointId: EntityId;
      personCategory: PersonCategory;
      approximateAgeBand: AgeBand;
      reportedAt: ISODateString;
      lastSeenOrFoundLocation: string;
      groupOrChurchReference?: string;
      nonSensitiveDescriptionTags: string[];
      sensitiveNotes?: string;
      urgency: Urgency;
      publicReporterReference?: string;
    }
  | {
      itemIntent: "lost_item";
      eventId: EntityId;
      reportSourcePointId: EntityId;
      itemCategory: ItemCategory;
      itemColorOrDescriptionTags: string[];
      reportedAt: ISODateString;
      lastSeenOrFoundLocation: string;
      hiddenVerificationDetail?: string;
      claimantReference?: string;
      urgency: Urgency;
      publicReporterReference?: string;
    }
  | {
      itemIntent: "found_item";
      eventId: EntityId;
      reportSourcePointId: EntityId;
      itemCategory: ItemCategory;
      itemColorOrDescriptionTags: string[];
      reportedAt: ISODateString;
      lastSeenOrFoundLocation: string;
      hiddenVerificationDetail?: string;
      claimantReference?: string;
      urgency: Urgency;
      publicReporterReference?: string;
    }
  | {
      operation: "draft_announcement_escalation";
      eventId: EntityId;
      caseKind: AnnouncementCaseKind;
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
    | "reunite_point"
    | "actor_profile"
    | "person_case"
    | "item_case"
    | "person_match_recommendation"
    | "item_match_recommendation"
    | "person_handover_record"
    | "item_release_record"
    | "announcement_escalation"
    | "offline_sync_operation";
  entityId?: EntityId;
  metadata: Record<string, string | number | boolean | null>;
  createdAt: ISODateString;
}

export interface DashboardHotspot {
  locationLabel: string;
  reportCount: number;
}

export interface DashboardSummary {
  view: "operations" | "leadership_aggregate";
  eventId: EntityId;
  eventName: string;
  connectivityStatus: ConnectivityStatus;
  personReportsTotal: number;
  itemReportsTotal: number;
  openLookingForPersonCases: number;
  foundPersonsAwaitingMatch: number;
  openLostItemCases: number;
  foundItemsAwaitingMatch: number;
  safelyReunitedTotal: number;
  releasedItemsTotal: number;
  medianReunionMinutes: number | null;
  medianItemReleaseMinutes: number | null;
  paEscalations: number;
  offlineReportsPendingSync: number;
  urgentUnresolvedPersonCases: number;
  urgentUnresolvedItemCases: number;
  hotspots: DashboardHotspot[];
  sensitiveCaseDetailsIncluded: false;
}
