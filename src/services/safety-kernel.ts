import {
  assertCaseTransition,
  assertPermission,
  DomainRuleError,
  isOpenCaseStatus,
  scorePotentialMatch,
  suggestMatchesForMissingCase,
  type MatchSuggestion
} from "../domain";
import type {
  AnnouncementEscalation,
  AuditEventType,
  AuditLog,
  CaseMatch,
  ConnectivityStatus,
  DashboardSummary,
  EntityId,
  HandoverRecord,
  OfflineOperationPayload,
  OfflineOperationType,
  OfflineSyncOperation,
  SafetyCard,
  SeparationCase,
  StaffProfile,
  Urgency
} from "../domain/types";
import type {
  IdGenerator,
  ReuniteRepositories,
  TokenGenerator,
  TokenHasher
} from "../repositories";

export interface SafetyKernelDependencies {
  idGenerator: IdGenerator;
  tokenGenerator: TokenGenerator;
  tokenHasher: TokenHasher;
  now(): string;
}

export interface CreateCaseInput {
  eventId: EntityId;
  helpPointId: EntityId;
  personCategory: SeparationCase["personCategory"];
  approxAgeBand: SeparationCase["approxAgeBand"];
  reportedAt: string;
  location: string;
  descriptionTags: string[];
  sensitiveNotes?: string;
  urgency?: Urgency;
  safetyCardToken?: string;
}

export interface RegisterSafetyCardInput {
  eventId: EntityId;
  guardianId?: EntityId;
  cardLabel?: string;
}

export interface RegisterSafetyCardResult {
  safetyCard: SafetyCard;
  qrToken: string;
}

export interface MatchDecisionInput {
  matchId: EntityId;
  reviewNotes?: string;
}

export interface VerifyHandoverInput {
  eventId: EntityId;
  matchId: EntityId;
  guardianId?: EntityId;
  verificationMethod: string;
  verificationNotes?: string;
  handedOverAt: string;
  connectivityStatus: ConnectivityStatus;
}

export interface EscalateForAnnouncementInput {
  eventId: EntityId;
  caseId: EntityId;
  announcementText: string;
  requestedAt: string;
}

export interface QueueOfflineOperationInput {
  eventId: EntityId;
  clientOperationId: string;
  operationType: OfflineOperationType;
  payload: OfflineOperationPayload;
}

export interface SyncOfflineOperationsResult {
  synced: OfflineSyncOperation[];
  failed: OfflineSyncOperation[];
  remainingPending: OfflineSyncOperation[];
}

export interface ReuniteKernelServices {
  createMissingCase(actor: StaffProfile, input: CreateCaseInput): Promise<SeparationCase>;
  createFoundCase(actor: StaffProfile, input: CreateCaseInput): Promise<SeparationCase>;
  registerSafetyCard(
    actor: StaffProfile,
    input: RegisterSafetyCardInput
  ): Promise<RegisterSafetyCardResult>;
  suggestMatches(actor: StaffProfile, missingCaseId: EntityId): Promise<CaseMatch[]>;
  confirmMatch(actor: StaffProfile, input: MatchDecisionInput): Promise<CaseMatch>;
  rejectMatch(actor: StaffProfile, input: MatchDecisionInput): Promise<CaseMatch>;
  verifyAndCompleteHandover(
    actor: StaffProfile,
    input: VerifyHandoverInput
  ): Promise<HandoverRecord>;
  escalateForAnnouncement(
    actor: StaffProfile,
    input: EscalateForAnnouncementInput
  ): Promise<AnnouncementEscalation>;
  getDashboardSummary(
    actor: StaffProfile,
    eventId: EntityId,
    connectivityStatus: ConnectivityStatus
  ): Promise<DashboardSummary>;
  queueOfflineOperation(
    actor: StaffProfile,
    input: QueueOfflineOperationInput
  ): Promise<OfflineSyncOperation>;
  syncOfflineOperations(
    actor: StaffProfile,
    eventId: EntityId,
    connectivityStatus: ConnectivityStatus
  ): Promise<SyncOfflineOperationsResult>;
}

export function createReuniteKernelServices(
  repositories: ReuniteRepositories,
  dependencies: SafetyKernelDependencies
): ReuniteKernelServices {
  async function createMissingCase(actor: StaffProfile, input: CreateCaseInput): Promise<SeparationCase> {
    assertPermission(actor, "case:create_missing");
    assertHelpPointScope(actor, input.helpPointId);

    return createCase(actor, "missing", input, "reported");
  }

  async function createFoundCase(actor: StaffProfile, input: CreateCaseInput): Promise<SeparationCase> {
    assertPermission(actor, "case:create_found");
    assertHelpPointScope(actor, input.helpPointId);

    return createCase(actor, "found", input, "reported");
  }

  async function registerSafetyCard(
    actor: StaffProfile,
    input: RegisterSafetyCardInput
  ): Promise<RegisterSafetyCardResult> {
    assertPermission(actor, "safecard:register");

    const qrToken = dependencies.tokenGenerator.generateToken();
    const tokenHash = dependencies.tokenHasher.hashToken(qrToken);
    const safetyCard: SafetyCard = {
      id: dependencies.idGenerator.nextId("card"),
      eventId: input.eventId,
      guardianId: input.guardianId,
      tokenHash,
      tokenLast4: qrToken.slice(-4),
      label: input.cardLabel,
      status: "active",
      createdAt: dependencies.now()
    };

    const created = await repositories.safetyCards.create(safetyCard);
    await appendAudit(actor, input.eventId, "safecard.registered", "safety_card", created.id, {
      tokenStoredAsHash: true
    });

    return {
      safetyCard: created,
      qrToken
    };
  }

  async function suggestMatches(actor: StaffProfile, missingCaseId: EntityId): Promise<CaseMatch[]> {
    assertPermission(actor, "match:suggest");

    const missingCase = await requireCase(missingCaseId);
    if (missingCase.caseType !== "missing") {
      throw new DomainRuleError("Match suggestions must start from a missing-person case.");
    }

    const foundCases = await repositories.cases.listByEventAndType(missingCase.eventId, "found");
    const helpPoints = await repositories.helpPoints.listByEvent(missingCase.eventId);
    const helpPointsById = new Map(helpPoints.map((helpPoint) => [helpPoint.id, helpPoint]));
    const suggestions = suggestMatchesForMissingCase(missingCase, foundCases, { helpPointsById });

    const createdMatches: CaseMatch[] = [];
    for (const suggestion of suggestions) {
      const match = await createSuggestedMatch(suggestion);
      createdMatches.push(match);
      await appendAudit(actor, missingCase.eventId, "match.suggested", "case_match", match.id, {
        score: match.score,
        tier: match.tier
      });
    }

    return createdMatches;
  }

  async function confirmMatch(actor: StaffProfile, input: MatchDecisionInput): Promise<CaseMatch> {
    assertPermission(actor, "match:confirm");

    const match = await requireMatch(input.matchId);
    const reviewedAt = dependencies.now();
    const confirmedMatch: CaseMatch = {
      ...match,
      status: "confirmed",
      reviewedByStaffId: actor.id,
      reviewedAt
    };

    const missingCase = await requireCase(match.missingCaseId);
    const foundCase = await requireCase(match.foundCaseId);
    await moveCaseToPendingHandover(actor, missingCase);
    await moveCaseToPendingHandover(actor, foundCase);

    const updated = await repositories.matches.update(confirmedMatch);
    await appendAudit(actor, match.eventId, "match.confirmed", "case_match", match.id, {
      reviewNotesPresent: Boolean(input.reviewNotes)
    });

    return updated;
  }

  async function rejectMatch(actor: StaffProfile, input: MatchDecisionInput): Promise<CaseMatch> {
    assertPermission(actor, "match:reject");

    const match = await requireMatch(input.matchId);
    const rejected: CaseMatch = {
      ...match,
      status: "rejected",
      reviewedByStaffId: actor.id,
      reviewedAt: dependencies.now()
    };

    const updated = await repositories.matches.update(rejected);
    await appendAudit(actor, match.eventId, "match.rejected", "case_match", match.id, {
      reviewNotesPresent: Boolean(input.reviewNotes)
    });

    return updated;
  }

  async function verifyAndCompleteHandover(
    actor: StaffProfile,
    input: VerifyHandoverInput
  ): Promise<HandoverRecord> {
    assertPermission(actor, "handover:verify_complete");

    if (input.connectivityStatus !== "stable") {
      throw new DomainRuleError(
        "Verified handover closure requires connected coordinator workflow as a safeguarding control."
      );
    }

    const match = await requireMatch(input.matchId);
    if (match.status !== "confirmed") {
      throw new DomainRuleError("A match must be confirmed before handover can be completed.");
    }

    const missingCase = await requireCase(match.missingCaseId);
    const foundCase = await requireCase(match.foundCaseId);
    assertCaseTransition(missingCase.status, "safely_reunited", { hasVerifiedHandover: true });
    assertCaseTransition(foundCase.status, "safely_reunited", { hasVerifiedHandover: true });

    const handover: HandoverRecord = {
      id: dependencies.idGenerator.nextId("handover"),
      eventId: input.eventId,
      matchId: match.id,
      missingCaseId: missingCase.id,
      foundCaseId: foundCase.id,
      guardianId: input.guardianId,
      verificationMethod: input.verificationMethod,
      verificationNotes: input.verificationNotes,
      approvedByStaffId: actor.id,
      handedOverAt: input.handedOverAt,
      createdAt: dependencies.now()
    };

    const createdHandover = await repositories.handovers.create(handover);
    await repositories.cases.update({
      ...missingCase,
      status: "safely_reunited",
      updatedAt: input.handedOverAt,
      resolvedAt: input.handedOverAt
    });
    await repositories.cases.update({
      ...foundCase,
      status: "safely_reunited",
      updatedAt: input.handedOverAt,
      resolvedAt: input.handedOverAt
    });

    await appendAudit(actor, input.eventId, "handover.verified", "handover_record", createdHandover.id, {
      matchId: match.id
    });
    await appendAudit(actor, input.eventId, "case.safely_reunited", "case_match", match.id, {
      handoverId: createdHandover.id
    });

    return createdHandover;
  }

  async function escalateForAnnouncement(
    actor: StaffProfile,
    input: EscalateForAnnouncementInput
  ): Promise<AnnouncementEscalation> {
    assertPermission(actor, "announcement:escalate");

    const separationCase = await requireCase(input.caseId);
    const escalation: AnnouncementEscalation = {
      id: dependencies.idGenerator.nextId("announcement"),
      eventId: input.eventId,
      caseId: input.caseId,
      status: "queued",
      announcementText: input.announcementText,
      requestedByStaffId: actor.id,
      requestedAt: input.requestedAt
    };

    const created = await repositories.announcements.create(escalation);
    await appendAudit(actor, input.eventId, "announcement.escalated", "announcement_escalation", created.id, {
      caseStatusUnchanged: separationCase.status
    });

    return created;
  }

  async function getDashboardSummary(
    actor: StaffProfile,
    eventId: EntityId,
    connectivityStatus: ConnectivityStatus
  ): Promise<DashboardSummary> {
    const view =
      actor.role === "leadership_viewer" ? "leadership_aggregate" : "operations";
    assertPermission(
      actor,
      view === "leadership_aggregate"
        ? "dashboard:view_leadership_aggregate"
        : "dashboard:view_operations"
    );

    const event = await repositories.events.getById(eventId);
    if (!event) {
      throw new DomainRuleError(`Event ${eventId} was not found.`);
    }

    const [cases, handovers, announcements, pendingOffline] = await Promise.all([
      repositories.cases.listByEvent(eventId),
      repositories.handovers.listByEvent(eventId),
      repositories.announcements.listByEvent(eventId),
      repositories.offlineQueue.listPendingByEvent(eventId)
    ]);

    const openMissingCases = cases.filter(
      (separationCase) =>
        separationCase.caseType === "missing" && isOpenCaseStatus(separationCase.status)
    ).length;
    const foundAwaitingMatch = cases.filter(
      (separationCase) =>
        separationCase.caseType === "found" && isOpenCaseStatus(separationCase.status)
    ).length;
    const urgentUnresolvedCases = cases.filter(
      (separationCase) =>
        separationCase.urgency === "urgent" && isOpenCaseStatus(separationCase.status)
    ).length;
    const paEscalations = announcements.filter(
      (announcement) => announcement.status === "queued" || announcement.status === "announced"
    ).length;

    return {
      view,
      eventId,
      eventName: event.name,
      connectivityStatus,
      openMissingCases,
      foundAwaitingMatch,
      safelyReunitedTotal: handovers.length,
      medianReunionMinutes: calculateMedianReunionMinutes(cases, handovers),
      paEscalations,
      offlineReportsPendingSync: pendingOffline.length,
      urgentUnresolvedCases,
      hotspots: calculateHotspots(cases),
      sensitiveCaseDetailsIncluded: false
    };
  }

  async function queueOfflineOperation(
    actor: StaffProfile,
    input: QueueOfflineOperationInput
  ): Promise<OfflineSyncOperation> {
    assertPermission(actor, "offline:queue_case");

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

  async function syncOfflineOperations(
    actor: StaffProfile,
    eventId: EntityId,
    connectivityStatus: ConnectivityStatus
  ): Promise<SyncOfflineOperationsResult> {
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

  async function createCase(
    actor: StaffProfile,
    caseType: SeparationCase["caseType"],
    input: CreateCaseInput,
    status: SeparationCase["status"]
  ): Promise<SeparationCase> {
    const safetyCard = input.safetyCardToken
      ? await findSafetyCardFromPresentedToken(actor, input.eventId, input.safetyCardToken)
      : null;
    const now = dependencies.now();
    const separationCase: SeparationCase = {
      id: dependencies.idGenerator.nextId(caseType === "missing" ? "missing_case" : "found_case"),
      eventId: input.eventId,
      caseType,
      status,
      personCategory: input.personCategory,
      approxAgeBand: input.approxAgeBand,
      reportedAt: input.reportedAt,
      lastSeenOrFoundLocation: input.location,
      helpPointId: input.helpPointId,
      safetyCardId: safetyCard?.id,
      descriptionTags: input.descriptionTags,
      sensitiveNotes: input.sensitiveNotes,
      urgency: input.urgency ?? "standard",
      createdByStaffId: actor.id,
      createdAt: now,
      updatedAt: now
    };

    const created = await repositories.cases.create(separationCase);
    await appendAudit(actor, input.eventId, "case.created", "separation_case", created.id, {
      caseType,
      status
    });

    return created;
  }

  async function findSafetyCardFromPresentedToken(
    actor: StaffProfile,
    eventId: EntityId,
    presentedToken: string
  ): Promise<SafetyCard | null> {
    assertPermission(actor, "safecard:lookup");

    const tokenHash = dependencies.tokenHasher.hashToken(presentedToken);
    const safetyCard = await repositories.safetyCards.findActiveByTokenHash(tokenHash);
    await appendAudit(actor, eventId, "safecard.lookup", "safety_card", safetyCard?.id, {
      found: Boolean(safetyCard)
    });

    return safetyCard;
  }

  async function createSuggestedMatch(suggestion: MatchSuggestion): Promise<CaseMatch> {
    return repositories.matches.create({
      ...suggestion,
      id: dependencies.idGenerator.nextId("match"),
      status: "suggested",
      createdAt: dependencies.now()
    });
  }

  async function moveCaseToPendingHandover(
    actor: StaffProfile,
    separationCase: SeparationCase
  ): Promise<void> {
    let currentCase = separationCase;
    if (currentCase.status === "reported") {
      assertCaseTransition(currentCase.status, "under_review", { coordinatorReviewed: true });
      currentCase = await repositories.cases.update({
        ...currentCase,
        status: "under_review",
        updatedAt: dependencies.now()
      });
      await appendAudit(actor, currentCase.eventId, "case.review_started", "separation_case", currentCase.id, {
        fromStatus: "reported",
        toStatus: "under_review"
      });
    }

    assertCaseTransition(currentCase.status, "match_pending_handover", { matchConfirmed: true });
    await repositories.cases.update({
      ...currentCase,
      status: "match_pending_handover",
      updatedAt: dependencies.now()
    });
  }

  async function replayOfflineOperation(operation: OfflineSyncOperation): Promise<void> {
    const { payload } = operation;

    if (
      operation.operationType === "create_missing_case" &&
      "caseType" in payload &&
      payload.caseType === "missing"
    ) {
      await createSyncedCaseFromOffline(operation, "missing", payload.lastSeenLocation);
      return;
    }

    if (
      operation.operationType === "create_found_case" &&
      "caseType" in payload &&
      payload.caseType === "found"
    ) {
      await createSyncedCaseFromOffline(operation, "found", payload.foundLocation);
      return;
    }

    if (operation.operationType === "draft_announcement_escalation" && "operation" in payload) {
      await repositories.announcements.create({
        id: dependencies.idGenerator.nextId("announcement"),
        eventId: payload.eventId,
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

  async function createSyncedCaseFromOffline(
    operation: OfflineSyncOperation,
    caseType: SeparationCase["caseType"],
    location: string
  ): Promise<void> {
    if (!("caseType" in operation.payload)) {
      throw new DomainRuleError("Offline case operation payload is invalid.");
    }

    const safetyCard = operation.payload.safetyCardToken
      ? await repositories.safetyCards.findActiveByTokenHash(
          dependencies.tokenHasher.hashToken(operation.payload.safetyCardToken)
        )
      : null;
    const now = dependencies.now();
    const syncedCase: SeparationCase = {
      id: dependencies.idGenerator.nextId(caseType === "missing" ? "missing_case" : "found_case"),
      eventId: operation.payload.eventId,
      caseType,
      status: "reported",
      personCategory: operation.payload.personCategory,
      approxAgeBand: operation.payload.approxAgeBand,
      reportedAt: operation.payload.reportedAt,
      lastSeenOrFoundLocation: location,
      helpPointId: operation.payload.helpPointId,
      safetyCardId: safetyCard?.id,
      descriptionTags: operation.payload.descriptionTags,
      sensitiveNotes: operation.payload.sensitiveNotes,
      urgency: operation.payload.urgency,
      createdByStaffId: operation.actorStaffId,
      createdAt: now,
      updatedAt: now
    };

    if (operation.localEntityId) {
      const pendingCase = await repositories.cases.getById(operation.localEntityId);
      if (!pendingCase) {
        throw new DomainRuleError(`Pending offline case ${operation.localEntityId} was not found.`);
      }

      assertCaseTransition(pendingCase.status, "reported", { syncCompleted: true });
      await repositories.cases.update({
        ...pendingCase,
        status: "reported",
        safetyCardId: safetyCard?.id ?? pendingCase.safetyCardId,
        updatedAt: now
      });
      return;
    }

    await repositories.cases.create(syncedCase);
  }

  async function createPendingLocalEntityForOfflineOperation(
    actor: StaffProfile,
    payload: OfflineOperationPayload
  ): Promise<EntityId | undefined> {
    if (!("caseType" in payload)) {
      return undefined;
    }

    assertHelpPointScope(actor, payload.helpPointId);

    const location = payload.caseType === "missing" ? payload.lastSeenLocation : payload.foundLocation;
    const now = dependencies.now();
    const pendingCase: SeparationCase = {
      id: dependencies.idGenerator.nextId(
        payload.caseType === "missing" ? "pending_missing_case" : "pending_found_case"
      ),
      eventId: payload.eventId,
      caseType: payload.caseType,
      status: "pending_sync",
      personCategory: payload.personCategory,
      approxAgeBand: payload.approxAgeBand,
      reportedAt: payload.reportedAt,
      lastSeenOrFoundLocation: location,
      helpPointId: payload.helpPointId,
      descriptionTags: payload.descriptionTags,
      sensitiveNotes: payload.sensitiveNotes,
      urgency: payload.urgency,
      createdByStaffId: actor.id,
      createdAt: now,
      updatedAt: now
    };

    const created = await repositories.cases.create(pendingCase);
    return created.id;
  }

  async function appendAudit(
    actor: StaffProfile,
    eventId: EntityId,
    action: AuditEventType,
    entityType: AuditLog["entityType"],
    entityId: EntityId | undefined,
    metadata: AuditLog["metadata"]
  ): Promise<AuditLog> {
    return repositories.audits.append({
      id: dependencies.idGenerator.nextId("audit"),
      eventId,
      actorStaffId: actor.id,
      action,
      entityType,
      entityId,
      metadata,
      createdAt: dependencies.now()
    });
  }

  async function requireCase(caseId: EntityId): Promise<SeparationCase> {
    const separationCase = await repositories.cases.getById(caseId);
    if (!separationCase) {
      throw new DomainRuleError(`Separation case ${caseId} was not found.`);
    }

    return separationCase;
  }

  async function requireMatch(matchId: EntityId): Promise<CaseMatch> {
    const match = await repositories.matches.getById(matchId);
    if (!match) {
      throw new DomainRuleError(`Case match ${matchId} was not found.`);
    }

    return match;
  }

  function assertHelpPointScope(actor: StaffProfile, helpPointId: EntityId): void {
    if (actor.role === "helppoint_volunteer" && actor.helpPointId !== helpPointId) {
      throw new DomainRuleError("HelpPoint volunteers can only create reports for their assigned HelpPoint.");
    }
  }

  function calculateMedianReunionMinutes(
    cases: SeparationCase[],
    handovers: HandoverRecord[]
  ): number | null {
    const durations = handovers
      .map((handover) => {
        const missingCase = cases.find((separationCase) => separationCase.id === handover.missingCaseId);
        if (!missingCase) {
          return null;
        }

        const start = new Date(missingCase.reportedAt).getTime();
        const end = new Date(handover.handedOverAt).getTime();
        if (Number.isNaN(start) || Number.isNaN(end)) {
          return null;
        }

        return Math.max(0, Math.round((end - start) / 60000));
      })
      .filter((duration): duration is number => duration !== null)
      .sort((left, right) => left - right);

    if (durations.length === 0) {
      return null;
    }

    const middle = Math.floor(durations.length / 2);
    if (durations.length % 2 === 1) {
      return durations[middle] ?? null;
    }

    const left = durations[middle - 1] ?? 0;
    const right = durations[middle] ?? 0;
    return Math.round((left + right) / 2);
  }

  function calculateHotspots(cases: SeparationCase[]): DashboardSummary["hotspots"] {
    const counts = new Map<string, number>();
    for (const separationCase of cases) {
      counts.set(
        separationCase.lastSeenOrFoundLocation,
        (counts.get(separationCase.lastSeenOrFoundLocation) ?? 0) + 1
      );
    }

    return Array.from(counts.entries())
      .map(([locationLabel, caseCount]) => ({ locationLabel, caseCount }))
      .sort((left, right) => right.caseCount - left.caseCount)
      .slice(0, 5);
  }

  return {
    createMissingCase,
    createFoundCase,
    registerSafetyCard,
    suggestMatches,
    confirmMatch,
    rejectMatch,
    verifyAndCompleteHandover,
    escalateForAnnouncement,
    getDashboardSummary,
    queueOfflineOperation,
    syncOfflineOperations
  };
}

export function compareCasesForMatch(
  missingCase: SeparationCase,
  foundCase: SeparationCase,
  helpPoints: Map<string, import("../domain/types").HelpPoint>
): MatchSuggestion {
  return scorePotentialMatch(missingCase, foundCase, { helpPointsById: helpPoints });
}
