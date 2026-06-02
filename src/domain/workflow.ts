import type {
  ItemCase,
  ItemCaseStatus,
  ItemReleaseRecord,
  PersonCase,
  PersonCaseStatus,
  PersonHandoverRecord
} from "./types";

export class DomainRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainRuleError";
  }
}

export interface PersonCaseTransitionContext {
  syncCompleted?: boolean;
  coordinatorReviewed?: boolean;
  matchSuggested?: boolean;
  matchConfirmed?: boolean;
  hasVerifiedHandover?: boolean;
}

export interface ItemCaseTransitionContext {
  syncCompleted?: boolean;
  coordinatorReviewed?: boolean;
  matchSuggested?: boolean;
  matchConfirmed?: boolean;
  hasProofOfOwnership?: boolean;
}

export function canTransitionPersonCaseStatus(
  from: PersonCaseStatus,
  to: PersonCaseStatus,
  context: PersonCaseTransitionContext = {}
): boolean {
  if (from === to) {
    return true;
  }

  if (from === "pending_sync" && to === "report_created") {
    return context.syncCompleted === true;
  }

  if (from === "report_created" && to === "under_review") {
    return context.coordinatorReviewed === true;
  }

  if (
    (from === "under_review" || from === "report_created") &&
    to === "possible_match_suggested"
  ) {
    return context.matchSuggested === true;
  }

  if (
    (from === "possible_match_suggested" || from === "under_review" || from === "report_created") &&
    to === "match_confirmed_by_information_bureau"
  ) {
    return context.matchConfirmed === true;
  }

  if (from === "match_confirmed_by_information_bureau" && to === "verified_handover_completed") {
    return context.hasVerifiedHandover === true;
  }

  if (from === "verified_handover_completed" && to === "safely_reunited") {
    return context.hasVerifiedHandover === true;
  }

  return false;
}

export function canTransitionItemCaseStatus(
  from: ItemCaseStatus,
  to: ItemCaseStatus,
  context: ItemCaseTransitionContext = {}
): boolean {
  if (from === to) {
    return true;
  }

  if (from === "pending_sync" && to === "report_created") {
    return context.syncCompleted === true;
  }

  if (from === "report_created" && to === "under_review") {
    return context.coordinatorReviewed === true;
  }

  if (
    (from === "under_review" || from === "report_created") &&
    to === "possible_match_suggested"
  ) {
    return context.matchSuggested === true;
  }

  if (
    (from === "possible_match_suggested" || from === "under_review" || from === "report_created") &&
    to === "match_confirmed_by_information_bureau"
  ) {
    return context.matchConfirmed === true;
  }

  if (from === "match_confirmed_by_information_bureau" && to === "proof_of_ownership_verified") {
    return context.hasProofOfOwnership === true;
  }

  if (from === "proof_of_ownership_verified" && to === "item_released") {
    return context.hasProofOfOwnership === true;
  }

  return false;
}

export function assertPersonCaseTransition(
  from: PersonCaseStatus,
  to: PersonCaseStatus,
  context: PersonCaseTransitionContext = {}
): void {
  if (!canTransitionPersonCaseStatus(from, to, context)) {
    throw new DomainRuleError(`Person case status cannot transition from ${from} to ${to}.`);
  }
}

export function assertItemCaseTransition(
  from: ItemCaseStatus,
  to: ItemCaseStatus,
  context: ItemCaseTransitionContext = {}
): void {
  if (!canTransitionItemCaseStatus(from, to, context)) {
    throw new DomainRuleError(`Item case status cannot transition from ${from} to ${to}.`);
  }
}

export function assertSafelyReunitedRequiresHandover(
  personCase: PersonCase,
  handoverRecord?: PersonHandoverRecord
): void {
  if (personCase.status === "safely_reunited" && !handoverRecord) {
    throw new DomainRuleError("A person case cannot be safely reunited without a verified handover record.");
  }
}

export function assertItemReleasedRequiresReleaseRecord(
  itemCase: ItemCase,
  releaseRecord?: ItemReleaseRecord
): void {
  if (itemCase.status === "item_released" && !releaseRecord) {
    throw new DomainRuleError("An item case cannot be released without proof-of-ownership verification.");
  }
}

export function isOpenPersonCaseStatus(status: PersonCaseStatus): boolean {
  return (
    status === "report_created" ||
    status === "under_review" ||
    status === "possible_match_suggested" ||
    status === "match_confirmed_by_information_bureau" ||
    status === "verified_handover_completed"
  );
}

export function isOpenItemCaseStatus(status: ItemCaseStatus): boolean {
  return (
    status === "report_created" ||
    status === "under_review" ||
    status === "possible_match_suggested" ||
    status === "match_confirmed_by_information_bureau" ||
    status === "proof_of_ownership_verified"
  );
}

export function isAwaitingSyncStatus(status: PersonCaseStatus | ItemCaseStatus): boolean {
  return status === "pending_sync";
}
