import type { ConnectivityStatus } from "../domain/types";

export const guidedDemoSteps = [
  {
    id: "view-rp014",
    label: "View RP-014",
    route: "/reunite-points",
    summary: "Arena Rear Reunite Point is the reporting source."
  },
  {
    id: "report-missing-child",
    label: "Missing child",
    route: "/report/person",
    summary: "A parent or group leader files a looking-for-person report."
  },
  {
    id: "report-found-child",
    label: "Found child",
    route: "/report/person",
    summary: "A volunteer files a found-person report from RP-014."
  },
  {
    id: "review-person-match",
    label: "Person match",
    route: "/matches/person",
    summary: "Information Bureau reviews a rule-based recommendation."
  },
  {
    id: "complete-reunion",
    label: "Safe reunion",
    route: "/handover/person/person_match_demo",
    summary: "Verified handover closes the person case safely."
  },
  {
    id: "run-item-match",
    label: "Item match",
    route: "/matches/item",
    summary: "Lost and found bag reports are compared transparently."
  },
  {
    id: "verify-item-release",
    label: "Item release",
    route: "/release/item/item_match_demo",
    summary: "Proof of ownership is required before release."
  },
  {
    id: "queue-offline-report",
    label: "Offline queue",
    route: "/demo",
    summary: "Degraded connectivity queues staff reports for later sync."
  },
  {
    id: "view-pa-fallback",
    label: "PA fallback",
    route: "/announcements",
    summary: "PA remains a trusted fallback and never resolves a case by itself."
  },
  {
    id: "leadership-outcome",
    label: "Leadership view",
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
  const stepIndex = guidedDemoSteps.findIndex((step) => step.id === stepId);
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
    "queue-offline-report"
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
    "complete-reunion"
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
    "verify-item-release"
  );
}

export function resetGuidedDemoScenario(): GuidedDemoRuntimeState {
  return createInitialGuidedDemoState();
}
