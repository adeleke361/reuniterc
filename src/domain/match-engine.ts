import type {
  ItemCase,
  ItemMatchRecommendation,
  MatchReason,
  MatchRecommendationTier,
  PersonCase,
  PersonMatchRecommendation,
  ReunitePoint
} from "./types";

export interface MatchEngineContext {
  reunitePointsById: ReadonlyMap<string, ReunitePoint>;
}

export type PersonMatchSuggestion = Omit<
  PersonMatchRecommendation,
  "id" | "status" | "reviewedByStaffId" | "reviewedAt" | "createdAt"
>;
export type ItemMatchSuggestion = Omit<
  ItemMatchRecommendation,
  "id" | "status" | "reviewedByStaffId" | "reviewedAt" | "createdAt"
>;

const HUMAN_VERIFICATION_REASON: MatchReason = {
  code: "human_verification_required",
  label: "Human verification required before reunion.",
  points: 0
};

const PROOF_OF_OWNERSHIP_REASON: MatchReason = {
  code: "proof_of_ownership_required",
  label: "Proof of ownership required before release.",
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

export function scorePotentialPersonMatch(
  lookingCase: PersonCase,
  foundCase: PersonCase,
  context: MatchEngineContext
): PersonMatchSuggestion {
  const reasons: MatchReason[] = [];

  if (hasCompatibleReunitePoint(lookingCase.reportSourcePointId, foundCase.reportSourcePointId, context)) {
    reasons.push({
      code: "reunite_point_proximity",
      label: "Reports came from the same or nearby Reunite Point proximity group.",
      points: 25
    });
  }

  if (isWithinMinutes(lookingCase.reportedAt, foundCase.reportedAt, 30)) {
    reasons.push({
      code: "time_proximity",
      label: "Reports were recorded within 30 minutes.",
      points: 20
    });
  }

  if (lookingCase.personCategory === foundCase.personCategory) {
    reasons.push({
      code: "person_category",
      label: "Person category matches.",
      points: 15
    });
  }

  if (
    lookingCase.approximateAgeBand !== "unknown" &&
    lookingCase.approximateAgeBand === foundCase.approximateAgeBand
  ) {
    reasons.push({
      code: "age_band",
      label: "Approximate age band is compatible.",
      points: 15
    });
  }

  if (hasReferenceOverlap(lookingCase.groupOrChurchReference, foundCase.groupOrChurchReference)) {
    reasons.push({
      code: "group_reference",
      label: "Group, church or province reference overlaps.",
      points: 15
    });
  }

  const tagOverlap = countTagOverlap(
    lookingCase.nonSensitiveDescriptionTags,
    foundCase.nonSensitiveDescriptionTags
  );
  if (tagOverlap > 0) {
    reasons.push({
      code: "description_tags",
      label: `${tagOverlap} non-sensitive description tag${tagOverlap === 1 ? "" : "s"} overlap.`,
      points: Math.min(tagOverlap * 5, 10)
    });
  }

  reasons.push(HUMAN_VERIFICATION_REASON);

  const score = capScore(reasons);

  return {
    eventId: lookingCase.eventId,
    lookingCaseId: lookingCase.id,
    foundCaseId: foundCase.id,
    score,
    tier: getRecommendationTier(score),
    reasons
  };
}

export function suggestPersonMatchesForLookingCase(
  lookingCase: PersonCase,
  possibleFoundCases: PersonCase[],
  context: MatchEngineContext
): PersonMatchSuggestion[] {
  return possibleFoundCases
    .filter((candidate) => candidate.caseIntent === "found_person")
    .filter(
      (candidate) =>
        candidate.status !== "pending_sync" &&
        candidate.status !== "safely_reunited" &&
        candidate.status !== "closed_unresolved"
    )
    .map((candidate) => scorePotentialPersonMatch(lookingCase, candidate, context))
    .sort((left, right) => right.score - left.score);
}

export function scorePotentialItemMatch(
  lostItemCase: ItemCase,
  foundItemCase: ItemCase,
  context: MatchEngineContext
): ItemMatchSuggestion {
  const reasons: MatchReason[] = [];

  if (lostItemCase.itemCategory === foundItemCase.itemCategory) {
    reasons.push({
      code: "item_category",
      label: "Item category matches.",
      points: 25
    });
  }

  if (hasCompatibleReunitePoint(lostItemCase.reportSourcePointId, foundItemCase.reportSourcePointId, context)) {
    reasons.push({
      code: "reunite_point_proximity",
      label: "Reports came from the same or compatible Reunite Point zone.",
      points: 20
    });
  }

  if (isWithinMinutes(lostItemCase.reportedAt, foundItemCase.reportedAt, 120)) {
    reasons.push({
      code: "time_proximity",
      label: "Reports were recorded within a reasonable item recovery window.",
      points: 15
    });
  }

  const tagOverlap = countTagOverlap(
    lostItemCase.itemColorOrDescriptionTags,
    foundItemCase.itemColorOrDescriptionTags
  );
  if (tagOverlap > 0) {
    reasons.push({
      code: "item_description_tags",
      label: `${tagOverlap} colour or description tag${tagOverlap === 1 ? "" : "s"} overlap.`,
      points: Math.min(tagOverlap * 10, 20)
    });
  }

  if (
    hiddenDetailCompatible(
      lostItemCase.hiddenVerificationDetail,
      foundItemCase.hiddenVerificationDetail
    )
  ) {
    reasons.push({
      code: "hidden_verification_detail",
      label: "Staff-only hidden verification detail is compatible.",
      points: 20,
      staffOnly: true
    });
  }

  reasons.push(PROOF_OF_OWNERSHIP_REASON);

  const score = capScore(reasons);

  return {
    eventId: lostItemCase.eventId,
    lostItemCaseId: lostItemCase.id,
    foundItemCaseId: foundItemCase.id,
    score,
    tier: getRecommendationTier(score),
    reasons
  };
}

export function suggestItemMatchesForLostItemCase(
  lostItemCase: ItemCase,
  possibleFoundItemCases: ItemCase[],
  context: MatchEngineContext
): ItemMatchSuggestion[] {
  return possibleFoundItemCases
    .filter((candidate) => candidate.itemIntent === "found_item")
    .filter(
      (candidate) =>
        candidate.status !== "pending_sync" &&
        candidate.status !== "item_released" &&
        candidate.status !== "closed_unresolved"
    )
    .map((candidate) => scorePotentialItemMatch(lostItemCase, candidate, context))
    .sort((left, right) => right.score - left.score);
}

function hasCompatibleReunitePoint(
  leftPointId: string,
  rightPointId: string,
  context: MatchEngineContext
): boolean {
  const leftPoint = context.reunitePointsById.get(leftPointId);
  const rightPoint = context.reunitePointsById.get(rightPointId);

  if (!leftPoint || !rightPoint) {
    return false;
  }

  return (
    leftPoint.id === rightPoint.id ||
    leftPoint.proximityGroup === rightPoint.proximityGroup ||
    leftPoint.zone === rightPoint.zone
  );
}

function isWithinMinutes(left: string, right: string, minutes: number): boolean {
  const leftTime = new Date(left).getTime();
  const rightTime = new Date(right).getTime();

  if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
    return false;
  }

  return Math.abs(leftTime - rightTime) <= minutes * 60 * 1000;
}

function hasReferenceOverlap(left?: string, right?: string): boolean {
  if (!left || !right) {
    return false;
  }

  return normalize(left) === normalize(right);
}

function hiddenDetailCompatible(left?: string, right?: string): boolean {
  if (!left || !right) {
    return false;
  }

  const normalizedLeft = normalize(left);
  const normalizedRight = normalize(right);

  return (
    normalizedLeft === normalizedRight ||
    normalizedLeft.includes(normalizedRight) ||
    normalizedRight.includes(normalizedLeft)
  );
}

function countTagOverlap(left: string[], right: string[]): number {
  const rightTags = new Set(right.map(normalize));

  return left.reduce((count, tag) => {
    return rightTags.has(normalize(tag)) ? count + 1 : count;
  }, 0);
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function capScore(reasons: MatchReason[]): number {
  return Math.min(
    100,
    reasons.reduce((sum, reason) => sum + reason.points, 0)
  );
}
