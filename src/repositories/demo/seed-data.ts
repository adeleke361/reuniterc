import type {
  AnnouncementEscalation,
  AuditLog,
  CaseMatch,
  Event,
  Guardian,
  HelpPoint,
  HandoverRecord,
  OfflineSyncOperation,
  SafetyCard,
  SeparationCase,
  StaffProfile
} from "../../domain/types";

export const DEMO_EVENT_ID = "evt_congress_night_2026";

export const DEMO_SAFE_TOKENS = {
  compatibleChild: "DEMO-SAFE-CHILD-26-A",
  completedChild: "DEMO-SAFE-REUNITED-26-B"
} as const;

export function demoHashToken(token: string): string {
  return `demo-hash:${token}`;
}

export interface DemoDataSet {
  events: Event[];
  helpPoints: HelpPoint[];
  staffProfiles: StaffProfile[];
  guardians: Guardian[];
  safetyCards: SafetyCard[];
  separationCases: SeparationCase[];
  caseMatches: CaseMatch[];
  handoverRecords: HandoverRecord[];
  announcementEscalations: AnnouncementEscalation[];
  offlineSyncOperations: OfflineSyncOperation[];
  auditLogs: AuditLog[];
}

const now = "2026-08-10T21:00:00Z";

export const demoData: DemoDataSet = {
  events: [
    {
      id: DEMO_EVENT_ID,
      name: "Congress Night 2026",
      status: "active",
      startsAt: "2026-08-10T18:00:00Z",
      endsAt: "2026-08-11T04:00:00Z",
      venueLabel: "Redemption City Auditorium District",
      createdAt: "2026-08-01T09:00:00Z"
    }
  ],
  helpPoints: [
    {
      id: "hp_information_bureau",
      eventId: DEMO_EVENT_ID,
      name: "Information Bureau",
      zone: "Auditorium",
      proximityGroup: "auditorium",
      locationLabel: "Behind the auditorium",
      isActive: true,
      createdAt: "2026-08-01T09:05:00Z"
    },
    {
      id: "hp_b_arena_rear",
      eventId: DEMO_EVENT_ID,
      name: "HelpPoint B",
      zone: "Arena Rear",
      proximityGroup: "arena_rear",
      locationLabel: "HelpPoint B near Arena Rear",
      isActive: true,
      createdAt: "2026-08-01T09:06:00Z"
    },
    {
      id: "hp_main_gate",
      eventId: DEMO_EVENT_ID,
      name: "Main Gate HelpPoint",
      zone: "Main Gate",
      proximityGroup: "main_gate",
      locationLabel: "Main Gate welcome corridor",
      isActive: true,
      createdAt: "2026-08-01T09:07:00Z"
    }
  ],
  staffProfiles: [
    {
      id: "staff_demo_coordinator",
      authUserId: "auth_demo_coordinator",
      displayName: "Demo Information Bureau Coordinator",
      role: "information_bureau_coordinator",
      helpPointId: "hp_information_bureau",
      isActive: true,
      isDemo: true,
      createdAt: "2026-08-01T10:00:00Z"
    },
    {
      id: "staff_demo_volunteer_b",
      authUserId: "auth_demo_volunteer_b",
      displayName: "Demo HelpPoint B Volunteer",
      role: "helppoint_volunteer",
      helpPointId: "hp_b_arena_rear",
      isActive: true,
      isDemo: true,
      createdAt: "2026-08-01T10:05:00Z"
    },
    {
      id: "staff_demo_leadership",
      authUserId: "auth_demo_leadership",
      displayName: "Demo Leadership Viewer",
      role: "leadership_viewer",
      isActive: true,
      isDemo: true,
      createdAt: "2026-08-01T10:10:00Z"
    },
    {
      id: "staff_demo_guardian",
      authUserId: "auth_demo_guardian",
      displayName: "Demo Guardian Session",
      role: "guardian_group_leader",
      isActive: true,
      isDemo: true,
      createdAt: "2026-08-01T10:15:00Z"
    }
  ],
  guardians: [
    {
      id: "guardian_demo_parent_a",
      eventId: DEMO_EVENT_ID,
      displayLabel: "Fictional Guardian A",
      relationshipLabel: "Parent",
      contactHint: "Demo contact hint only",
      isDemo: true,
      createdAt: "2026-08-10T18:20:00Z"
    },
    {
      id: "guardian_demo_parent_b",
      eventId: DEMO_EVENT_ID,
      displayLabel: "Fictional Guardian B",
      relationshipLabel: "Parent",
      contactHint: "Demo contact hint only",
      isDemo: true,
      createdAt: "2026-08-10T18:25:00Z"
    }
  ],
  safetyCards: [
    {
      id: "card_demo_child_a",
      eventId: DEMO_EVENT_ID,
      guardianId: "guardian_demo_parent_a",
      tokenHash: demoHashToken(DEMO_SAFE_TOKENS.compatibleChild),
      tokenLast4: "26-A",
      label: "Demo Child SafeCard A",
      status: "active",
      createdAt: "2026-08-10T18:30:00Z"
    },
    {
      id: "card_demo_child_b",
      eventId: DEMO_EVENT_ID,
      guardianId: "guardian_demo_parent_b",
      tokenHash: demoHashToken(DEMO_SAFE_TOKENS.completedChild),
      tokenLast4: "26-B",
      label: "Demo Reunited Child SafeCard B",
      status: "active",
      createdAt: "2026-08-10T18:35:00Z"
    }
  ],
  separationCases: [
    {
      id: "case_missing_child_open",
      eventId: DEMO_EVENT_ID,
      caseType: "missing",
      status: "reported",
      personCategory: "child",
      approxAgeBand: "6-8",
      reportedAt: "2026-08-10T20:15:00Z",
      lastSeenOrFoundLocation: "Arena Rear access walkway",
      helpPointId: "hp_information_bureau",
      safetyCardId: "card_demo_child_a",
      descriptionTags: ["blue-top", "small-backpack", "calm"],
      sensitiveNotes: "Fictional demo-only missing-child report for authorised staff.",
      urgency: "urgent",
      createdByStaffId: "staff_demo_coordinator",
      createdAt: "2026-08-10T20:15:30Z",
      updatedAt: "2026-08-10T20:15:30Z"
    },
    {
      id: "case_found_child_candidate",
      eventId: DEMO_EVENT_ID,
      caseType: "found",
      status: "reported",
      personCategory: "child",
      approxAgeBand: "6-8",
      reportedAt: "2026-08-10T20:26:00Z",
      lastSeenOrFoundLocation: "HelpPoint B near Arena Rear",
      helpPointId: "hp_b_arena_rear",
      safetyCardId: "card_demo_child_a",
      descriptionTags: ["blue-top", "small-backpack", "quiet"],
      sensitiveNotes: "Fictional demo-only found-child report for authorised staff.",
      urgency: "urgent",
      createdByStaffId: "staff_demo_volunteer_b",
      createdAt: "2026-08-10T20:26:30Z",
      updatedAt: "2026-08-10T20:26:30Z"
    },
    {
      id: "case_missing_elder_pa",
      eventId: DEMO_EVENT_ID,
      caseType: "missing",
      status: "under_review",
      personCategory: "elderly_attendee",
      approxAgeBand: "60+",
      reportedAt: "2026-08-10T20:05:00Z",
      lastSeenOrFoundLocation: "Main Gate welcome corridor",
      helpPointId: "hp_main_gate",
      descriptionTags: ["elderly-assistance", "white-cap"],
      sensitiveNotes: "Fictional elderly-attendee case prepared for PA escalation.",
      urgency: "elevated",
      createdByStaffId: "staff_demo_volunteer_b",
      createdAt: "2026-08-10T20:05:30Z",
      updatedAt: "2026-08-10T20:34:00Z"
    },
    {
      id: "case_missing_child_completed",
      eventId: DEMO_EVENT_ID,
      caseType: "missing",
      status: "safely_reunited",
      personCategory: "child",
      approxAgeBand: "9-12",
      reportedAt: "2026-08-10T19:10:00Z",
      lastSeenOrFoundLocation: "Auditorium west aisle",
      helpPointId: "hp_information_bureau",
      safetyCardId: "card_demo_child_b",
      descriptionTags: ["green-shirt", "choir-group"],
      sensitiveNotes: "Fictional completed case for dashboard metrics.",
      urgency: "standard",
      createdByStaffId: "staff_demo_coordinator",
      createdAt: "2026-08-10T19:10:15Z",
      updatedAt: "2026-08-10T19:36:00Z",
      resolvedAt: "2026-08-10T19:36:00Z"
    },
    {
      id: "case_found_child_completed",
      eventId: DEMO_EVENT_ID,
      caseType: "found",
      status: "safely_reunited",
      personCategory: "child",
      approxAgeBand: "9-12",
      reportedAt: "2026-08-10T19:24:00Z",
      lastSeenOrFoundLocation: "Information Bureau desk",
      helpPointId: "hp_information_bureau",
      safetyCardId: "card_demo_child_b",
      descriptionTags: ["green-shirt", "choir-group"],
      sensitiveNotes: "Fictional completed found case for dashboard metrics.",
      urgency: "standard",
      createdByStaffId: "staff_demo_coordinator",
      createdAt: "2026-08-10T19:24:15Z",
      updatedAt: "2026-08-10T19:36:00Z",
      resolvedAt: "2026-08-10T19:36:00Z"
    },
    {
      id: "case_offline_pending_group_member",
      eventId: DEMO_EVENT_ID,
      caseType: "missing",
      status: "pending_sync",
      personCategory: "group_member",
      approxAgeBand: "18-59",
      reportedAt: "2026-08-10T20:45:00Z",
      lastSeenOrFoundLocation: "Arena Rear seating bay",
      helpPointId: "hp_b_arena_rear",
      descriptionTags: ["group-badge", "demo-only"],
      sensitiveNotes: "Fictional offline pending report.",
      urgency: "standard",
      createdByStaffId: "staff_demo_volunteer_b",
      createdAt: "2026-08-10T20:46:00Z",
      updatedAt: "2026-08-10T20:46:00Z"
    }
  ],
  caseMatches: [
    {
      id: "match_demo_completed",
      eventId: DEMO_EVENT_ID,
      missingCaseId: "case_missing_child_completed",
      foundCaseId: "case_found_child_completed",
      score: 95,
      tier: "strong_match_recommendation",
      reasons: [
        {
          code: "exact_safecard_token",
          label: "Exact SafeCard token/hash-compatible match.",
          points: 60
        },
        {
          code: "human_verification_required",
          label: "Human coordinator verification is required before any handover.",
          points: 0
        }
      ],
      status: "confirmed",
      reviewedByStaffId: "staff_demo_coordinator",
      reviewedAt: "2026-08-10T19:32:00Z",
      createdAt: "2026-08-10T19:31:00Z"
    }
  ],
  handoverRecords: [
    {
      id: "handover_demo_completed",
      eventId: DEMO_EVENT_ID,
      matchId: "match_demo_completed",
      missingCaseId: "case_missing_child_completed",
      foundCaseId: "case_found_child_completed",
      guardianId: "guardian_demo_parent_b",
      verificationMethod: "SafeCard token plus coordinator interview",
      verificationNotes: "Fictional verification notes for authorised staff only.",
      approvedByStaffId: "staff_demo_coordinator",
      handedOverAt: "2026-08-10T19:36:00Z",
      createdAt: "2026-08-10T19:36:00Z"
    }
  ],
  announcementEscalations: [
    {
      id: "announcement_demo_elder_pa",
      eventId: DEMO_EVENT_ID,
      caseId: "case_missing_elder_pa",
      status: "queued",
      announcementText: "Fictional privacy-conscious PA message for an elderly attendee needing assistance.",
      requestedByStaffId: "staff_demo_coordinator",
      requestedAt: "2026-08-10T20:35:00Z"
    }
  ],
  offlineSyncOperations: [
    {
      id: "offline_demo_pending_missing",
      clientOperationId: "offline-client-demo-001",
      operationType: "create_missing_case",
      actorStaffId: "staff_demo_volunteer_b",
      localEntityId: "case_offline_pending_group_member",
      payload: {
        caseType: "missing",
        eventId: DEMO_EVENT_ID,
        helpPointId: "hp_b_arena_rear",
        personCategory: "group_member",
        approxAgeBand: "18-59",
        reportedAt: "2026-08-10T20:45:00Z",
        lastSeenLocation: "Arena Rear seating bay",
        descriptionTags: ["group-badge", "demo-only"],
        sensitiveNotes: "Fictional offline pending report.",
        urgency: "standard"
      },
      status: "pending",
      attemptCount: 0,
      createdAt: "2026-08-10T20:46:00Z"
    }
  ],
  auditLogs: [
    {
      id: "audit_demo_case_created_001",
      eventId: DEMO_EVENT_ID,
      actorStaffId: "staff_demo_coordinator",
      action: "case.created",
      entityType: "separation_case",
      entityId: "case_missing_child_open",
      metadata: { demo: true, caseType: "missing" },
      createdAt: "2026-08-10T20:15:30Z"
    },
    {
      id: "audit_demo_case_created_002",
      eventId: DEMO_EVENT_ID,
      actorStaffId: "staff_demo_volunteer_b",
      action: "case.created",
      entityType: "separation_case",
      entityId: "case_found_child_candidate",
      metadata: { demo: true, caseType: "found" },
      createdAt: "2026-08-10T20:26:30Z"
    },
    {
      id: "audit_demo_announcement_001",
      eventId: DEMO_EVENT_ID,
      actorStaffId: "staff_demo_coordinator",
      action: "announcement.escalated",
      entityType: "announcement_escalation",
      entityId: "announcement_demo_elder_pa",
      metadata: { demo: true },
      createdAt: "2026-08-10T20:35:00Z"
    },
    {
      id: "audit_demo_offline_001",
      eventId: DEMO_EVENT_ID,
      actorStaffId: "staff_demo_volunteer_b",
      action: "offline.queued",
      entityType: "offline_sync_operation",
      entityId: "offline_demo_pending_missing",
      metadata: { demo: true, operationType: "create_missing_case" },
      createdAt: now
    }
  ]
};

export function createDemoDataSet(): DemoDataSet {
  return structuredClone(demoData);
}
