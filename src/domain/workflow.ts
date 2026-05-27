import type { CaseStatus, HandoverRecord, SeparationCase } from "./types";

export class DomainRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainRuleError";
  }
}

export interface CaseTransitionContext {
  coordinatorReviewed?: boolean;
  matchConfirmed?: boolean;
  hasVerifiedHandover?: boolean;
  syncCompleted?: boolean;
}

export function canTransitionCaseStatus(
  from: CaseStatus,
  to: CaseStatus,
  context: CaseTransitionContext = {}
): boolean {
  if (from === to) {
    return true;
  }

  if (from === "pending_sync" && to === "reported") {
    return context.syncCompleted === true;
  }

  if (from === "reported" && to === "under_review") {
    return context.coordinatorReviewed === true;
  }

  if (from === "under_review" && to === "match_pending_handover") {
    return context.matchConfirmed === true;
  }

  if (from === "match_pending_handover" && to === "safely_reunited") {
    return context.hasVerifiedHandover === true;
  }

  return false;
}

export function assertCaseTransition(
  from: CaseStatus,
  to: CaseStatus,
  context: CaseTransitionContext = {}
): void {
  if (!canTransitionCaseStatus(from, to, context)) {
    throw new DomainRuleError(`Case status cannot transition from ${from} to ${to}.`);
  }
}

export function assertSafelyReunitedRequiresHandover(
  separationCase: SeparationCase,
  handoverRecord?: HandoverRecord
): void {
  if (separationCase.status === "safely_reunited" && !handoverRecord) {
    throw new DomainRuleError("A case cannot be safely reunited without a verified handover record.");
  }
}

export function isOpenCaseStatus(status: CaseStatus): boolean {
  return status === "reported" || status === "under_review" || status === "match_pending_handover";
}

export function isAwaitingSyncStatus(status: CaseStatus): boolean {
  return status === "pending_sync";
}
