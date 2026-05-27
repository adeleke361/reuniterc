import type { StaffProfile, StaffRole } from "./types";

export type Permission =
  | "case:create_missing"
  | "case:create_found"
  | "case:view_sensitive"
  | "case:view_scoped"
  | "safecard:register"
  | "safecard:lookup"
  | "match:suggest"
  | "match:confirm"
  | "match:reject"
  | "handover:verify_complete"
  | "announcement:escalate"
  | "dashboard:view_operations"
  | "dashboard:view_leadership_aggregate"
  | "offline:queue_case"
  | "offline:sync";

const ROLE_PERMISSIONS: Record<StaffRole, ReadonlySet<Permission>> = {
  information_bureau_coordinator: new Set<Permission>([
    "case:create_missing",
    "case:create_found",
    "case:view_sensitive",
    "case:view_scoped",
    "safecard:register",
    "safecard:lookup",
    "match:suggest",
    "match:confirm",
    "match:reject",
    "handover:verify_complete",
    "announcement:escalate",
    "dashboard:view_operations",
    "offline:queue_case",
    "offline:sync"
  ]),
  helppoint_volunteer: new Set<Permission>([
    "case:create_missing",
    "case:create_found",
    "case:view_scoped",
    "safecard:lookup",
    "offline:queue_case",
    "offline:sync"
  ]),
  leadership_viewer: new Set<Permission>(["dashboard:view_leadership_aggregate"]),
  guardian_group_leader: new Set<Permission>(["safecard:register"])
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

export function assertPermission(actor: StaffProfile, permission: Permission): void {
  if (!actor.isActive || !hasPermission(actor.role, permission)) {
    throw new PermissionError(actor.role, permission);
  }
}

export function visibleCaseScopeForRole(role: StaffRole): "all_sensitive" | "help_point_scoped" | "aggregate_only" | "none" {
  if (role === "information_bureau_coordinator") {
    return "all_sensitive";
  }

  if (role === "helppoint_volunteer") {
    return "help_point_scoped";
  }

  if (role === "leadership_viewer") {
    return "aggregate_only";
  }

  return "none";
}
