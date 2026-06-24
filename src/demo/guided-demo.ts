import type { ConnectivityStatus } from "../domain/types";

export const guidedDemoSteps = [
  {
    id: "ready-rp014",
    label: "View RP-014",
    route: "/reunite-points",
    summary: "Arena Rear Reunite Point is the reporting source."
  },
  {
    id: "missing-child-reported",
    label: "Missing child reported",
    route: "/report/person",
    summary: "A parent or group leader files a looking-for-person report."
  },
  {
    id: "found-child-reported",
    label: "Found child reported from RP-014",
    route: "/report/person",
    summary: "A volunteer files a found-person report from the same Reunite Point."
  },
  {
    id: "person-match-recommended",
    label: "Likely person match",
    route: "/matches/person",
    summary: "Information Bureau reviews a rule-based recommendation."
  },
  {
    id: "guardian-group-verification",
    label: "Guardian/group verification",
    route: "/handover/person/person_match_demo",
    summary: "A coordinator verifies the reporter and group context."
  },
  {
    id: "safely-reunited",
    label: "Safely Reunited",
    route: "/handover/person/person_match_demo",
    summary: "Verified handover closes the person case safely."
  },
  {
    id: "item-match-recommended",
    label: "Likely item match",
    route: "/matches/item",
    summary: "Lost and found bag reports are compared transparently."
  },
  {
    id: "item-release-verified",
    label: "Proof-of-ownership item release",
    route: "/release/item/item_match_demo",
    summary: "Proof of ownership is required before item release."
  },
  {
    id: "offline-queue-test",
    label: "Low-connectivity queue",
    route: "/demo",
    summary: "Degraded connectivity queues staff reports for later sync."
  },
  {
    id: "leadership-outcome",
    label: "Leadership outcome",
    route: "/analytics",
    summary: "Leadership sees aggregate outcomes only."
  }
] as const;

export type GuidedDemoStepId = (typeof guidedDemoSteps)[number]["id"];

export interface GuidedDemoRuntimeState {
  activeStepIndex: number;
  completedStepIds: GuidedDemoStepId[];
  connectivityStatus: ConnectivityStatus;
  offlineQueuedReports: number;
  personHandoverCompleted: boolean;
  itemReleaseCompleted: boolean;
}

export interface GuidedDemoVisibility {
  showMissingReport: boolean;
  showFoundReport: boolean;
  showPersonMatchScore: boolean;
  showVerification: boolean;
  showSafelyReunitedOutcome: boolean;
  showItemMatchScore: boolean;
  showItemReleaseOutcome: boolean;
  showOfflineQueue: boolean;
  showOfflineQueuedCount: boolean;
  showLeadershipOutcome: boolean;
}

export function createInitialGuidedDemoState(): GuidedDemoRuntimeState {
  return {
    activeStepIndex: 0,
    completedStepIds: [],
    connectivityStatus: "stable",
    offlineQueuedReports: 0,
    personHandoverCompleted: false,
    itemReleaseCompleted: false
  };
}

export function advanceGuidedDemoStep(
  state: GuidedDemoRuntimeState,
  stepId: GuidedDemoStepId
): GuidedDemoRuntimeState {
  const completedStepIds = state.completedStepIds.includes(stepId)
    ? state.completedStepIds
    : [...state.completedStepIds, stepId];
  const stepIndex = getGuidedDemoStepIndex(stepId);
  const nextIndex = Math.min(
    guidedDemoSteps.length - 1,
    Math.max(state.activeStepIndex, stepIndex + 1)
  );

  return {
    ...state,
    activeStepIndex: nextIndex,
    completedStepIds
  };
}

export function setGuidedDemoConnectivity(
  state: GuidedDemoRuntimeState,
  connectivityStatus: ConnectivityStatus
): GuidedDemoRuntimeState {
  return {
    ...state,
    connectivityStatus
  };
}

export function queueOfflineDemoReport(state: GuidedDemoRuntimeState): GuidedDemoRuntimeState {
  if (state.connectivityStatus !== "degraded") {
    return state;
  }

  return advanceGuidedDemoStep(
    {
      ...state,
      offlineQueuedReports: state.offlineQueuedReports + 1
    },
    "offline-queue-test"
  );
}

export function canFinalizePersonHandover(state: GuidedDemoRuntimeState): boolean {
  return state.connectivityStatus === "stable";
}

export function canFinalizeItemRelease(state: GuidedDemoRuntimeState): boolean {
  return state.connectivityStatus === "stable";
}

export function completePersonHandoverRuntime(
  state: GuidedDemoRuntimeState
): GuidedDemoRuntimeState {
  if (!canFinalizePersonHandover(state)) {
    throw new Error("Person handover cannot be finalised while connectivity is degraded.");
  }

  return advanceGuidedDemoStep(
    {
      ...state,
      personHandoverCompleted: true
    },
    "guardian-group-verification"
  );
}

export function completeItemReleaseRuntime(state: GuidedDemoRuntimeState): GuidedDemoRuntimeState {
  if (!canFinalizeItemRelease(state)) {
    throw new Error("Item release cannot be finalised while connectivity is degraded.");
  }

  return advanceGuidedDemoStep(
    {
      ...state,
      itemReleaseCompleted: true
    },
    "item-release-verified"
  );
}

export function getGuidedDemoVisibility(state: GuidedDemoRuntimeState): GuidedDemoVisibility {
  return {
    showMissingReport: isAtOrPastStep(state, "missing-child-reported"),
    showFoundReport: isAtOrPastStep(state, "found-child-reported"),
    showPersonMatchScore: isAtOrPastStep(state, "person-match-recommended"),
    showVerification: isAtOrPastStep(state, "guardian-group-verification"),
    showSafelyReunitedOutcome:
      state.personHandoverCompleted && isAtOrPastStep(state, "safely-reunited"),
    showItemMatchScore: isAtOrPastStep(state, "item-match-recommended"),
    showItemReleaseOutcome:
      state.itemReleaseCompleted && isAtOrPastStep(state, "offline-queue-test"),
    showOfflineQueue: isAtOrPastStep(state, "offline-queue-test"),
    showOfflineQueuedCount: isAtOrPastStep(state, "offline-queue-test"),
    showLeadershipOutcome: isAtOrPastStep(state, "leadership-outcome")
  };
}

export function getGuidedDemoStepIndex(stepId: GuidedDemoStepId): number {
  return guidedDemoSteps.findIndex((step) => step.id === stepId);
}

export function isAtOrPastStep(
  state: GuidedDemoRuntimeState,
  stepId: GuidedDemoStepId
): boolean {
  return state.activeStepIndex >= getGuidedDemoStepIndex(stepId);
}

export function resetGuidedDemoScenario(): GuidedDemoRuntimeState {
  return createInitialGuidedDemoState();
}
