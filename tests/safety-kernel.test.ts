import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  assertCaseTransition,
  assertSafelyReunitedRequiresHandover,
  canTransitionCaseStatus,
  DomainRuleError,
  hasPermission,
  scorePotentialMatch
} from "../src/domain";
import { DEMO_EVENT_ID } from "../src/repositories/demo/seed-data";
import { createDemoSafetyKernel } from "../src/services";

describe("role permissions", () => {
  test("enforces role-specific safety controls", () => {
    assert.equal(hasPermission("information_bureau_coordinator", "match:confirm"), true);
    assert.equal(hasPermission("information_bureau_coordinator", "handover:verify_complete"), true);
    assert.equal(hasPermission("information_bureau_coordinator", "announcement:escalate"), true);

    assert.equal(hasPermission("helppoint_volunteer", "case:create_missing"), true);
    assert.equal(hasPermission("helppoint_volunteer", "safecard:lookup"), true);
    assert.equal(hasPermission("helppoint_volunteer", "match:confirm"), false);
    assert.equal(hasPermission("helppoint_volunteer", "handover:verify_complete"), false);

    assert.equal(hasPermission("leadership_viewer", "dashboard:view_leadership_aggregate"), true);
    assert.equal(hasPermission("leadership_viewer", "case:view_sensitive"), false);

    assert.equal(hasPermission("guardian_group_leader", "safecard:register"), true);
    assert.equal(hasPermission("guardian_group_leader", "dashboard:view_operations"), false);
  });
});

describe("case workflow state machine", () => {
  test("allows valid transitions and rejects unsafe closure", () => {
    assert.equal(
      canTransitionCaseStatus("pending_sync", "reported", { syncCompleted: true }),
      true
    );
    assert.equal(
      canTransitionCaseStatus("reported", "under_review", { coordinatorReviewed: true }),
      true
    );
    assert.equal(
      canTransitionCaseStatus("under_review", "match_pending_handover", {
        matchConfirmed: true
      }),
      true
    );
    assert.equal(
      canTransitionCaseStatus("match_pending_handover", "safely_reunited", {
        hasVerifiedHandover: true
      }),
      true
    );

    assert.equal(
      canTransitionCaseStatus("reported", "safely_reunited", { hasVerifiedHandover: true }),
      false
    );
    assert.throws(
      () => assertCaseTransition("match_pending_handover", "safely_reunited"),
      DomainRuleError
    );
  });

  test("prohibits safely reunited status without a verified handover record", async () => {
    const { repositories } = createDemoSafetyKernel();
    const completedCase = await repositories.cases.getById("case_missing_child_completed");
    assert.ok(completedCase);

    assert.throws(
      () => assertSafelyReunitedRequiresHandover(completedCase),
      DomainRuleError
    );
  });
});

describe("assisted match engine", () => {
  test("scores exact SafeCard-compatible cases as a strong recommendation", async () => {
    const { repositories, services } = createDemoSafetyKernel();
    const coordinator = await getActor(repositories, "staff_demo_coordinator");

    const matches = await services.suggestMatches(coordinator, "case_missing_child_open");
    const strongMatch = matches.find((match) => match.foundCaseId === "case_found_child_candidate");

    assert.ok(strongMatch);
    assert.equal(strongMatch.tier, "strong_match_recommendation");
    assert.ok(strongMatch.score >= 80);
    assert.ok(strongMatch.reasons.some((reason) => reason.code === "exact_safecard_token"));
    assert.ok(
      strongMatch.reasons.some((reason) =>
        reason.label.includes("Human coordinator verification is required")
      )
    );
  });

  test("scores lower when SafeCard token compatibility is absent", async () => {
    const { repositories } = createDemoSafetyKernel();
    const missingCase = await repositories.cases.getById("case_missing_child_open");
    const foundCase = await repositories.cases.getById("case_found_child_candidate");
    const helpPoints = await repositories.helpPoints.listByEvent(DEMO_EVENT_ID);
    assert.ok(missingCase);
    assert.ok(foundCase);

    const suggestion = scorePotentialMatch(
      missingCase,
      {
        ...foundCase,
        safetyCardId: undefined,
        descriptionTags: ["blue-top"]
      },
      { helpPointsById: new Map(helpPoints.map((helpPoint) => [helpPoint.id, helpPoint])) }
    );

    assert.equal(suggestion.tier, "insufficient_confidence");
    assert.ok(suggestion.score < 55);
    assert.equal(
      suggestion.reasons.some((reason) => reason.code === "exact_safecard_token"),
      false
    );
  });
});

describe("PA escalation and offline safety", () => {
  test("PA escalation does not close or resolve a case", async () => {
    const { repositories, services } = createDemoSafetyKernel();
    const coordinator = await getActor(repositories, "staff_demo_coordinator");
    const before = await repositories.cases.getById("case_missing_elder_pa");
    assert.ok(before);

    const escalation = await services.escalateForAnnouncement(coordinator, {
      eventId: DEMO_EVENT_ID,
      caseId: before.id,
      announcementText: "Fictional privacy-conscious PA escalation for test.",
      requestedAt: "2026-08-10T21:10:00Z"
    });
    const after = await repositories.cases.getById(before.id);

    assert.equal(escalation.status, "queued");
    assert.equal(after?.status, before.status);
    assert.equal(after?.resolvedAt, undefined);
  });

  test("offline reports stay pending until stable sync succeeds", async () => {
    const { repositories, services } = createDemoSafetyKernel();
    const volunteer = await getActor(repositories, "staff_demo_volunteer_b");

    const queued = await services.queueOfflineOperation(volunteer, {
      eventId: DEMO_EVENT_ID,
      clientOperationId: "offline-client-test-001",
      operationType: "create_found_case",
      payload: {
        caseType: "found",
        eventId: DEMO_EVENT_ID,
        helpPointId: "hp_b_arena_rear",
        personCategory: "group_member",
        approxAgeBand: "18-59",
        reportedAt: "2026-08-10T21:02:00Z",
        foundLocation: "HelpPoint B near Arena Rear",
        descriptionTags: ["group-badge", "demo-test"],
        sensitiveNotes: "Fictional offline found report for test.",
        urgency: "standard"
      }
    });
    assert.equal(queued.status, "pending");
    assert.ok(queued.localEntityId);

    const pendingCase = await repositories.cases.getById(queued.localEntityId);
    assert.equal(pendingCase?.status, "pending_sync");

    const degradedResult = await services.syncOfflineOperations(volunteer, DEMO_EVENT_ID, "degraded");
    assert.equal(degradedResult.synced.length, 0);
    assert.ok(degradedResult.remainingPending.some((operation) => operation.id === queued.id));

    const stableResult = await services.syncOfflineOperations(volunteer, DEMO_EVENT_ID, "stable");
    const syncedQueued = stableResult.synced.find((operation) => operation.id === queued.id);
    assert.ok(syncedQueued);
    assert.equal(syncedQueued.status, "synced");
    assert.equal(stableResult.remainingPending.length, 0);

    const syncedCase = await repositories.cases.getById(queued.localEntityId);
    assert.equal(syncedCase?.status, "reported");
  });
});

describe("dashboard aggregation", () => {
  test("leadership summary contains aggregate values only", async () => {
    const { repositories, services } = createDemoSafetyKernel();
    const leadership = await getActor(repositories, "staff_demo_leadership");

    const summary = await services.getDashboardSummary(leadership, DEMO_EVENT_ID, "stable");
    const serializedSummary = JSON.stringify(summary);

    assert.equal(summary.view, "leadership_aggregate");
    assert.equal(summary.sensitiveCaseDetailsIncluded, false);
    assert.ok(summary.openMissingCases >= 1);
    assert.ok(summary.hotspots.every((hotspot) => !("caseId" in hotspot)));
    assert.equal(serializedSummary.includes("case_missing_child_open"), false);
    assert.equal(serializedSummary.includes("Fictional demo-only"), false);
  });
});

async function getActor(
  repositories: ReturnType<typeof createDemoSafetyKernel>["repositories"],
  staffId: string
) {
  const actor = await repositories.staffProfiles.getById(staffId);
  assert.ok(actor, `Expected demo staff profile ${staffId} to exist.`);
  return actor;
}
