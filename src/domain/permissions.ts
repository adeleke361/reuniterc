import type { ActorProfile, StaffRole } from "./types";

export type Permission =
  | "reunite_point:list"
  | "person_report:create_looking"
  | "person_report:create_found"
  | "item_report:create_lost"
  | "item_report:create_found"
  | "case:view_sensitive"
  | "case:view_scoped"
  | "match:suggest"
  | "match:confirm"
  | "match:reject"
  | "person_handover:complete"
  | "item_release:complete"
  | "announcement:escalate"
  | "dashboard:view_operations"
  | "dashboard:view_leadership_aggregate"
  | "offline:queue_report"
  | "offline:sync";

const ROLE_PERMISSIONS: Record<StaffRole, ReadonlySet<Permission>> = {
  information_bureau_coordinator: new Set<Permission>([
    "reunite_point:list",
    "person_report:create_looking",
    "person_report:create_found",
    "item_report:create_lost",
    "item_report:create_found",
    "case:view_sensitive",
    "case:view_scoped",
    "match:suggest",
    "match:confirm",
    "match:reject",
    "person_handover:complete",
    "item_release:complete",
    "announcement:escalate",
    "dashboard:view_operations",
    "dashboard:view_leadership_aggregate",
    "offline:queue_report",
    "offline:sync"
  ]),
  helppoint_volunteer: new Set<Permission>([
    "reunite_point:list",
    "person_report:create_looking",
    "person_report:create_found",
    "item_report:create_lost",
    "item_report:create_found",
    "case:view_scoped",
    "offline:queue_report",
    "offline:sync"
  ]),
  leadership_viewer: new Set<Permission>([
    "reunite_point:list",
    "dashboard:view_leadership_aggregate"
  ]),
  public_reporter: new Set<Permission>([
    "person_report:create_looking",
    "person_report:create_found",
    "item_report:create_lost",
    "item_report:create_found"
  ])
};

export class PermissionError extends Error {
  constructor(role: StaffRole, permission: Permission) {
    super(`Role ${role} is not permitted to perform ${permission}.`);
    this.name = "PermissionError";
  }
}

export function hasPermission(role: StaffRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].has(permission);
}

export function assertPermission(actor: ActorProfile, permission: Permission): void {
  if (!actor.isActive || !hasPermission(actor.role, permission)) {
    throw new PermissionError(actor.role, permission);
  }
}

export function visibleCaseScopeForRole(role: StaffRole): "all_sensitive" | "point_scoped" | "aggregate_only" | "submit_only" {
  if (role === "information_bureau_coordinator") {
    return "all_sensitive";
  }

  if (role === "helppoint_volunteer") {
    return "point_scoped";
  }

  if (role === "leadership_viewer") {
    return "aggregate_only";
  }

  return "submit_only";
}
