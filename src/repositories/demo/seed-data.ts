import type {
  ActorProfile,
  AnnouncementEscalation,
  AuditLog,
  Event,
  ItemCase,
  ItemMatchRecommendation,
  ItemReleaseRecord,
  OfflineSyncOperation,
  PersonCase,
  PersonHandoverRecord,
  PersonMatchRecommendation,
  ReunitePoint
} from "../../domain/types";

export const DEMO_EVENT_ID = "evt_congress_night_2026";

export interface DemoDataSet {
  events: Event[];
  reunitePoints: ReunitePoint[];
  actorProfiles: ActorProfile[];
  personCases: PersonCase[];
  itemCases: ItemCase[];
  personMatchRecommendations: PersonMatchRecommendation[];
  itemMatchRecommendations: ItemMatchRecommendation[];
  personHandoverRecords: PersonHandoverRecord[];
  itemReleaseRecords: ItemReleaseRecord[];
  announcementEscalations: AnnouncementEscalation[];
  offlineSyncOperations: OfflineSyncOperation[];
  auditLogs: AuditLog[];
}

const now = "2026-08-10T21:00:00Z";
const fallbackInstruction =
  "If the QR form does not load, report this Point Code to an official volunteer, usher, security point or the Information Bureau.";
const tamperCheckInstruction =
  "Confirm the official Redemption City branding, visible short URL and intact poster serial before scanning.";

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
  reunitePoints: [
    {
      id: "point_information_bureau",
      eventId: DEMO_EVENT_ID,
      code: "RP-001",
      name: "Information Bureau Reunite Point",
      zone: "Information Bureau",
      proximityGroup: "information_bureau",
      locationLabel: "Behind the auditorium",
      posterType: "Help Desk Sign",
      officialShortUrl: "https://rc.example/rp001",
      fallbackInstruction,
      tamperCheckInstruction,
      isActive: true,
      createdAt: "2026-08-01T09:05:00Z",
      updatedAt: "2026-08-01T09:05:00Z"
    },
    {
      id: "point_arena_rear",
      eventId: DEMO_EVENT_ID,
      code: "RP-014",
      name: "Arena Rear Reunite Point",
      zone: "Arena Rear",
      proximityGroup: "arena_rear",
      locationLabel: "Arena Rear access walkway",
      posterType: "Placard",
      officialShortUrl: "https://rc.example/rp014",
      fallbackInstruction,
      tamperCheckInstruction,
      isActive: true,
      createdAt: "2026-08-01T09:06:00Z",
      updatedAt: "2026-08-01T09:06:00Z"
    },
    {
      id: "point_main_gate",
      eventId: DEMO_EVENT_ID,
      code: "RP-002",
      name: "Main Gate Reunite Point",
      zone: "Main Gate",
      proximityGroup: "main_gate",
      locationLabel: "Main Gate welcome corridor",
      posterType: "A4 Poster",
      officialShortUrl: "https://rc.example/rp002",
      fallbackInstruction,
      tamperCheckInstruction,
      isActive: true,
      createdAt: "2026-08-01T09:07:00Z",
      updatedAt: "2026-08-01T09:07:00Z"
    },
    {
      id: "point_c_gate",
      eventId: DEMO_EVENT_ID,
      code: "RP-007",
      name: "C Gate Reunite Point",
      zone: "C Gate",
      proximityGroup: "c_gate",
      locationLabel: "C Gate shuttle side",
      posterType: "Billboard",
      officialShortUrl: "https://rc.example/rp007",
      fallbackInstruction,
      tamperCheckInstruction,
      isActive: true,
      createdAt: "2026-08-01T09:08:00Z",
      updatedAt: "2026-08-01T09:08:00Z"
    }
  ],
  actorProfiles: [
    {
      id: "staff_demo_coordinator",
      authUserId: "auth_demo_coordinator",
      displayName: "Demo Information Bureau Coordinator",
      role: "information_bureau_coordinator",
      assignedPointId: "point_information_bureau",
      isActive: true,
      isDemo: true,
      createdAt: "2026-08-01T10:00:00Z"
    },
    {
      id: "staff_demo_volunteer_arena",
      authUserId: "auth_demo_volunteer_arena",
      displayName: "Demo Arena Rear Volunteer",
      role: "helppoint_volunteer",
      assignedPointId: "point_arena_rear",
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
      id: "public_demo_reporter",
      displayName: "Fictional Public Reporter",
      role: "public_reporter",
      isActive: true,
      isDemo: true,
      createdAt: "2026-08-01T10:15:00Z"
    }
  ],
  personCases: [
    {
      id: "person_looking_child_open",
      eventId: DEMO_EVENT_ID,
      reportSourcePointId: "point_arena_rear",
      caseIntent: "looking_for_person",
      status: "report_created",
      personCategory: "child",
      approximateAgeBand: "6-8",
      reportedAt: "2026-08-10T20:15:00Z",
      lastSeenOrFoundLocation: "Arena Rear access walkway",
      groupOrChurchReference: "Fictional Province Alpha Group",
      nonSensitiveDescriptionTags: ["blue-top", "small-backpack", "calm"],
      sensitiveNotes: "Fictional demo-only missing-child report for authorised staff.",
      urgency: "urgent",
      publicReporterReference: "Fictional parent or group leader reference",
      createdByStaffId: "staff_demo_volunteer_arena",
      createdAt: "2026-08-10T20:15:30Z",
      updatedAt: "2026-08-10T20:15:30Z"
    },
    {
      id: "person_found_child_candidate",
      eventId: DEMO_EVENT_ID,
      reportSourcePointId: "point_arena_rear",
      caseIntent: "found_person",
      status: "report_created",
      personCategory: "child",
      approximateAgeBand: "6-8",
      reportedAt: "2026-08-10T20:26:00Z",
      lastSeenOrFoundLocation: "Arena Rear volunteer desk",
      groupOrChurchReference: "Fictional Province Alpha Group",
      nonSensitiveDescriptionTags: ["blue-top", "small-backpack", "quiet"],
      sensitiveNotes: "Fictional demo-only found-child report for authorised staff.",
      urgency: "urgent",
      createdByStaffId: "staff_demo_volunteer_arena",
      createdAt: "2026-08-10T20:26:30Z",
      updatedAt: "2026-08-10T20:26:30Z"
    },
    {
      id: "person_looking_elder_pa",
      eventId: DEMO_EVENT_ID,
      reportSourcePointId: "point_main_gate",
      caseIntent: "looking_for_person",
      status: "under_review",
      personCategory: "elderly_attendee",
      approximateAgeBand: "60+",
      reportedAt: "2026-08-10T20:05:00Z",
      lastSeenOrFoundLocation: "Main Gate welcome corridor",
      groupOrChurchReference: "Fictional Senior Group Delta",
      nonSensitiveDescriptionTags: ["elderly-assistance", "white-cap"],
      sensitiveNotes: "Fictional elderly-attendee case prepared for PA fallback.",
      urgency: "elevated",
      createdByStaffId: "staff_demo_coordinator",
      createdAt: "2026-08-10T20:05:30Z",
      updatedAt: "2026-08-10T20:34:00Z"
    },
    {
      id: "person_looking_child_completed",
      eventId: DEMO_EVENT_ID,
      reportSourcePointId: "point_information_bureau",
      caseIntent: "looking_for_person",
      status: "safely_reunited",
      personCategory: "child",
      approximateAgeBand: "9-12",
      reportedAt: "2026-08-10T19:10:00Z",
      lastSeenOrFoundLocation: "Auditorium west aisle",
      groupOrChurchReference: "Fictional Choir Group",
      nonSensitiveDescriptionTags: ["green-shirt", "choir-group"],
      sensitiveNotes: "Fictional completed person case for dashboard metrics.",
      urgency: "standard",
      publicReporterReference: "Fictional handover reference",
      createdByStaffId: "staff_demo_coordinator",
      createdAt: "2026-08-10T19:10:15Z",
      updatedAt: "2026-08-10T19:36:00Z",
      resolvedAt: "2026-08-10T19:36:00Z"
    },
    {
      id: "person_found_child_completed",
      eventId: DEMO_EVENT_ID,
      reportSourcePointId: "point_information_bureau",
      caseIntent: "found_person",
      status: "safely_reunited",
      personCategory: "child",
      approximateAgeBand: "9-12",
      reportedAt: "2026-08-10T19:24:00Z",
      lastSeenOrFoundLocation: "Information Bureau desk",
      groupOrChurchReference: "Fictional Choir Group",
      nonSensitiveDescriptionTags: ["green-shirt", "choir-group"],
      sensitiveNotes: "Fictional completed found-person case for dashboard metrics.",
      urgency: "standard",
      createdByStaffId: "staff_demo_coordinator",
      createdAt: "2026-08-10T19:24:15Z",
      updatedAt: "2026-08-10T19:36:00Z",
      resolvedAt: "2026-08-10T19:36:00Z"
    },
    {
      id: "person_offline_pending_group_member",
      eventId: DEMO_EVENT_ID,
      reportSourcePointId: "point_c_gate",
      caseIntent: "looking_for_person",
      status: "pending_sync",
      personCategory: "group_member",
      approximateAgeBand: "18-59",
      reportedAt: "2026-08-10T20:45:00Z",
      lastSeenOrFoundLocation: "C Gate shuttle side",
      groupOrChurchReference: "Fictional Youth Team C",
      nonSensitiveDescriptionTags: ["group-badge", "demo-only"],
      sensitiveNotes: "Fictional offline pending person report.",
      urgency: "standard",
      createdByStaffId: "staff_demo_volunteer_arena",
      createdAt: "2026-08-10T20:46:00Z",
      updatedAt: "2026-08-10T20:46:00Z"
    }
  ],
  itemCases: [
    {
      id: "item_lost_bag_open",
      eventId: DEMO_EVENT_ID,
      reportSourcePointId: "point_arena_rear",
      itemIntent: "lost_item",
      status: "report_created",
      itemCategory: "bag",
      itemColorOrDescriptionTags: ["black-bag", "notebook-sticker", "medium"],
      reportedAt: "2026-08-10T20:10:00Z",
      lastSeenOrFoundLocation: "Arena Rear seating row",
      hiddenVerificationDetail: "Fictional yellow ribbon on inner zipper",
      claimantReference: "Fictional claimant reference A",
      urgency: "standard",
      publicReporterReference: "Fictional bag claimant",
      createdByStaffId: "staff_demo_volunteer_arena",
      createdAt: "2026-08-10T20:10:30Z",
      updatedAt: "2026-08-10T20:10:30Z"
    },
    {
      id: "item_found_bag_candidate",
      eventId: DEMO_EVENT_ID,
      reportSourcePointId: "point_arena_rear",
      itemIntent: "found_item",
      status: "report_created",
      itemCategory: "bag",
      itemColorOrDescriptionTags: ["black-bag", "notebook-sticker", "side-pocket"],
      reportedAt: "2026-08-10T20:42:00Z",
      lastSeenOrFoundLocation: "Arena Rear volunteer desk",
      hiddenVerificationDetail: "Fictional yellow ribbon on inner zipper",
      urgency: "standard",
      createdByStaffId: "staff_demo_volunteer_arena",
      createdAt: "2026-08-10T20:42:30Z",
      updatedAt: "2026-08-10T20:42:30Z"
    },
    {
      id: "item_lost_bible_completed",
      eventId: DEMO_EVENT_ID,
      reportSourcePointId: "point_information_bureau",
      itemIntent: "lost_item",
      status: "item_released",
      itemCategory: "bible_or_book",
      itemColorOrDescriptionTags: ["brown-cover", "bookmark"],
      reportedAt: "2026-08-10T18:50:00Z",
      lastSeenOrFoundLocation: "Information Bureau desk",
      hiddenVerificationDetail: "Fictional folded programme in back cover",
      claimantReference: "Fictional claimant reference B",
      urgency: "standard",
      createdByStaffId: "staff_demo_coordinator",
      createdAt: "2026-08-10T18:50:30Z",
      updatedAt: "2026-08-10T19:20:00Z",
      resolvedAt: "2026-08-10T19:20:00Z"
    },
    {
      id: "item_found_bible_completed",
      eventId: DEMO_EVENT_ID,
      reportSourcePointId: "point_information_bureau",
      itemIntent: "found_item",
      status: "item_released",
      itemCategory: "bible_or_book",
      itemColorOrDescriptionTags: ["brown-cover", "bookmark"],
      reportedAt: "2026-08-10T19:05:00Z",
      lastSeenOrFoundLocation: "Information Bureau desk",
      hiddenVerificationDetail: "Fictional folded programme in back cover",
      claimantReference: "Fictional claimant reference B",
      urgency: "standard",
      createdByStaffId: "staff_demo_coordinator",
      createdAt: "2026-08-10T19:05:30Z",
      updatedAt: "2026-08-10T19:20:00Z",
      resolvedAt: "2026-08-10T19:20:00Z"
    },
    {
      id: "item_offline_pending_phone",
      eventId: DEMO_EVENT_ID,
      reportSourcePointId: "point_c_gate",
      itemIntent: "found_item",
      status: "pending_sync",
      itemCategory: "phone",
      itemColorOrDescriptionTags: ["black-phone", "cracked-case"],
      reportedAt: "2026-08-10T20:50:00Z",
      lastSeenOrFoundLocation: "C Gate shuttle side",
      hiddenVerificationDetail: "Fictional lock-screen sticker detail",
      urgency: "standard",
      createdByStaffId: "staff_demo_volunteer_arena",
      createdAt: "2026-08-10T20:51:00Z",
      updatedAt: "2026-08-10T20:51:00Z"
    }
  ],
  personMatchRecommendations: [
    {
      id: "person_match_demo_completed",
      eventId: DEMO_EVENT_ID,
      lookingCaseId: "person_looking_child_completed",
      foundCaseId: "person_found_child_completed",
      score: 90,
      tier: "strong_match_recommendation",
      reasons: [
        {
          code: "reunite_point_proximity",
          label: "Reports came from the same or nearby Reunite Point proximity group.",
          points: 25
        },
        {
          code: "human_verification_required",
          label: "Human verification required before reunion.",
          points: 0
        }
      ],
      status: "confirmed",
      reviewedByStaffId: "staff_demo_coordinator",
      reviewedAt: "2026-08-10T19:32:00Z",
      createdAt: "2026-08-10T19:31:00Z"
    }
  ],
  itemMatchRecommendations: [
    {
      id: "item_match_demo_completed",
      eventId: DEMO_EVENT_ID,
      lostItemCaseId: "item_lost_bible_completed",
      foundItemCaseId: "item_found_bible_completed",
      score: 95,
      tier: "strong_match_recommendation",
      reasons: [
        {
          code: "item_category",
          label: "Item category matches.",
          points: 25
        },
        {
          code: "proof_of_ownership_required",
          label: "Proof of ownership required before release.",
          points: 0
        }
      ],
      status: "confirmed",
      reviewedByStaffId: "staff_demo_coordinator",
      reviewedAt: "2026-08-10T19:15:00Z",
      createdAt: "2026-08-10T19:14:00Z"
    }
  ],
  personHandoverRecords: [
    {
      id: "handover_demo_completed",
      eventId: DEMO_EVENT_ID,
      matchId: "person_match_demo_completed",
      lookingCaseId: "person_looking_child_completed",
      foundCaseId: "person_found_child_completed",
      verifiedReporterReference: "Fictional handover reference",
      verificationMethod: "Information Bureau interview and group reference check",
      verificationNotes: "Fictional verification notes for authorised staff only.",
      approvedByStaffId: "staff_demo_coordinator",
      handedOverAt: "2026-08-10T19:36:00Z",
      createdAt: "2026-08-10T19:36:00Z"
    }
  ],
  itemReleaseRecords: [
    {
      id: "release_demo_completed",
      eventId: DEMO_EVENT_ID,
      matchId: "item_match_demo_completed",
      lostItemCaseId: "item_lost_bible_completed",
      foundItemCaseId: "item_found_bible_completed",
      claimantReference: "Fictional claimant reference B",
      proofOfOwnershipMethod: "Hidden item detail and claimant description matched",
      proofNotes: "Fictional proof notes for authorised staff only.",
      releasedByStaffId: "staff_demo_coordinator",
      releasedAt: "2026-08-10T19:20:00Z",
      createdAt: "2026-08-10T19:20:00Z"
    }
  ],
  announcementEscalations: [
    {
      id: "announcement_demo_elder_pa",
      eventId: DEMO_EVENT_ID,
      caseKind: "person_case",
      caseId: "person_looking_elder_pa",
      status: "queued",
      announcementText: "Fictional privacy-conscious PA message for an elderly attendee needing assistance.",
      requestedByStaffId: "staff_demo_coordinator",
      requestedAt: "2026-08-10T20:35:00Z"
    }
  ],
  offlineSyncOperations: [
    {
      id: "offline_demo_pending_person",
      clientOperationId: "offline-client-demo-person-001",
      operationType: "create_looking_for_person_report",
      actorStaffId: "staff_demo_volunteer_arena",
      localEntityId: "person_offline_pending_group_member",
      payload: {
        caseIntent: "looking_for_person",
        eventId: DEMO_EVENT_ID,
        reportSourcePointId: "point_c_gate",
        personCategory: "group_member",
        approximateAgeBand: "18-59",
        reportedAt: "2026-08-10T20:45:00Z",
        lastSeenOrFoundLocation: "C Gate shuttle side",
        groupOrChurchReference: "Fictional Youth Team C",
        nonSensitiveDescriptionTags: ["group-badge", "demo-only"],
        sensitiveNotes: "Fictional offline pending person report.",
        urgency: "standard"
      },
      status: "pending",
      attemptCount: 0,
      createdAt: "2026-08-10T20:46:00Z"
    },
    {
      id: "offline_demo_pending_item",
      clientOperationId: "offline-client-demo-item-001",
      operationType: "create_found_item_report",
      actorStaffId: "staff_demo_volunteer_arena",
      localEntityId: "item_offline_pending_phone",
      payload: {
        itemIntent: "found_item",
        eventId: DEMO_EVENT_ID,
        reportSourcePointId: "point_c_gate",
        itemCategory: "phone",
        itemColorOrDescriptionTags: ["black-phone", "cracked-case"],
        reportedAt: "2026-08-10T20:50:00Z",
        lastSeenOrFoundLocation: "C Gate shuttle side",
        hiddenVerificationDetail: "Fictional lock-screen sticker detail",
        urgency: "standard"
      },
      status: "pending",
      attemptCount: 0,
      createdAt: "2026-08-10T20:51:00Z"
    }
  ],
  auditLogs: [
    {
      id: "audit_demo_person_created_001",
      eventId: DEMO_EVENT_ID,
      actorStaffId: "staff_demo_volunteer_arena",
      action: "person_case.created",
      entityType: "person_case",
      entityId: "person_looking_child_open",
      metadata: { demo: true, caseIntent: "looking_for_person" },
      createdAt: "2026-08-10T20:15:30Z"
    },
    {
      id: "audit_demo_item_created_001",
      eventId: DEMO_EVENT_ID,
      actorStaffId: "staff_demo_volunteer_arena",
      action: "item_case.created",
      entityType: "item_case",
      entityId: "item_lost_bag_open",
      metadata: { demo: true, itemIntent: "lost_item" },
      createdAt: "2026-08-10T20:10:30Z"
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
      actorStaffId: "staff_demo_volunteer_arena",
      action: "offline.queued",
      entityType: "offline_sync_operation",
      entityId: "offline_demo_pending_person",
      metadata: { demo: true, operationType: "create_looking_for_person_report" },
      createdAt: now
    }
  ]
};

export function createDemoDataSet(): DemoDataSet {
  return structuredClone(demoData);
}
