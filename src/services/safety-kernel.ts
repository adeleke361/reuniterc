import {
  assertItemCaseTransition,
  assertPermission,
  assertPersonCaseTransition,
  DomainRuleError,
  isOpenItemCaseStatus,
  isOpenPersonCaseStatus,
  scorePotentialItemMatch,
  scorePotentialPersonMatch,
  suggestItemMatchesForLostItemCase,
  suggestPersonMatchesForLookingCase,
  type ItemMatchSuggestion,
  type PersonMatchSuggestion
} from "../domain";
import type {
  ActorProfile,
  AnnouncementEscalation,
  AuditEventType,
  AuditLog,
  ConnectivityStatus,
  DashboardSummary,
  EntityId,
  ItemCase,
  ItemMatchRecommendation,
  ItemReleaseRecord,
  OfflineOperationPayload,
  OfflineOperationType,
  OfflineSyncOperation,
  PersonCase,
  PersonHandoverRecord,
  PersonMatchRecommendation,
  ReunitePoint,
  Urgency
} from "../domain/types";
import type { IdGenerator, ReuniteRepositories } from "../repositories";

export interface SafetyKernelDependencies {
  idGenerator: IdGenerator;
  now(): string;
}

export interface CreatePersonReportInput {
  eventId: EntityId;
  reportSourcePointId: EntityId;
  personCategory: PersonCase["personCategory"];
  approximateAgeBand: PersonCase["approximateAgeBand"];
  reportedAt: string;
  lastSeenOrFoundLocation: string;
  groupOrChurchReference?: string;
  nonSensitiveDescriptionTags: string[];
  sensitiveNotes?: string;
  urgency?: Urgency;
  publicReporterReference?: string;
}

export interface CreateItemReportInput {
  eventId: EntityId;
  reportSourcePointId: EntityId;
  itemCategory: ItemCase["itemCategory"];
  itemColorOrDescriptionTags: string[];
  reportedAt: string;
  lastSeenOrFoundLocation: string;
  hiddenVerificationDetail?: string;
  claimantReference?: string;
  urgency?: Urgency;
  publicReporterReference?: string;
}

export interface MatchDecisionInput {
  matchId: EntityId;
  reviewNotes?: string;
  connectivityStatus: ConnectivityStatus;
}

export interface CompletePersonHandoverInput {
  eventId: EntityId;
  matchId: EntityId;
  verifiedReporterReference?: string;
  verificationMethod: string;
  verificationNotes?: string;
  handedOverAt: string;
  connectivityStatus: ConnectivityStatus;
}

export interface CompleteItemReleaseInput {
  eventId: EntityId;
  matchId: EntityId;
  claimantReference?: string;
  proofOfOwnershipMethod: string;
  proofNotes?: string;
  releasedAt: string;
  connectivityStatus: ConnectivityStatus;
}

export interface EscalateForAnnouncementInput {
  eventId: EntityId;
  caseKind: AnnouncementEscalation["caseKind"];
  caseId: EntityId;
  announcementText: string;
  requestedAt: string;
}

export interface QueueOfflineReportInput {
  eventId: EntityId;
  clientOperationId: string;
  operationType: OfflineOperationType;
  payload: OfflineOperationPayload;
}

export interface SyncOfflineReportsResult {
  synced: OfflineSyncOperation[];
  failed: OfflineSyncOperation[];
  remainingPending: OfflineSyncOperation[];
}

export interface ReuniteKernelServices {
  listReunitePoints(actor: ActorProfile, eventId: EntityId): Promise<ReunitePoint[]>;
  createLookingForPersonReport(actor: ActorProfile, input: CreatePersonReportInput): Promise<PersonCase>;
  createFoundPersonReport(actor: ActorProfile, input: CreatePersonReportInput): Promise<PersonCase>;
  createLostItemReport(actor: ActorProfile, input: CreateItemReportInput): Promise<ItemCase>;
  createFoundItemReport(actor: ActorProfile, input: CreateItemReportInput): Promise<ItemCase>;
  suggestPersonMatches(actor: ActorProfile, lookingCaseId: EntityId): Promise<PersonMatchRecommendation[]>;
  suggestItemMatches(actor: ActorProfile, lostItemCaseId: EntityId): Promise<ItemMatchRecommendation[]>;
  confirmPersonMatch(actor: ActorProfile, input: MatchDecisionInput): Promise<PersonMatchRecommendation>;
  confirmItemMatch(actor: ActorProfile, input: MatchDecisionInput): Promise<ItemMatchRecommendation>;
  rejectPersonMatch(actor: ActorProfile, input: MatchDecisionInput): Promise<PersonMatchRecommendation>;
  rejectItemMatch(actor: ActorProfile, input: MatchDecisionInput): Promise<ItemMatchRecommendation>;
  completePersonHandover(actor: ActorProfile, input: CompletePersonHandoverInput): Promise<PersonHandoverRecord>;
  completeItemRelease(actor: ActorProfile, input: CompleteItemReleaseInput): Promise<ItemReleaseRecord>;
  escalateForAnnouncement(actor: ActorProfile, input: EscalateForAnnouncementInput): Promise<AnnouncementEscalation>;
  queueOfflineReport(actor: ActorProfile, input: QueueOfflineReportInput): Promise<OfflineSyncOperation>;
  syncOfflineReports(
    actor: ActorProfile,
    eventId: EntityId,
    connectivityStatus: ConnectivityStatus
  ): Promise<SyncOfflineReportsResult>;
  getDashboardSummary(
    actor: ActorProfile,
    eventId: EntityId,
    connectivityStatus: ConnectivityStatus
  ): Promise<DashboardSummary>;
  getLeadershipAnalytics(
    actor: ActorProfile,
    eventId: EntityId,
    connectivityStatus: ConnectivityStatus
  ): Promise<DashboardSummary>;
}

export function createReuniteKernelServices(
  repositories: ReuniteRepositories,
  dependencies: SafetyKernelDependencies
): ReuniteKernelServices {
  async function listReunitePoints(actor: ActorProfile, eventId: EntityId): Promise<ReunitePoint[]> {
    assertPermission(actor, "reunite_point:list");
    const points = await repositories.reunitePoints.listByEvent(eventId);
    await appendAudit(actor, eventId, "reunite_point.listed", "reunite_point", undefined, {
      count: points.length
    });
    return points.filter((point) => point.isActive);
  }

  async function createLookingForPersonReport(
    actor: ActorProfile,
    input: CreatePersonReportInput
  ): Promise<PersonCase> {
    assertPermission(actor, "person_report:create_looking");
    assertPointScope(actor, input.reportSourcePointId);

    return createPersonCase(actor, "looking_for_person", input, "report_created");
  }

  async function createFoundPersonReport(
    actor: ActorProfile,
    input: CreatePersonReportInput
  ): Promise<PersonCase> {
    assertPermission(actor, "person_report:create_found");
    assertPointScope(actor, input.reportSourcePointId);

    return createPersonCase(actor, "found_person", input, "report_created");
  }

  async function createLostItemReport(actor: ActorProfile, input: CreateItemReportInput): Promise<ItemCase> {
    assertPermission(actor, "item_report:create_lost");
    assertPointScope(actor, input.reportSourcePointId);

    return createItemCase(actor, "lost_item", input, "report_created");
  }

  async function createFoundItemReport(actor: ActorProfile, input: CreateItemReportInput): Promise<ItemCase> {
    assertPermission(actor, "item_report:create_found");
    assertPointScope(actor, input.reportSourcePointId);

    return createItemCase(actor, "found_item", input, "report_created");
  }

  async function suggestPersonMatches(
    actor: ActorProfile,
    lookingCaseId: EntityId
  ): Promise<PersonMatchRecommendation[]> {
    assertPermission(actor, "match:suggest");

    const lookingCase = await requirePersonCase(lookingCaseId);
    if (lookingCase.caseIntent !== "looking_for_person") {
      throw new DomainRuleError("Person match suggestions must start from a looking-for-person case.");
    }

    const foundCases = await repositories.personCases.listByEventAndIntent(lookingCase.eventId, "found_person");
    const points = await repositories.reunitePoints.listByEvent(lookingCase.eventId);
    const suggestions = suggestPersonMatchesForLookingCase(lookingCase, foundCases, {
      reunitePointsById: new Map(points.map((point) => [point.id, point]))
    });

    const createdMatches: PersonMatchRecommendation[] = [];
    for (const suggestion of suggestions) {
      const match = await createSuggestedPersonMatch(suggestion);
      createdMatches.push(match);
      await markPersonCasesWithSuggestion(actor, match);
      await appendAudit(actor, lookingCase.eventId, "person_match.suggested", "person_match_recommendation", match.id, {
        score: match.score,
        tier: match.tier
      });
    }

    return createdMatches;
  }

  async function suggestItemMatches(
    actor: ActorProfile,
    lostItemCaseId: EntityId
  ): Promise<ItemMatchRecommendation[]> {
    assertPermission(actor, "match:suggest");

    const lostItemCase = await requireItemCase(lostItemCaseId);
    if (lostItemCase.itemIntent !== "lost_item") {
      throw new DomainRuleError("Item match suggestions must start from a lost-item case.");
    }

    const foundItemCases = await repositories.itemCases.listByEventAndIntent(lostItemCase.eventId, "found_item");
    const points = await repositories.reunitePoints.listByEvent(lostItemCase.eventId);
    const suggestions = suggestItemMatchesForLostItemCase(lostItemCase, foundItemCases, {
      reunitePointsById: new Map(points.map((point) => [point.id, point]))
    });

    const createdMatches: ItemMatchRecommendation[] = [];
    for (const suggestion of suggestions) {
      const match = await createSuggestedItemMatch(suggestion);
      createdMatches.push(match);
      await markItemCasesWithSuggestion(actor, match);
      await appendAudit(actor, lostItemCase.eventId, "item_match.suggested", "item_match_recommendation", match.id, {
        score: match.score,
        tier: match.tier
      });
    }

    return createdMatches;
  }

  async function confirmPersonMatch(
    actor: ActorProfile,
    input: MatchDecisionInput
  ): Promise<PersonMatchRecommendation> {
    assertPermission(actor, "match:confirm");
    assertStableConnectivity(input.connectivityStatus, "Match confirmation requires connected Information Bureau workflow.");

    const match = await requirePersonMatch(input.matchId);
    const confirmedMatch: PersonMatchRecommendation = {
      ...match,
      status: "confirmed",
      reviewedByStaffId: actor.id,
      reviewedAt: dependencies.now()
    };

    const lookingCase = await requirePersonCase(match.lookingCaseId);
    const foundCase = await requirePersonCase(match.foundCaseId);
    await movePersonCaseToMatchConfirmed(actor, lookingCase);
    await movePersonCaseToMatchConfirmed(actor, foundCase);

    const updated = await repositories.personMatches.update(confirmedMatch);
    await appendAudit(actor, match.eventId, "person_match.confirmed", "person_match_recommendation", match.id, {
      reviewNotesPresent: Boolean(input.reviewNotes)
    });

    return updated;
  }

  async function confirmItemMatch(
    actor: ActorProfile,
    input: MatchDecisionInput
  ): Promise<ItemMatchRecommendation> {
    assertPermission(actor, "match:confirm");
    assertStableConnectivity(input.connectivityStatus, "Match confirmation requires connected Information Bureau workflow.");

    const match = await requireItemMatch(input.matchId);
    const confirmedMatch: ItemMatchRecommendation = {
      ...match,
      status: "confirmed",
      reviewedByStaffId: actor.id,
      reviewedAt: dependencies.now()
    };

    const lostItemCase = await requireItemCase(match.lostItemCaseId);
    const foundItemCase = await requireItemCase(match.foundItemCaseId);
    await moveItemCaseToMatchConfirmed(actor, lostItemCase);
    await moveItemCaseToMatchConfirmed(actor, foundItemCase);

    const updated = await repositories.itemMatches.update(confirmedMatch);
    await appendAudit(actor, match.eventId, "item_match.confirmed", "item_match_recommendation", match.id, {
      reviewNotesPresent: Boolean(input.reviewNotes)
    });

    return updated;
  }

  async function rejectPersonMatch(
    actor: ActorProfile,
    input: MatchDecisionInput
  ): Promise<PersonMatchRecommendation> {
    assertPermission(actor, "match:reject");
    assertStableConnectivity(input.connectivityStatus, "Match rejection requires connected Information Bureau workflow.");

    const match = await requirePersonMatch(input.matchId);
    const rejected: PersonMatchRecommendation = {
      ...match,
      status: "rejected",
      reviewedByStaffId: actor.id,
      reviewedAt: dependencies.now()
    };

    const updated = await repositories.personMatches.update(rejected);
    await appendAudit(actor, match.eventId, "person_match.rejected", "person_match_recommendation", match.id, {
      reviewNotesPresent: Boolean(input.reviewNotes)
    });

    return updated;
  }

  async function rejectItemMatch(
    actor: ActorProfile,
    input: MatchDecisionInput
  ): Promise<ItemMatchRecommendation> {
    assertPermission(actor, "match:reject");
    assertStableConnectivity(input.connectivityStatus, "Match rejection requires connected Information Bureau workflow.");

    const match = await requireItemMatch(input.matchId);
    const rejected: ItemMatchRecommendation = {
      ...match,
      status: "rejected",
      reviewedByStaffId: actor.id,
      reviewedAt: dependencies.now()
    };

    const updated = await repositories.itemMatches.update(rejected);
    await appendAudit(actor, match.eventId, "item_match.rejected", "item_match_recommendation", match.id, {
      reviewNotesPresent: Boolean(input.reviewNotes)
    });

    return updated;
  }

  async function completePersonHandover(
    actor: ActorProfile,
    input: CompletePersonHandoverInput
  ): Promise<PersonHandoverRecord> {
    assertPermission(actor, "person_handover:complete");
    assertStableConnectivity(
      input.connectivityStatus,
      "Final safe reunion requires connected Information Bureau verification."
    );

    const match = await requirePersonMatch(input.matchId);
    if (match.status !== "confirmed") {
      throw new DomainRuleError("A person match must be confirmed before handover can be completed.");
    }

    const lookingCase = await requirePersonCase(match.lookingCaseId);
    const foundCase = await requirePersonCase(match.foundCaseId);
    assertPersonCaseTransition(lookingCase.status, "verified_handover_completed", {
      hasVerifiedHandover: true
    });
    assertPersonCaseTransition(foundCase.status, "verified_handover_completed", {
      hasVerifiedHandover: true
    });

    const handover: PersonHandoverRecord = {
      id: dependencies.idGenerator.nextId("person_handover"),
      eventId: input.eventId,
      matchId: match.id,
      lookingCaseId: lookingCase.id,
      foundCaseId: foundCase.id,
      verifiedReporterReference: input.verifiedReporterReference,
      verificationMethod: input.verificationMethod,
      verificationNotes: input.verificationNotes,
      approvedByStaffId: actor.id,
      handedOverAt: input.handedOverAt,
      createdAt: dependencies.now()
    };

    const createdHandover = await repositories.personHandovers.create(handover);
    await closePersonCaseAsSafelyReunited(lookingCase, input.handedOverAt);
    await closePersonCaseAsSafelyReunited(foundCase, input.handedOverAt);

    await appendAudit(actor, input.eventId, "person_handover.completed", "person_handover_record", createdHandover.id, {
      matchId: match.id
    });
    await appendAudit(actor, input.eventId, "person_case.safely_reunited", "person_match_recommendation", match.id, {
      handoverId: createdHandover.id
    });

    return createdHandover;
  }

  async function completeItemRelease(
    actor: ActorProfile,
    input: CompleteItemReleaseInput
  ): Promise<ItemReleaseRecord> {
    assertPermission(actor, "item_release:complete");
    assertStableConnectivity(input.connectivityStatus, "Final item release requires connected proof-of-ownership verification.");

    const match = await requireItemMatch(input.matchId);
    if (match.status !== "confirmed") {
      throw new DomainRuleError("An item match must be confirmed before release can be completed.");
    }

    const lostItemCase = await requireItemCase(match.lostItemCaseId);
    const foundItemCase = await requireItemCase(match.foundItemCaseId);
    assertItemCaseTransition(lostItemCase.status, "proof_of_ownership_verified", {
      hasProofOfOwnership: true
    });
    assertItemCaseTransition(foundItemCase.status, "proof_of_ownership_verified", {
      hasProofOfOwnership: true
    });

    const release: ItemReleaseRecord = {
      id: dependencies.idGenerator.nextId("item_release"),
      eventId: input.eventId,
      matchId: match.id,
      lostItemCaseId: lostItemCase.id,
      foundItemCaseId: foundItemCase.id,
      claimantReference: input.claimantReference,
      proofOfOwnershipMethod: input.proofOfOwnershipMethod,
      proofNotes: input.proofNotes,
      releasedByStaffId: actor.id,
      releasedAt: input.releasedAt,
      createdAt: dependencies.now()
    };

    const createdRelease = await repositories.itemReleases.create(release);
    await closeItemCaseAsReleased(lostItemCase, input.releasedAt);
    await closeItemCaseAsReleased(foundItemCase, input.releasedAt);

    await appendAudit(actor, input.eventId, "item_release.completed", "item_release_record", createdRelease.id, {
      matchId: match.id
    });
    await appendAudit(actor, input.eventId, "item_case.item_released", "item_match_recommendation", match.id, {
      releaseId: createdRelease.id
    });

    return createdRelease;
  }

  async function escalateForAnnouncement(
    actor: ActorProfile,
    input: EscalateForAnnouncementInput
  ): Promise<AnnouncementEscalation> {
    assertPermission(actor, "announcement:escalate");

    const currentStatus =
      input.caseKind === "person_case"
        ? (await requirePersonCase(input.caseId)).status
        : (await requireItemCase(input.caseId)).status;
    const escalation: AnnouncementEscalation = {
      id: dependencies.idGenerator.nextId("announcement"),
      eventId: input.eventId,
      caseKind: input.caseKind,
      caseId: input.caseId,
      status: "queued",
      announcementText: input.announcementText,
      requestedByStaffId: actor.id,
      requestedAt: input.requestedAt
    };

    const created = await repositories.announcements.create(escalation);
    await appendAudit(actor, input.eventId, "announcement.escalated", "announcement_escalation", created.id, {
      caseStatusUnchanged: currentStatus
    });

    return created;
  }

  async function queueOfflineReport(
    actor: ActorProfile,
    input: QueueOfflineReportInput
  ): Promise<OfflineSyncOperation> {
    assertPermission(actor, "offline:queue_report");
    assertOfflineOperationMatchesPayload(input.operationType, input.payload);

    const localEntityId = await createPendingLocalEntityForOfflineOperation(actor, input.payload);

    const operation: OfflineSyncOperation = {
      id: dependencies.idGenerator.nextId("offline"),
      clientOperationId: input.clientOperationId,
      operationType: input.operationType,
      actorStaffId: actor.id,
      localEntityId,
      payload: input.payload,
      status: "pending",
      attemptCount: 0,
      createdAt: dependencies.now()
    };

    const queued = await repositories.offlineQueue.enqueue(operation);
    await appendAudit(actor, input.eventId, "offline.queued", "offline_sync_operation", queued.id, {
      operationType: input.operationType
    });

    return queued;
  }

  async function syncOfflineReports(
    actor: ActorProfile,
    eventId: EntityId,
    connectivityStatus: ConnectivityStatus
  ): Promise<SyncOfflineReportsResult> {
    assertPermission(actor, "offline:sync");

    if (connectivityStatus !== "stable") {
      return {
        synced: [],
        failed: [],
        remainingPending: await repositories.offlineQueue.listPendingByEvent(eventId)
      };
    }

    const pendingOperations = await repositories.offlineQueue.listPendingByEvent(eventId);
    const synced: OfflineSyncOperation[] = [];
    const failed: OfflineSyncOperation[] = [];

    for (const operation of pendingOperations) {
      try {
        await replayOfflineOperation(operation);
        const syncedOperation: OfflineSyncOperation = {
          ...operation,
          status: "synced",
          attemptCount: operation.attemptCount + 1,
          syncedAt: dependencies.now()
        };
        synced.push(await repositories.offlineQueue.update(syncedOperation));
        await appendAudit(actor, eventId, "offline.synced", "offline_sync_operation", operation.id, {
          operationType: operation.operationType
        });
      } catch (error) {
        const failedOperation: OfflineSyncOperation = {
          ...operation,
          status: "failed",
          attemptCount: operation.attemptCount + 1,
          lastError: error instanceof Error ? error.message : "Unknown sync failure"
        };
        failed.push(await repositories.offlineQueue.update(failedOperation));
        await appendAudit(actor, eventId, "offline.failed", "offline_sync_operation", operation.id, {
          operationType: operation.operationType
        });
      }
    }

    return {
      synced,
      failed,
      remainingPending: await repositories.offlineQueue.listPendingByEvent(eventId)
    };
  }

  async function getDashboardSummary(
    actor: ActorProfile,
    eventId: EntityId,
    connectivityStatus: ConnectivityStatus
  ): Promise<DashboardSummary> {
    if (actor.role === "leadership_viewer") {
      assertPermission(actor, "dashboard:view_leadership_aggregate");
      return buildDashboardSummary("leadership_aggregate", eventId, connectivityStatus);
    }

    assertPermission(actor, "dashboard:view_operations");
    return buildDashboardSummary("operations", eventId, connectivityStatus);
  }

  async function getLeadershipAnalytics(
    actor: ActorProfile,
    eventId: EntityId,
    connectivityStatus: ConnectivityStatus
  ): Promise<DashboardSummary> {
    assertPermission(actor, "dashboard:view_leadership_aggregate");
    return buildDashboardSummary("leadership_aggregate", eventId, connectivityStatus);
  }

  async function createPersonCase(
    actor: ActorProfile,
    caseIntent: PersonCase["caseIntent"],
    input: CreatePersonReportInput,
    status: PersonCase["status"]
  ): Promise<PersonCase> {
    await requireReunitePoint(input.reportSourcePointId);

    const now = dependencies.now();
    const personCase: PersonCase = {
      id: dependencies.idGenerator.nextId(caseIntent === "looking_for_person" ? "person_looking" : "person_found"),
      eventId: input.eventId,
      reportSourcePointId: input.reportSourcePointId,
      caseIntent,
      status,
      personCategory: input.personCategory,
      approximateAgeBand: input.approximateAgeBand,
      reportedAt: input.reportedAt,
      lastSeenOrFoundLocation: input.lastSeenOrFoundLocation,
      groupOrChurchReference: input.groupOrChurchReference,
      nonSensitiveDescriptionTags: input.nonSensitiveDescriptionTags,
      sensitiveNotes: input.sensitiveNotes,
      urgency: input.urgency ?? "standard",
      publicReporterReference: input.publicReporterReference,
      createdByStaffId: actor.role === "public_reporter" ? undefined : actor.id,
      createdAt: now,
      updatedAt: now
    };

    const created = await repositories.personCases.create(personCase);
    await appendAudit(actor, input.eventId, "person_case.created", "person_case", created.id, {
      caseIntent,
      status
    });

    return created;
  }

  async function createItemCase(
    actor: ActorProfile,
    itemIntent: ItemCase["itemIntent"],
    input: CreateItemReportInput,
    status: ItemCase["status"]
  ): Promise<ItemCase> {
    await requireReunitePoint(input.reportSourcePointId);

    const now = dependencies.now();
    const itemCase: ItemCase = {
      id: dependencies.idGenerator.nextId(itemIntent === "lost_item" ? "item_lost" : "item_found"),
      eventId: input.eventId,
      reportSourcePointId: input.reportSourcePointId,
      itemIntent,
      status,
      itemCategory: input.itemCategory,
      itemColorOrDescriptionTags: input.itemColorOrDescriptionTags,
      reportedAt: input.reportedAt,
      lastSeenOrFoundLocation: input.lastSeenOrFoundLocation,
      hiddenVerificationDetail: input.hiddenVerificationDetail,
      claimantReference: input.claimantReference,
      urgency: input.urgency ?? "standard",
      publicReporterReference: input.publicReporterReference,
      createdByStaffId: actor.role === "public_reporter" ? undefined : actor.id,
      createdAt: now,
      updatedAt: now
    };

    const created = await repositories.itemCases.create(itemCase);
    await appendAudit(actor, input.eventId, "item_case.created", "item_case", created.id, {
      itemIntent,
      status
    });

    return created;
  }

  async function createSuggestedPersonMatch(
    suggestion: PersonMatchSuggestion
  ): Promise<PersonMatchRecommendation> {
    return repositories.personMatches.create({
      ...suggestion,
      id: dependencies.idGenerator.nextId("person_match"),
      status: "suggested",
      createdAt: dependencies.now()
    });
  }

  async function createSuggestedItemMatch(suggestion: ItemMatchSuggestion): Promise<ItemMatchRecommendation> {
    return repositories.itemMatches.create({
      ...suggestion,
      id: dependencies.idGenerator.nextId("item_match"),
      status: "suggested",
      createdAt: dependencies.now()
    });
  }

  async function markPersonCasesWithSuggestion(
    actor: ActorProfile,
    match: PersonMatchRecommendation
  ): Promise<void> {
    if (match.tier === "insufficient_confidence") {
      return;
    }

    await movePersonCaseToSuggested(actor, await requirePersonCase(match.lookingCaseId));
    await movePersonCaseToSuggested(actor, await requirePersonCase(match.foundCaseId));
  }

  async function markItemCasesWithSuggestion(actor: ActorProfile, match: ItemMatchRecommendation): Promise<void> {
    if (match.tier === "insufficient_confidence") {
      return;
    }

    await moveItemCaseToSuggested(actor, await requireItemCase(match.lostItemCaseId));
    await moveItemCaseToSuggested(actor, await requireItemCase(match.foundItemCaseId));
  }

  async function movePersonCaseToSuggested(actor: ActorProfile, personCase: PersonCase): Promise<void> {
    if (personCase.status === "possible_match_suggested" || personCase.status === "match_confirmed_by_information_bureau") {
      return;
    }

    assertPersonCaseTransition(personCase.status, "possible_match_suggested", { matchSuggested: true });
    await repositories.personCases.update({
      ...personCase,
      status: "possible_match_suggested",
      updatedAt: dependencies.now()
    });
    await appendAudit(actor, personCase.eventId, "person_case.review_started", "person_case", personCase.id, {
      toStatus: "possible_match_suggested"
    });
  }

  async function moveItemCaseToSuggested(actor: ActorProfile, itemCase: ItemCase): Promise<void> {
    if (itemCase.status === "possible_match_suggested" || itemCase.status === "match_confirmed_by_information_bureau") {
      return;
    }

    assertItemCaseTransition(itemCase.status, "possible_match_suggested", { matchSuggested: true });
    await repositories.itemCases.update({
      ...itemCase,
      status: "possible_match_suggested",
      updatedAt: dependencies.now()
    });
    await appendAudit(actor, itemCase.eventId, "item_case.review_started", "item_case", itemCase.id, {
      toStatus: "possible_match_suggested"
    });
  }

  async function movePersonCaseToMatchConfirmed(actor: ActorProfile, personCase: PersonCase): Promise<void> {
    assertPersonCaseTransition(personCase.status, "match_confirmed_by_information_bureau", {
      matchConfirmed: true
    });
    await repositories.personCases.update({
      ...personCase,
      status: "match_confirmed_by_information_bureau",
      updatedAt: dependencies.now()
    });
    await appendAudit(actor, personCase.eventId, "person_case.review_started", "person_case", personCase.id, {
      toStatus: "match_confirmed_by_information_bureau"
    });
  }

  async function moveItemCaseToMatchConfirmed(actor: ActorProfile, itemCase: ItemCase): Promise<void> {
    assertItemCaseTransition(itemCase.status, "match_confirmed_by_information_bureau", {
      matchConfirmed: true
    });
    await repositories.itemCases.update({
      ...itemCase,
      status: "match_confirmed_by_information_bureau",
      updatedAt: dependencies.now()
    });
    await appendAudit(actor, itemCase.eventId, "item_case.review_started", "item_case", itemCase.id, {
      toStatus: "match_confirmed_by_information_bureau"
    });
  }

  async function closePersonCaseAsSafelyReunited(personCase: PersonCase, handedOverAt: string): Promise<void> {
    assertPersonCaseTransition(personCase.status, "verified_handover_completed", {
      hasVerifiedHandover: true
    });
    const verifiedCase = await repositories.personCases.update({
      ...personCase,
      status: "verified_handover_completed",
      updatedAt: handedOverAt
    });
    assertPersonCaseTransition(verifiedCase.status, "safely_reunited", {
      hasVerifiedHandover: true
    });
    await repositories.personCases.update({
      ...verifiedCase,
      status: "safely_reunited",
      updatedAt: handedOverAt,
      resolvedAt: handedOverAt
    });
  }

  async function closeItemCaseAsReleased(itemCase: ItemCase, releasedAt: string): Promise<void> {
    assertItemCaseTransition(itemCase.status, "proof_of_ownership_verified", {
      hasProofOfOwnership: true
    });
    const verifiedCase = await repositories.itemCases.update({
      ...itemCase,
      status: "proof_of_ownership_verified",
      updatedAt: releasedAt
    });
    assertItemCaseTransition(verifiedCase.status, "item_released", {
      hasProofOfOwnership: true
    });
    await repositories.itemCases.update({
      ...verifiedCase,
      status: "item_released",
      updatedAt: releasedAt,
      resolvedAt: releasedAt
    });
  }

  async function replayOfflineOperation(operation: OfflineSyncOperation): Promise<void> {
    const { payload } = operation;

    if ("caseIntent" in payload) {
      await syncOfflinePersonCase(operation, payload);
      return;
    }

    if ("itemIntent" in payload) {
      await syncOfflineItemCase(operation, payload);
      return;
    }

    if (operation.operationType === "draft_announcement_escalation" && "operation" in payload) {
      await repositories.announcements.create({
        id: dependencies.idGenerator.nextId("announcement"),
        eventId: payload.eventId,
        caseKind: payload.caseKind,
        caseId: payload.caseId,
        status: "draft",
        announcementText: payload.announcementText,
        requestedByStaffId: operation.actorStaffId,
        requestedAt: payload.requestedAt
      });
      return;
    }

    throw new DomainRuleError(`Unsupported offline operation ${operation.operationType}.`);
  }

  async function syncOfflinePersonCase(
    operation: OfflineSyncOperation,
    payload: Extract<OfflineOperationPayload, { caseIntent: PersonCase["caseIntent"] }>
  ): Promise<void> {
    const now = dependencies.now();

    if (operation.localEntityId) {
      const pendingCase = await repositories.personCases.getById(operation.localEntityId);
      if (!pendingCase) {
        throw new DomainRuleError(`Pending offline person case ${operation.localEntityId} was not found.`);
      }

      assertPersonCaseTransition(pendingCase.status, "report_created", { syncCompleted: true });
      await repositories.personCases.update({
        ...pendingCase,
        status: "report_created",
        updatedAt: now
      });
      return;
    }

    await repositories.personCases.create({
      id: dependencies.idGenerator.nextId(payload.caseIntent === "looking_for_person" ? "person_looking" : "person_found"),
      eventId: payload.eventId,
      reportSourcePointId: payload.reportSourcePointId,
      caseIntent: payload.caseIntent,
      status: "report_created",
      personCategory: payload.personCategory,
      approximateAgeBand: payload.approximateAgeBand,
      reportedAt: payload.reportedAt,
      lastSeenOrFoundLocation: payload.lastSeenOrFoundLocation,
      groupOrChurchReference: payload.groupOrChurchReference,
      nonSensitiveDescriptionTags: payload.nonSensitiveDescriptionTags,
      sensitiveNotes: payload.sensitiveNotes,
      urgency: payload.urgency,
      publicReporterReference: payload.publicReporterReference,
      createdByStaffId: operation.actorStaffId,
      createdAt: now,
      updatedAt: now
    });
  }

  async function syncOfflineItemCase(
    operation: OfflineSyncOperation,
    payload: Extract<OfflineOperationPayload, { itemIntent: ItemCase["itemIntent"] }>
  ): Promise<void> {
    const now = dependencies.now();

    if (operation.localEntityId) {
      const pendingCase = await repositories.itemCases.getById(operation.localEntityId);
      if (!pendingCase) {
        throw new DomainRuleError(`Pending offline item case ${operation.localEntityId} was not found.`);
      }

      assertItemCaseTransition(pendingCase.status, "report_created", { syncCompleted: true });
      await repositories.itemCases.update({
        ...pendingCase,
        status: "report_created",
        updatedAt: now
      });
      return;
    }

    await repositories.itemCases.create({
      id: dependencies.idGenerator.nextId(payload.itemIntent === "lost_item" ? "item_lost" : "item_found"),
      eventId: payload.eventId,
      reportSourcePointId: payload.reportSourcePointId,
      itemIntent: payload.itemIntent,
      status: "report_created",
      itemCategory: payload.itemCategory,
      itemColorOrDescriptionTags: payload.itemColorOrDescriptionTags,
      reportedAt: payload.reportedAt,
      lastSeenOrFoundLocation: payload.lastSeenOrFoundLocation,
      hiddenVerificationDetail: payload.hiddenVerificationDetail,
      claimantReference: payload.claimantReference,
      urgency: payload.urgency,
      publicReporterReference: payload.publicReporterReference,
      createdByStaffId: operation.actorStaffId,
      createdAt: now,
      updatedAt: now
    });
  }

  async function createPendingLocalEntityForOfflineOperation(
    actor: ActorProfile,
    payload: OfflineOperationPayload
  ): Promise<EntityId | undefined> {
    if ("caseIntent" in payload) {
      assertPointScope(actor, payload.reportSourcePointId);
      const created = await createPersonCaseFromPayload(actor, payload, "pending_sync");
      return created.id;
    }

    if ("itemIntent" in payload) {
      assertPointScope(actor, payload.reportSourcePointId);
      const created = await createItemCaseFromPayload(actor, payload, "pending_sync");
      return created.id;
    }

    return undefined;
  }

  async function createPersonCaseFromPayload(
    actor: ActorProfile,
    payload: Extract<OfflineOperationPayload, { caseIntent: PersonCase["caseIntent"] }>,
    status: PersonCase["status"]
  ): Promise<PersonCase> {
    return createPersonCase(
      actor,
      payload.caseIntent,
      {
        eventId: payload.eventId,
        reportSourcePointId: payload.reportSourcePointId,
        personCategory: payload.personCategory,
        approximateAgeBand: payload.approximateAgeBand,
        reportedAt: payload.reportedAt,
        lastSeenOrFoundLocation: payload.lastSeenOrFoundLocation,
        groupOrChurchReference: payload.groupOrChurchReference,
        nonSensitiveDescriptionTags: payload.nonSensitiveDescriptionTags,
        sensitiveNotes: payload.sensitiveNotes,
        urgency: payload.urgency,
        publicReporterReference: payload.publicReporterReference
      },
      status
    );
  }

  async function createItemCaseFromPayload(
    actor: ActorProfile,
    payload: Extract<OfflineOperationPayload, { itemIntent: ItemCase["itemIntent"] }>,
    status: ItemCase["status"]
  ): Promise<ItemCase> {
    return createItemCase(
      actor,
      payload.itemIntent,
      {
        eventId: payload.eventId,
        reportSourcePointId: payload.reportSourcePointId,
        itemCategory: payload.itemCategory,
        itemColorOrDescriptionTags: payload.itemColorOrDescriptionTags,
        reportedAt: payload.reportedAt,
        lastSeenOrFoundLocation: payload.lastSeenOrFoundLocation,
        hiddenVerificationDetail: payload.hiddenVerificationDetail,
        claimantReference: payload.claimantReference,
        urgency: payload.urgency,
        publicReporterReference: payload.publicReporterReference
      },
      status
    );
  }

  async function buildDashboardSummary(
    view: DashboardSummary["view"],
    eventId: EntityId,
    connectivityStatus: ConnectivityStatus
  ): Promise<DashboardSummary> {
    const event = await repositories.events.getById(eventId);
    if (!event) {
      throw new DomainRuleError(`Event ${eventId} was not found.`);
    }

    const [personCases, itemCases, handovers, releases, announcements, pendingOffline] = await Promise.all([
      repositories.personCases.listByEvent(eventId),
      repositories.itemCases.listByEvent(eventId),
      repositories.personHandovers.listByEvent(eventId),
      repositories.itemReleases.listByEvent(eventId),
      repositories.announcements.listByEvent(eventId),
      repositories.offlineQueue.listPendingByEvent(eventId)
    ]);

    return {
      view,
      eventId,
      eventName: event.name,
      connectivityStatus,
      personReportsTotal: personCases.length,
      itemReportsTotal: itemCases.length,
      openLookingForPersonCases: personCases.filter(
        (personCase) => personCase.caseIntent === "looking_for_person" && isOpenPersonCaseStatus(personCase.status)
      ).length,
      foundPersonsAwaitingMatch: personCases.filter(
        (personCase) => personCase.caseIntent === "found_person" && isOpenPersonCaseStatus(personCase.status)
      ).length,
      openLostItemCases: itemCases.filter(
        (itemCase) => itemCase.itemIntent === "lost_item" && isOpenItemCaseStatus(itemCase.status)
      ).length,
      foundItemsAwaitingMatch: itemCases.filter(
        (itemCase) => itemCase.itemIntent === "found_item" && isOpenItemCaseStatus(itemCase.status)
      ).length,
      safelyReunitedTotal: handovers.length,
      releasedItemsTotal: releases.length,
      medianReunionMinutes: calculateMedianReunionMinutes(personCases, handovers),
      medianItemReleaseMinutes: calculateMedianItemReleaseMinutes(itemCases, releases),
      paEscalations: announcements.filter(
        (announcement) => announcement.status === "queued" || announcement.status === "announced"
      ).length,
      offlineReportsPendingSync: pendingOffline.length,
      urgentUnresolvedPersonCases: personCases.filter(
        (personCase) => personCase.urgency === "urgent" && isOpenPersonCaseStatus(personCase.status)
      ).length,
      urgentUnresolvedItemCases: itemCases.filter(
        (itemCase) => itemCase.urgency === "urgent" && isOpenItemCaseStatus(itemCase.status)
      ).length,
      hotspots: calculateHotspots(personCases, itemCases),
      sensitiveCaseDetailsIncluded: false
    };
  }

  async function appendAudit(
    actor: ActorProfile,
    eventId: EntityId,
    action: AuditEventType,
    entityType: AuditLog["entityType"],
    entityId: EntityId | undefined,
    metadata: AuditLog["metadata"]
  ): Promise<AuditLog> {
    return repositories.audits.append({
      id: dependencies.idGenerator.nextId("audit"),
      eventId,
      actorStaffId: actor.role === "public_reporter" ? undefined : actor.id,
      action,
      entityType,
      entityId,
      metadata,
      createdAt: dependencies.now()
    });
  }

  async function requireReunitePoint(pointId: EntityId): Promise<ReunitePoint> {
    const point = await repositories.reunitePoints.getById(pointId);
    if (!point || !point.isActive) {
      throw new DomainRuleError(`Active Reunite Point ${pointId} was not found.`);
    }

    return point;
  }

  async function requirePersonCase(caseId: EntityId): Promise<PersonCase> {
    const personCase = await repositories.personCases.getById(caseId);
    if (!personCase) {
      throw new DomainRuleError(`Person case ${caseId} was not found.`);
    }

    return personCase;
  }

  async function requireItemCase(caseId: EntityId): Promise<ItemCase> {
    const itemCase = await repositories.itemCases.getById(caseId);
    if (!itemCase) {
      throw new DomainRuleError(`Item case ${caseId} was not found.`);
    }

    return itemCase;
  }

  async function requirePersonMatch(matchId: EntityId): Promise<PersonMatchRecommendation> {
    const match = await repositories.personMatches.getById(matchId);
    if (!match) {
      throw new DomainRuleError(`Person match ${matchId} was not found.`);
    }

    return match;
  }

  async function requireItemMatch(matchId: EntityId): Promise<ItemMatchRecommendation> {
    const match = await repositories.itemMatches.getById(matchId);
    if (!match) {
      throw new DomainRuleError(`Item match ${matchId} was not found.`);
    }

    return match;
  }

  function assertPointScope(actor: ActorProfile, pointId: EntityId): void {
    if (actor.role === "helppoint_volunteer" && actor.assignedPointId !== pointId) {
      throw new DomainRuleError("HelpPoint volunteers can only create reports for their assigned Reunite Point.");
    }
  }

  function assertStableConnectivity(connectivityStatus: ConnectivityStatus, message: string): void {
    if (connectivityStatus !== "stable") {
      throw new DomainRuleError(message);
    }
  }

  function assertOfflineOperationMatchesPayload(
    operationType: OfflineOperationType,
    payload: OfflineOperationPayload
  ): void {
    if ("caseIntent" in payload) {
      const expected =
        payload.caseIntent === "looking_for_person"
          ? "create_looking_for_person_report"
          : "create_found_person_report";
      if (operationType !== expected) {
        throw new DomainRuleError(`Offline operation ${operationType} does not match person payload.`);
      }
      return;
    }

    if ("itemIntent" in payload) {
      const expected = payload.itemIntent === "lost_item" ? "create_lost_item_report" : "create_found_item_report";
      if (operationType !== expected) {
        throw new DomainRuleError(`Offline operation ${operationType} does not match item payload.`);
      }
      return;
    }

    if (operationType !== "draft_announcement_escalation") {
      throw new DomainRuleError(`Offline operation ${operationType} does not match announcement payload.`);
    }
  }

  return {
    listReunitePoints,
    createLookingForPersonReport,
    createFoundPersonReport,
    createLostItemReport,
    createFoundItemReport,
    suggestPersonMatches,
    suggestItemMatches,
    confirmPersonMatch,
    confirmItemMatch,
    rejectPersonMatch,
    rejectItemMatch,
    completePersonHandover,
    completeItemRelease,
    escalateForAnnouncement,
    queueOfflineReport,
    syncOfflineReports,
    getDashboardSummary,
    getLeadershipAnalytics
  };
}

export function comparePersonCasesForMatch(
  lookingCase: PersonCase,
  foundCase: PersonCase,
  reunitePoints: Map<string, ReunitePoint>
): PersonMatchSuggestion {
  return scorePotentialPersonMatch(lookingCase, foundCase, { reunitePointsById: reunitePoints });
}

export function compareItemCasesForMatch(
  lostItemCase: ItemCase,
  foundItemCase: ItemCase,
  reunitePoints: Map<string, ReunitePoint>
): ItemMatchSuggestion {
  return scorePotentialItemMatch(lostItemCase, foundItemCase, { reunitePointsById: reunitePoints });
}

function calculateMedianReunionMinutes(
  personCases: PersonCase[],
  handovers: PersonHandoverRecord[]
): number | null {
  const durations = handovers
    .map((handover) => {
      const lookingCase = personCases.find((personCase) => personCase.id === handover.lookingCaseId);
      if (!lookingCase) {
        return null;
      }

      return calculateMinutesBetween(lookingCase.reportedAt, handover.handedOverAt);
    })
    .filter((duration): duration is number => duration !== null)
    .sort((left, right) => left - right);

  return median(durations);
}

function calculateMedianItemReleaseMinutes(
  itemCases: ItemCase[],
  releases: ItemReleaseRecord[]
): number | null {
  const durations = releases
    .map((release) => {
      const lostItemCase = itemCases.find((itemCase) => itemCase.id === release.lostItemCaseId);
      if (!lostItemCase) {
        return null;
      }

      return calculateMinutesBetween(lostItemCase.reportedAt, release.releasedAt);
    })
    .filter((duration): duration is number => duration !== null)
    .sort((left, right) => left - right);

  return median(durations);
}

function calculateMinutesBetween(startIso: string, endIso: string): number | null {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return null;
  }

  return Math.max(0, Math.round((end - start) / 60000));
}

function median(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const middle = Math.floor(values.length / 2);
  if (values.length % 2 === 1) {
    return values[middle] ?? null;
  }

  const left = values[middle - 1] ?? 0;
  const right = values[middle] ?? 0;
  return Math.round((left + right) / 2);
}

function calculateHotspots(personCases: PersonCase[], itemCases: ItemCase[]): DashboardSummary["hotspots"] {
  const counts = new Map<string, number>();
  const allLocations = [
    ...personCases.map((personCase) => personCase.lastSeenOrFoundLocation),
    ...itemCases.map((itemCase) => itemCase.lastSeenOrFoundLocation)
  ];

  for (const locationLabel of allLocations) {
    counts.set(locationLabel, (counts.get(locationLabel) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([locationLabel, reportCount]) => ({ locationLabel, reportCount }))
    .sort((left, right) => right.reportCount - left.reportCount)
    .slice(0, 5);
}
