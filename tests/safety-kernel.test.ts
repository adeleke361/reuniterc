import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, test } from "node:test";
import {
  assertItemCaseTransition,
  assertItemReleasedRequiresReleaseRecord,
  assertPersonCaseTransition,
  assertSafelyReunitedRequiresHandover,
  canTransitionItemCaseStatus,
  canTransitionPersonCaseStatus,
  DomainRuleError,
  hasPermission
} from "../src/domain";
import {
  advanceGuidedDemoStep,
  completeItemReleaseRuntime,
  completePersonHandoverRuntime,
  createInitialGuidedDemoState,
  getGuidedDemoVisibility,
  queueOfflineDemoReport,
  resetGuidedDemoScenario,
  setGuidedDemoConnectivity
} from "../src/demo/guided-demo";
import { getDemoScenarioSnapshot } from "../src/demo/scenario-data";
import { DEMO_EVENT_ID } from "../src/repositories/demo/seed-data";
import { createDemoSafetyKernel } from "../src/services";

describe("role permissions", () => {
  test("enforces Phase 1B role-specific controls", () => {
    assert.equal(hasPermission("information_bureau_coordinator", "match:confirm"), true);
    assert.equal(hasPermission("information_bureau_coordinator", "person_handover:complete"), true);
    assert.equal(hasPermission("information_bureau_coordinator", "item_release:complete"), true);
    assert.equal(hasPermission("information_bureau_coordinator", "announcement:escalate"), true);

    assert.equal(hasPermission("helppoint_volunteer", "person_report:create_looking"), true);
    assert.equal(hasPermission("helppoint_volunteer", "item_report:create_found"), true);
    assert.equal(hasPermission("helppoint_volunteer", "match:confirm"), false);
    assert.equal(hasPermission("helppoint_volunteer", "item_release:complete"), false);

    assert.equal(hasPermission("leadership_viewer", "dashboard:view_leadership_aggregate"), true);
    assert.equal(hasPermission("leadership_viewer", "case:view_sensitive"), false);

    assert.equal(hasPermission("public_reporter", "person_report:create_looking"), true);
    assert.equal(hasPermission("public_reporter", "item_report:create_lost"), true);
    assert.equal(hasPermission("public_reporter", "dashboard:view_operations"), false);
  });
});

describe("person and item workflow state machines", () => {
  test("allow valid transitions and reject unsafe final closure", () => {
    assert.equal(
      canTransitionPersonCaseStatus("pending_sync", "report_created", { syncCompleted: true }),
      true
    );
    assert.equal(
      canTransitionPersonCaseStatus("report_created", "possible_match_suggested", {
        matchSuggested: true
      }),
      true
    );
    assert.equal(
      canTransitionPersonCaseStatus("possible_match_suggested", "match_confirmed_by_information_bureau", {
        matchConfirmed: true
      }),
      true
    );
    assert.equal(
      canTransitionPersonCaseStatus("match_confirmed_by_information_bureau", "verified_handover_completed", {
        hasVerifiedHandover: true
      }),
      true
    );
    assert.equal(
      canTransitionPersonCaseStatus("verified_handover_completed", "safely_reunited", {
        hasVerifiedHandover: true
      }),
      true
    );
    assert.equal(
      canTransitionPersonCaseStatus("report_created", "safely_reunited", { hasVerifiedHandover: true }),
      false
    );
    assert.throws(
      () => assertPersonCaseTransition("verified_handover_completed", "safely_reunited"),
      DomainRuleError
    );

    assert.equal(
      canTransitionItemCaseStatus("pending_sync", "report_created", { syncCompleted: true }),
      true
    );
    assert.equal(
      canTransitionItemCaseStatus("possible_match_suggested", "match_confirmed_by_information_bureau", {
        matchConfirmed: true
      }),
      true
    );
    assert.equal(
      canTransitionItemCaseStatus("match_confirmed_by_information_bureau", "proof_of_ownership_verified", {
        hasProofOfOwnership: true
      }),
      true
    );
    assert.equal(
      canTransitionItemCaseStatus("proof_of_ownership_verified", "item_released", {
        hasProofOfOwnership: true
      }),
      true
    );
    assert.throws(
      () => assertItemCaseTransition("proof_of_ownership_verified", "item_released"),
      DomainRuleError
    );
  });

  test("requires verification records before final person reunion or item release", async () => {
    const { repositories } = createDemoSafetyKernel();
    const completedPersonCase = await repositories.personCases.getById("person_looking_child_completed");
    const completedItemCase = await repositories.itemCases.getById("item_found_bible_completed");
    assert.ok(completedPersonCase);
    assert.ok(completedItemCase);

    assert.throws(
      () => assertSafelyReunitedRequiresHandover(completedPersonCase),
      DomainRuleError
    );
    assert.throws(
      () => assertItemReleasedRequiresReleaseRecord(completedItemCase),
      DomainRuleError
    );
  });
});

describe("rule-based match engines", () => {
  test("scores Reunite Point location-aware person matches as strong recommendations", async () => {
    const { repositories, services } = createDemoSafetyKernel();
    const coordinator = await getActor(repositories, "staff_demo_coordinator");

    const matches = await services.suggestPersonMatches(coordinator, "person_looking_child_open");
    const strongMatch = matches.find((match) => match.foundCaseId === "person_found_child_candidate");

    assert.ok(strongMatch);
    assert.equal(strongMatch.score, 92);
    assert.equal(strongMatch.tier, "strong_match_recommendation");
    assert.ok(strongMatch.score >= 80);
    assert.ok(strongMatch.reasons.some((reason) => reason.code === "reunite_point_proximity"));
    assert.ok(strongMatch.reasons.some((reason) => reason.code === "human_verification_required"));
  });

  test("scores Reunite Point location-aware item matches as strong recommendations", async () => {
    const { repositories, services } = createDemoSafetyKernel();
    const coordinator = await getActor(repositories, "staff_demo_coordinator");

    const matches = await services.suggestItemMatches(coordinator, "item_lost_bag_open");
    const strongMatch = matches.find((match) => match.foundItemCaseId === "item_found_bag_candidate");

    assert.ok(strongMatch);
    assert.equal(strongMatch.score, 87);
    assert.equal(strongMatch.tier, "strong_match_recommendation");
    assert.ok(strongMatch.score >= 80);
    assert.ok(strongMatch.reasons.some((reason) => reason.code === "reunite_point_proximity"));
    assert.ok(strongMatch.reasons.some((reason) => reason.code === "proof_of_ownership_required"));
    assert.ok(strongMatch.reasons.some((reason) => reason.code === "hidden_verification_detail" && reason.staffOnly));
  });
});

describe("PA escalation and offline safety", () => {
  test("PA escalation does not close or resolve person or item cases", async () => {
    const { repositories, services } = createDemoSafetyKernel();
    const coordinator = await getActor(repositories, "staff_demo_coordinator");
    const personBefore = await repositories.personCases.getById("person_looking_elder_pa");
    const itemBefore = await repositories.itemCases.getById("item_lost_bag_open");
    assert.ok(personBefore);
    assert.ok(itemBefore);

    const personEscalation = await services.escalateForAnnouncement(coordinator, {
      eventId: DEMO_EVENT_ID,
      caseKind: "person_case",
      caseId: personBefore.id,
      announcementText: "Fictional privacy-conscious PA escalation for test.",
      requestedAt: "2026-08-10T21:10:00Z"
    });
    const itemEscalation = await services.escalateForAnnouncement(coordinator, {
      eventId: DEMO_EVENT_ID,
      caseKind: "item_case",
      caseId: itemBefore.id,
      announcementText: "Fictional lost-item desk announcement for test.",
      requestedAt: "2026-08-10T21:11:00Z"
    });
    const personAfter = await repositories.personCases.getById(personBefore.id);
    const itemAfter = await repositories.itemCases.getById(itemBefore.id);

    assert.equal(personEscalation.status, "queued");
    assert.equal(itemEscalation.status, "queued");
    assert.equal(personAfter?.status, personBefore.status);
    assert.equal(itemAfter?.status, itemBefore.status);
    assert.equal(personAfter?.resolvedAt, undefined);
    assert.equal(itemAfter?.resolvedAt, undefined);
  });

  test("offline queued person and item reports remain pending until stable sync succeeds", async () => {
    const { repositories, services } = createDemoSafetyKernel();
    const volunteer = await getActor(repositories, "staff_demo_volunteer_arena");

    const queuedPerson = await services.queueOfflineReport(volunteer, {
      eventId: DEMO_EVENT_ID,
      clientOperationId: "offline-client-test-person-001",
      operationType: "create_found_person_report",
      payload: {
        caseIntent: "found_person",
        eventId: DEMO_EVENT_ID,
        reportSourcePointId: "point_arena_rear",
        personCategory: "group_member",
        approximateAgeBand: "18-59",
        reportedAt: "2026-08-10T21:02:00Z",
        lastSeenOrFoundLocation: "Arena Rear volunteer desk",
        groupOrChurchReference: "Fictional Youth Team C",
        nonSensitiveDescriptionTags: ["group-badge", "demo-test"],
        sensitiveNotes: "Fictional offline found-person report for test.",
        urgency: "standard"
      }
    });
    const queuedItem = await services.queueOfflineReport(volunteer, {
      eventId: DEMO_EVENT_ID,
      clientOperationId: "offline-client-test-item-001",
      operationType: "create_found_item_report",
      payload: {
        itemIntent: "found_item",
        eventId: DEMO_EVENT_ID,
        reportSourcePointId: "point_arena_rear",
        itemCategory: "wallet",
        itemColorOrDescriptionTags: ["brown-wallet", "small"],
        reportedAt: "2026-08-10T21:03:00Z",
        lastSeenOrFoundLocation: "Arena Rear volunteer desk",
        hiddenVerificationDetail: "Fictional card-slot detail",
        urgency: "standard"
      }
    });

    assert.equal(queuedPerson.status, "pending");
    assert.equal(queuedItem.status, "pending");
    assert.ok(queuedPerson.localEntityId);
    assert.ok(queuedItem.localEntityId);
    assert.equal((await repositories.personCases.getById(queuedPerson.localEntityId))?.status, "pending_sync");
    assert.equal((await repositories.itemCases.getById(queuedItem.localEntityId))?.status, "pending_sync");

    const degradedResult = await services.syncOfflineReports(volunteer, DEMO_EVENT_ID, "degraded");
    assert.equal(degradedResult.synced.length, 0);
    assert.ok(degradedResult.remainingPending.some((operation) => operation.id === queuedPerson.id));
    assert.ok(degradedResult.remainingPending.some((operation) => operation.id === queuedItem.id));

    const stableResult = await services.syncOfflineReports(volunteer, DEMO_EVENT_ID, "stable");
    assert.ok(stableResult.synced.some((operation) => operation.id === queuedPerson.id));
    assert.ok(stableResult.synced.some((operation) => operation.id === queuedItem.id));
    assert.equal(stableResult.remainingPending.length, 0);
    assert.equal((await repositories.personCases.getById(queuedPerson.localEntityId))?.status, "report_created");
    assert.equal((await repositories.itemCases.getById(queuedItem.localEntityId))?.status, "report_created");
  });

  test("final person reunion and item release are blocked while offline", async () => {
    const { repositories, services } = createDemoSafetyKernel();
    const coordinator = await getActor(repositories, "staff_demo_coordinator");

    const personMatch = (
      await services.suggestPersonMatches(coordinator, "person_looking_child_open")
    ).find((match) => match.foundCaseId === "person_found_child_candidate");
    assert.ok(personMatch);
    const confirmedPersonMatch = await services.confirmPersonMatch(coordinator, {
      matchId: personMatch.id,
      connectivityStatus: "stable"
    });
    await assert.rejects(
      () =>
        services.completePersonHandover(coordinator, {
          eventId: DEMO_EVENT_ID,
          matchId: confirmedPersonMatch.id,
          verificationMethod: "Information Bureau verification test",
          handedOverAt: "2026-08-10T21:15:00Z",
          connectivityStatus: "degraded"
        }),
      DomainRuleError
    );

    const itemMatch = (
      await services.suggestItemMatches(coordinator, "item_lost_bag_open")
    ).find((match) => match.foundItemCaseId === "item_found_bag_candidate");
    assert.ok(itemMatch);
    const confirmedItemMatch = await services.confirmItemMatch(coordinator, {
      matchId: itemMatch.id,
      connectivityStatus: "stable"
    });
    await assert.rejects(
      () =>
        services.completeItemRelease(coordinator, {
          eventId: DEMO_EVENT_ID,
          matchId: confirmedItemMatch.id,
          proofOfOwnershipMethod: "Proof detail matched",
          releasedAt: "2026-08-10T21:16:00Z",
          connectivityStatus: "degraded"
        }),
      DomainRuleError
    );
  });
});

describe("access and analytics safeguards", () => {
  test("public reporter cannot resolve cases", async () => {
    const { repositories, services } = createDemoSafetyKernel();
    const publicReporter = await getActor(repositories, "public_demo_reporter");

    await assert.rejects(
      () =>
        services.completePersonHandover(publicReporter, {
          eventId: DEMO_EVENT_ID,
          matchId: "person_match_demo_completed",
          verificationMethod: "Not allowed",
          handedOverAt: "2026-08-10T21:20:00Z",
          connectivityStatus: "stable"
        }),
      /not permitted/
    );
    await assert.rejects(
      () =>
        services.completeItemRelease(publicReporter, {
          eventId: DEMO_EVENT_ID,
          matchId: "item_match_demo_completed",
          proofOfOwnershipMethod: "Not allowed",
          releasedAt: "2026-08-10T21:21:00Z",
          connectivityStatus: "stable"
        }),
      /not permitted/
    );
  });

  test("leadership analytics remain aggregate-only", async () => {
    const { repositories, services } = createDemoSafetyKernel();
    const leadership = await getActor(repositories, "staff_demo_leadership");

    const summary = await services.getLeadershipAnalytics(leadership, DEMO_EVENT_ID, "stable");
    const serializedSummary = JSON.stringify(summary);

    assert.equal(summary.view, "leadership_aggregate");
    assert.equal(summary.sensitiveCaseDetailsIncluded, false);
    assert.ok(summary.personReportsTotal >= 1);
    assert.ok(summary.itemReportsTotal >= 1);
    assert.ok(summary.hotspots.every((hotspot) => !("caseId" in hotspot)));
    assert.equal(serializedSummary.includes("person_looking_child_open"), false);
    assert.equal(serializedSummary.includes("Fictional demo-only"), false);
    assert.equal(serializedSummary.includes("hiddenVerificationDetail"), false);
  });

  test("removed QR identity concepts do not remain in active source or docs", async () => {
    const filesToScan = [
      "AGENTS.md",
      "PRODUCT_SPEC.md",
      "ARCHITECTURE.md",
      "DATA_MODEL.md",
      "API_CONTRACTS.md",
      "IMPLEMENTATION_PLAN.md",
      "DECISIONS.md",
      "README.md",
      "src/domain/types.ts",
      "src/domain/match-engine.ts",
      "src/domain/permissions.ts",
      "src/repositories/interfaces.ts",
      "src/repositories/demo/seed-data.ts",
      "src/services/safety-kernel.ts"
    ];
    const bannedConcepts = [
      "Safe" + "Card",
      "Safe" + "Band",
      "Reunite" + " Pass",
      "Safety" + "Card",
      ["safety", "cards"].join("_"),
      ["/safe", "card"].join(""),
      ["exact", ["safe", "card"].join(""), "token"].join("_"),
      ["safe", "card"].join("")
    ];

    for (const file of filesToScan) {
      const content = await readFile(path.join(process.cwd(), file), "utf8");
      for (const concept of bannedConcepts) {
        assert.equal(
          content.toLowerCase().includes(concept.toLowerCase()),
          false,
          `${concept} should not appear in ${file}`
        );
      }
    }
  });
});

describe("guided demo orchestration", () => {
  test("progresses through guided demo state", () => {
    const initialState = createInitialGuidedDemoState();
    const afterPoint = advanceGuidedDemoStep(initialState, "ready-rp014");
    const afterMissingReport = advanceGuidedDemoStep(afterPoint, "missing-child-reported");

    assert.equal(afterPoint.completedStepIds.includes("ready-rp014"), true);
    assert.equal(afterPoint.activeStepIndex, 1);
    assert.equal(afterMissingReport.completedStepIds.includes("missing-child-reported"), true);
    assert.equal(afterMissingReport.activeStepIndex, 2);
  });

  test("demo starts without completed outcomes or match scores", () => {
    const visibility = getGuidedDemoVisibility(createInitialGuidedDemoState());

    assert.equal(visibility.showPersonMatchScore, false);
    assert.equal(visibility.showItemMatchScore, false);
    assert.equal(visibility.showSafelyReunitedOutcome, false);
    assert.equal(visibility.showItemReleaseOutcome, false);
    assert.equal(visibility.showOfflineQueuedCount, false);
  });

  test("safely reunited is not visible before verified handover stage", () => {
    const beforeHandover = advanceGuidedDemoStep(
      advanceGuidedDemoStep(
        advanceGuidedDemoStep(createInitialGuidedDemoState(), "ready-rp014"),
        "missing-child-reported"
      ),
      "found-child-reported"
    );
    const afterMatchReview = advanceGuidedDemoStep(beforeHandover, "person-match-recommended");
    const afterHandover = completePersonHandoverRuntime(afterMatchReview);

    assert.equal(getGuidedDemoVisibility(afterMatchReview).showSafelyReunitedOutcome, false);
    assert.equal(getGuidedDemoVisibility(afterHandover).showSafelyReunitedOutcome, true);
  });

  test("item released is not visible before proof-of-ownership release stage", () => {
    const beforeRelease = advanceGuidedDemoStep(
      completePersonHandoverRuntime(
        advanceGuidedDemoStep(
          advanceGuidedDemoStep(
            advanceGuidedDemoStep(
              advanceGuidedDemoStep(createInitialGuidedDemoState(), "ready-rp014"),
              "missing-child-reported"
            ),
            "found-child-reported"
          ),
          "person-match-recommended"
        )
      ),
      "safely-reunited"
    );
    const afterItemMatch = advanceGuidedDemoStep(beforeRelease, "item-match-recommended");
    const afterRelease = completeItemReleaseRuntime(afterItemMatch);

    assert.equal(getGuidedDemoVisibility(afterItemMatch).showItemReleaseOutcome, false);
    assert.equal(getGuidedDemoVisibility(afterRelease).showItemReleaseOutcome, true);
  });

  test("blocks final handover and item release in degraded connectivity", () => {
    const degradedState = setGuidedDemoConnectivity(createInitialGuidedDemoState(), "degraded");

    assert.throws(() => completePersonHandoverRuntime(degradedState), /degraded/);
    assert.throws(() => completeItemReleaseRuntime(degradedState), /degraded/);
  });

  test("queues offline report only while degraded", () => {
    const stableState = createInitialGuidedDemoState();
    const unchanged = queueOfflineDemoReport(stableState);
    const degradedState = setGuidedDemoConnectivity(stableState, "degraded");
    const queued = queueOfflineDemoReport(degradedState);

    assert.equal(unchanged.offlineQueuedReports, 0);
    assert.equal(queued.offlineQueuedReports, 1);
    assert.equal(queued.completedStepIds.includes("offline-queue-test"), true);
  });

  test("reset demo scenario restores baseline", () => {
    const modifiedState = completePersonHandoverRuntime(createInitialGuidedDemoState());
    const resetState = resetGuidedDemoScenario();

    assert.equal(modifiedState.personHandoverCompleted, true);
    assert.deepEqual(resetState, createInitialGuidedDemoState());
  });

  test("Phase 2A snapshot keeps leadership view aggregate-only", async () => {
    const snapshot = await getDemoScenarioSnapshot();
    const serialized = JSON.stringify(snapshot.leadershipAnalytics);

    assert.equal(snapshot.leadershipAnalytics.view, "leadership_aggregate");
    assert.equal(snapshot.leadershipAnalytics.sensitiveCaseDetailsIncluded, false);
    assert.equal(serialized.includes("hiddenVerificationDetail"), false);
    assert.equal(serialized.includes("sensitiveNotes"), false);
    assert.equal(serialized.includes("person_looking_child_open"), false);
  });
});

async function getActor(
  repositories: ReturnType<typeof createDemoSafetyKernel>["repositories"],
  actorId: string
) {
  const actor = await repositories.actorProfiles.getById(actorId);
  assert.ok(actor, `Expected demo actor profile ${actorId} to exist.`);
  return actor;
}
