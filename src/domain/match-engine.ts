import type {
  CaseMatch,
  HelpPoint,
  MatchReason,
  MatchRecommendationTier,
  SeparationCase
} from "./types";

export interface MatchEngineContext {
  helpPointsById: ReadonlyMap<string, HelpPoint>;
}

export type MatchSuggestion = Omit<CaseMatch, "id" | "status" | "reviewedByStaffId" | "reviewedAt" | "createdAt">;

const HUMAN_VERIFICATION_REASON: MatchReason = {
  code: "human_verification_required",
  label: "Human coordinator verification is required before any handover.",
  points: 0
};

export function getRecommendationTier(score: number): MatchRecommendationTier {
  if (score >= 80) {
    return "strong_match_recommendation";
  }

  if (score >= 55) {
    return "review_recommended";
  }

  return "insufficient_confidence";
}

export function scorePotentialMatch(
  missingCase: SeparationCase,
  foundCase: SeparationCase,
  context: MatchEngineContext
): MatchSuggestion {
  const reasons: MatchReason[] = [];

  if (missingCase.safetyCardId && missingCase.safetyCardId === foundCase.safetyCardId) {
    reasons.push({
      code: "exact_safecard_token",
      label: "Exact SafeCard token/hash-compatible match.",
      points: 60
    });
  }

  if (missingCase.personCategory === foundCase.personCategory) {
    reasons.push({
      code: "person_category",
      label: "Person category matches.",
      points: 10
    });
  }

  if (missingCase.approxAgeBand !== "unknown" && missingCase.approxAgeBand === foundCase.approxAgeBand) {
    reasons.push({
      code: "age_band",
      label: "Approximate age band is compatible.",
      points: 10
    });
  }

  if (hasCompatibleLocation(missingCase, foundCase, context.helpPointsById)) {
    reasons.push({
      code: "location_proximity",
      label: "Locations are in a compatible zone or proximity group.",
      points: 8
    });
  }

  if (isWithinMinutes(missingCase.reportedAt, foundCase.reportedAt, 30)) {
    reasons.push({
      code: "time_proximity",
      label: "Reports were recorded within 30 minutes.",
      points: 7
    });
  }

  const tagOverlap = countTagOverlap(missingCase.descriptionTags, foundCase.descriptionTags);
  if (tagOverlap > 0) {
    reasons.push({
      code: "description_tags",
      label: `${tagOverlap} non-sensitive description tag${tagOverlap === 1 ? "" : "s"} overlap.`,
      points: Math.min(tagOverlap, 5)
    });
  }

  reasons.push(HUMAN_VERIFICATION_REASON);

  const score = Math.min(
    100,
    reasons.reduce((sum, reason) => sum + reason.points, 0)
  );

  return {
    eventId: missingCase.eventId,
    missingCaseId: missingCase.id,
    foundCaseId: foundCase.id,
    score,
    tier: getRecommendationTier(score),
    reasons
  };
}

export function suggestMatchesForMissingCase(
  missingCase: SeparationCase,
  possibleFoundCases: SeparationCase[],
  context: MatchEngineContext
): MatchSuggestion[] {
  return possibleFoundCases
    .filter((candidate) => candidate.caseType === "found")
    .filter((candidate) => candidate.status !== "safely_reunited")
    .map((candidate) => scorePotentialMatch(missingCase, candidate, context))
    .sort((left, right) => right.score - left.score);
}

function hasCompatibleLocation(
  missingCase: SeparationCase,
  foundCase: SeparationCase,
  helpPointsById: ReadonlyMap<string, HelpPoint>
): boolean {
  const missingHelpPoint = helpPointsById.get(missingCase.helpPointId);
  const foundHelpPoint = helpPointsById.get(foundCase.helpPointId);

  if (missingHelpPoint && foundHelpPoint) {
    return (
      missingHelpPoint.proximityGroup === foundHelpPoint.proximityGroup ||
      missingHelpPoint.zone === foundHelpPoint.zone
    );
  }

  return missingCase.lastSeenOrFoundLocation === foundCase.lastSeenOrFoundLocation;
}

function isWithinMinutes(left: string, right: string, minutes: number): boolean {
  const leftTime = new Date(left).getTime();
  const rightTime = new Date(right).getTime();

  if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
    return false;
  }

  return Math.abs(leftTime - rightTime) <= minutes * 60 * 1000;
}

function countTagOverlap(left: string[], right: string[]): number {
  const rightTags = new Set(right.map((tag) => tag.toLowerCase()));

  return left.reduce((count, tag) => {
    return rightTags.has(tag.toLowerCase()) ? count + 1 : count;
  }, 0);
}
