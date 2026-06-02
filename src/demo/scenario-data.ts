import { DEMO_EVENT_ID } from "../repositories/demo/seed-data";
import { createDemoSafetyKernel } from "../services";

export async function getDemoScenarioSnapshot() {
  const { repositories, services } = createDemoSafetyKernel();
  const coordinator = await requireActor(repositories, "staff_demo_coordinator");
  const volunteer = await requireActor(repositories, "staff_demo_volunteer_arena");
  const leadership = await requireActor(repositories, "staff_demo_leadership");

  const [event, reunitePoints] = await Promise.all([
    repositories.events.getById(DEMO_EVENT_ID),
    services.listReunitePoints(coordinator, DEMO_EVENT_ID)
  ]);

  if (!event) {
    throw new Error(`Demo event ${DEMO_EVENT_ID} was not found.`);
  }

  const [personRecommendations, itemRecommendations] = await Promise.all([
    services.suggestPersonMatches(coordinator, "person_looking_child_open"),
    services.suggestItemMatches(coordinator, "item_lost_bag_open")
  ]);

  const [personCases, itemCases, announcements, pendingOffline, dashboard, leadershipAnalytics, auditLogs] =
    await Promise.all([
      repositories.personCases.listByEvent(DEMO_EVENT_ID),
      repositories.itemCases.listByEvent(DEMO_EVENT_ID),
      repositories.announcements.listByEvent(DEMO_EVENT_ID),
      repositories.offlineQueue.listPendingByEvent(DEMO_EVENT_ID),
      services.getDashboardSummary(coordinator, DEMO_EVENT_ID, "stable"),
      services.getLeadershipAnalytics(leadership, DEMO_EVENT_ID, "stable"),
      repositories.audits.listByEvent(DEMO_EVENT_ID)
    ]);

  return {
    event,
    actors: {
      coordinator,
      volunteer,
      leadership
    },
    reunitePoints,
    personCases,
    itemCases,
    personRecommendations,
    itemRecommendations,
    announcements,
    pendingOffline,
    dashboard,
    leadershipAnalytics,
    auditLogs
  };
}

export type DemoScenarioSnapshot = Awaited<ReturnType<typeof getDemoScenarioSnapshot>>;

export async function getPreparedPersonHandoverScenario(matchId?: string) {
  const { repositories, services } = createDemoSafetyKernel();
  const coordinator = await requireActor(repositories, "staff_demo_coordinator");
  const recommendations = await services.suggestPersonMatches(coordinator, "person_looking_child_open");
  const selectedRecommendation =
    recommendations.find((match) => match.id === matchId || match.foundCaseId === "person_found_child_candidate") ??
    recommendations[0];

  if (!selectedRecommendation) {
    throw new Error("No person match recommendation is available for the demo.");
  }

  const confirmedMatch = await services.confirmPersonMatch(coordinator, {
    matchId: selectedRecommendation.id,
    connectivityStatus: "stable"
  });
  const [lookingCase, foundCase] = await Promise.all([
    repositories.personCases.getById(confirmedMatch.lookingCaseId),
    repositories.personCases.getById(confirmedMatch.foundCaseId)
  ]);

  if (!lookingCase || !foundCase) {
    throw new Error("Prepared person handover cases were not found.");
  }

  return {
    coordinator,
    match: confirmedMatch,
    lookingCase,
    foundCase
  };
}

export async function getPreparedItemReleaseScenario(matchId?: string) {
  const { repositories, services } = createDemoSafetyKernel();
  const coordinator = await requireActor(repositories, "staff_demo_coordinator");
  const recommendations = await services.suggestItemMatches(coordinator, "item_lost_bag_open");
  const selectedRecommendation =
    recommendations.find((match) => match.id === matchId || match.foundItemCaseId === "item_found_bag_candidate") ??
    recommendations[0];

  if (!selectedRecommendation) {
    throw new Error("No item match recommendation is available for the demo.");
  }

  const confirmedMatch = await services.confirmItemMatch(coordinator, {
    matchId: selectedRecommendation.id,
    connectivityStatus: "stable"
  });
  const [lostItemCase, foundItemCase] = await Promise.all([
    repositories.itemCases.getById(confirmedMatch.lostItemCaseId),
    repositories.itemCases.getById(confirmedMatch.foundItemCaseId)
  ]);

  if (!lostItemCase || !foundItemCase) {
    throw new Error("Prepared item release cases were not found.");
  }

  return {
    coordinator,
    match: confirmedMatch,
    lostItemCase,
    foundItemCase
  };
}

async function requireActor(
  repositories: ReturnType<typeof createDemoSafetyKernel>["repositories"],
  actorId: string
) {
  const actor = await repositories.actorProfiles.getById(actorId);
  if (!actor) {
    throw new Error(`Demo actor ${actorId} was not found.`);
  }

  return actor;
}
