import type {
  AnnouncementEscalation,
  AuditLog,
  CaseMatch,
  Event,
  HelpPoint,
  HandoverRecord,
  OfflineSyncOperation,
  SafetyCard,
  SeparationCase
} from "../../domain/types";
import type {
  AnnouncementRepository,
  AuditRepository,
  EventRepository,
  HelpPointRepository,
  HandoverRepository,
  MatchRepository,
  OfflineQueueRepository,
  ReuniteRepositories,
  SafetyCardRepository,
  SeparationCaseRepository
} from "../interfaces";
import { createDemoDataSet, type DemoDataSet } from "./seed-data";

export class InMemoryEventRepository implements EventRepository {
  constructor(private readonly events: Event[]) {}

  async list(): Promise<Event[]> {
    return clone(this.events);
  }

  async getById(id: string): Promise<Event | null> {
    return clone(this.events.find((event) => event.id === id) ?? null);
  }

  async getActiveEvent(): Promise<Event | null> {
    return clone(this.events.find((event) => event.status === "active") ?? null);
  }
}

export class InMemoryHelpPointRepository implements HelpPointRepository {
  constructor(private readonly helpPoints: HelpPoint[]) {}

  async listByEvent(eventId: string): Promise<HelpPoint[]> {
    return clone(this.helpPoints.filter((helpPoint) => helpPoint.eventId === eventId));
  }

  async getById(id: string): Promise<HelpPoint | null> {
    return clone(this.helpPoints.find((helpPoint) => helpPoint.id === id) ?? null);
  }
}

export class InMemorySafetyCardRepository implements SafetyCardRepository {
  constructor(private readonly safetyCards: SafetyCard[]) {}

  async create(card: SafetyCard): Promise<SafetyCard> {
    this.safetyCards.push(clone(card));
    return clone(card);
  }

  async getById(id: string): Promise<SafetyCard | null> {
    return clone(this.safetyCards.find((card) => card.id === id) ?? null);
  }

  async findActiveByTokenHash(tokenHash: string): Promise<SafetyCard | null> {
    return clone(
      this.safetyCards.find((card) => card.tokenHash === tokenHash && card.status === "active") ?? null
    );
  }

  async listByEvent(eventId: string): Promise<SafetyCard[]> {
    return clone(this.safetyCards.filter((card) => card.eventId === eventId));
  }
}

export class InMemorySeparationCaseRepository implements SeparationCaseRepository {
  constructor(private readonly separationCases: SeparationCase[]) {}

  async create(separationCase: SeparationCase): Promise<SeparationCase> {
    this.separationCases.push(clone(separationCase));
    return clone(separationCase);
  }

  async update(separationCase: SeparationCase): Promise<SeparationCase> {
    const index = this.separationCases.findIndex((candidate) => candidate.id === separationCase.id);
    if (index === -1) {
      throw new Error(`Separation case ${separationCase.id} was not found.`);
    }

    this.separationCases[index] = clone(separationCase);
    return clone(separationCase);
  }

  async getById(id: string): Promise<SeparationCase | null> {
    return clone(this.separationCases.find((separationCase) => separationCase.id === id) ?? null);
  }

  async listByEvent(eventId: string): Promise<SeparationCase[]> {
    return clone(this.separationCases.filter((separationCase) => separationCase.eventId === eventId));
  }

  async listByEventAndType(
    eventId: string,
    caseType: SeparationCase["caseType"]
  ): Promise<SeparationCase[]> {
    return clone(
      this.separationCases.filter(
        (separationCase) => separationCase.eventId === eventId && separationCase.caseType === caseType
      )
    );
  }
}

export class InMemoryMatchRepository implements MatchRepository {
  constructor(private readonly matches: CaseMatch[]) {}

  async create(match: CaseMatch): Promise<CaseMatch> {
    this.matches.push(clone(match));
    return clone(match);
  }

  async update(match: CaseMatch): Promise<CaseMatch> {
    const index = this.matches.findIndex((candidate) => candidate.id === match.id);
    if (index === -1) {
      throw new Error(`Case match ${match.id} was not found.`);
    }

    this.matches[index] = clone(match);
    return clone(match);
  }

  async getById(id: string): Promise<CaseMatch | null> {
    return clone(this.matches.find((match) => match.id === id) ?? null);
  }

  async listByEvent(eventId: string): Promise<CaseMatch[]> {
    return clone(this.matches.filter((match) => match.eventId === eventId));
  }
}

export class InMemoryHandoverRepository implements HandoverRepository {
  constructor(private readonly handoverRecords: HandoverRecord[]) {}

  async create(record: HandoverRecord): Promise<HandoverRecord> {
    this.handoverRecords.push(clone(record));
    return clone(record);
  }

  async findByMatchId(matchId: string): Promise<HandoverRecord | null> {
    return clone(this.handoverRecords.find((record) => record.matchId === matchId) ?? null);
  }

  async listByEvent(eventId: string): Promise<HandoverRecord[]> {
    return clone(this.handoverRecords.filter((record) => record.eventId === eventId));
  }
}

export class InMemoryAnnouncementRepository implements AnnouncementRepository {
  constructor(private readonly announcementEscalations: AnnouncementEscalation[]) {}

  async create(escalation: AnnouncementEscalation): Promise<AnnouncementEscalation> {
    this.announcementEscalations.push(clone(escalation));
    return clone(escalation);
  }

  async getById(id: string): Promise<AnnouncementEscalation | null> {
    return clone(this.announcementEscalations.find((escalation) => escalation.id === id) ?? null);
  }

  async listByEvent(eventId: string): Promise<AnnouncementEscalation[]> {
    return clone(this.announcementEscalations.filter((escalation) => escalation.eventId === eventId));
  }
}

export class InMemoryAuditRepository implements AuditRepository {
  constructor(private readonly auditLogs: AuditLog[]) {}

  async append(log: AuditLog): Promise<AuditLog> {
    this.auditLogs.push(clone(log));
    return clone(log);
  }

  async listByEvent(eventId: string): Promise<AuditLog[]> {
    return clone(this.auditLogs.filter((log) => log.eventId === eventId));
  }
}

export class InMemoryOfflineQueueRepository implements OfflineQueueRepository {
  constructor(private readonly offlineSyncOperations: OfflineSyncOperation[]) {}

  async enqueue(operation: OfflineSyncOperation): Promise<OfflineSyncOperation> {
    this.offlineSyncOperations.push(clone(operation));
    return clone(operation);
  }

  async update(operation: OfflineSyncOperation): Promise<OfflineSyncOperation> {
    const index = this.offlineSyncOperations.findIndex(
      (candidate) => candidate.id === operation.id
    );
    if (index === -1) {
      throw new Error(`Offline operation ${operation.id} was not found.`);
    }

    this.offlineSyncOperations[index] = clone(operation);
    return clone(operation);
  }

  async listByEvent(eventId: string): Promise<OfflineSyncOperation[]> {
    return clone(
      this.offlineSyncOperations.filter((operation) => operation.payload.eventId === eventId)
    );
  }

  async listPendingByEvent(eventId: string): Promise<OfflineSyncOperation[]> {
    return clone(
      this.offlineSyncOperations.filter(
        (operation) => operation.payload.eventId === eventId && operation.status === "pending"
      )
    );
  }
}

export interface DemoRepositoryBundle extends ReuniteRepositories {
  data: DemoDataSet;
  staffProfiles: StaffProfileLookup;
}

export interface StaffProfileLookup {
  getById(id: string): Promise<import("../../domain/types").StaffProfile | null>;
  list(): Promise<import("../../domain/types").StaffProfile[]>;
}

class InMemoryStaffProfileLookup implements StaffProfileLookup {
  constructor(private readonly staffProfiles: import("../../domain/types").StaffProfile[]) {}

  async getById(id: string): Promise<import("../../domain/types").StaffProfile | null> {
    return clone(this.staffProfiles.find((staffProfile) => staffProfile.id === id) ?? null);
  }

  async list(): Promise<import("../../domain/types").StaffProfile[]> {
    return clone(this.staffProfiles);
  }
}

export function createDemoRepositories(data: DemoDataSet = createDemoDataSet()): DemoRepositoryBundle {
  return {
    data,
    events: new InMemoryEventRepository(data.events),
    helpPoints: new InMemoryHelpPointRepository(data.helpPoints),
    safetyCards: new InMemorySafetyCardRepository(data.safetyCards),
    cases: new InMemorySeparationCaseRepository(data.separationCases),
    matches: new InMemoryMatchRepository(data.caseMatches),
    handovers: new InMemoryHandoverRepository(data.handoverRecords),
    announcements: new InMemoryAnnouncementRepository(data.announcementEscalations),
    audits: new InMemoryAuditRepository(data.auditLogs),
    offlineQueue: new InMemoryOfflineQueueRepository(data.offlineSyncOperations),
    staffProfiles: new InMemoryStaffProfileLookup(data.staffProfiles)
  };
}

function clone<T>(value: T): T {
  return structuredClone(value);
}
