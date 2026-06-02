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
import type {
  AnnouncementRepository,
  AuditRepository,
  EventRepository,
  ItemCaseRepository,
  ItemMatchRepository,
  ItemReleaseRepository,
  OfflineQueueRepository,
  PersonCaseRepository,
  PersonHandoverRepository,
  PersonMatchRepository,
  ReunitePointRepository,
  ReuniteRepositories
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

export class InMemoryReunitePointRepository implements ReunitePointRepository {
  constructor(private readonly reunitePoints: ReunitePoint[]) {}

  async listByEvent(eventId: string): Promise<ReunitePoint[]> {
    return clone(this.reunitePoints.filter((point) => point.eventId === eventId));
  }

  async getById(id: string): Promise<ReunitePoint | null> {
    return clone(this.reunitePoints.find((point) => point.id === id) ?? null);
  }

  async getByCode(eventId: string, code: string): Promise<ReunitePoint | null> {
    return clone(
      this.reunitePoints.find((point) => point.eventId === eventId && point.code === code) ?? null
    );
  }
}

export class InMemoryPersonCaseRepository implements PersonCaseRepository {
  constructor(private readonly personCases: PersonCase[]) {}

  async create(personCase: PersonCase): Promise<PersonCase> {
    this.personCases.push(clone(personCase));
    return clone(personCase);
  }

  async update(personCase: PersonCase): Promise<PersonCase> {
    const index = this.personCases.findIndex((candidate) => candidate.id === personCase.id);
    if (index === -1) {
      throw new Error(`Person case ${personCase.id} was not found.`);
    }

    this.personCases[index] = clone(personCase);
    return clone(personCase);
  }

  async getById(id: string): Promise<PersonCase | null> {
    return clone(this.personCases.find((personCase) => personCase.id === id) ?? null);
  }

  async listByEvent(eventId: string): Promise<PersonCase[]> {
    return clone(this.personCases.filter((personCase) => personCase.eventId === eventId));
  }

  async listByEventAndIntent(
    eventId: string,
    caseIntent: PersonCase["caseIntent"]
  ): Promise<PersonCase[]> {
    return clone(
      this.personCases.filter(
        (personCase) => personCase.eventId === eventId && personCase.caseIntent === caseIntent
      )
    );
  }
}

export class InMemoryItemCaseRepository implements ItemCaseRepository {
  constructor(private readonly itemCases: ItemCase[]) {}

  async create(itemCase: ItemCase): Promise<ItemCase> {
    this.itemCases.push(clone(itemCase));
    return clone(itemCase);
  }

  async update(itemCase: ItemCase): Promise<ItemCase> {
    const index = this.itemCases.findIndex((candidate) => candidate.id === itemCase.id);
    if (index === -1) {
      throw new Error(`Item case ${itemCase.id} was not found.`);
    }

    this.itemCases[index] = clone(itemCase);
    return clone(itemCase);
  }

  async getById(id: string): Promise<ItemCase | null> {
    return clone(this.itemCases.find((itemCase) => itemCase.id === id) ?? null);
  }

  async listByEvent(eventId: string): Promise<ItemCase[]> {
    return clone(this.itemCases.filter((itemCase) => itemCase.eventId === eventId));
  }

  async listByEventAndIntent(
    eventId: string,
    itemIntent: ItemCase["itemIntent"]
  ): Promise<ItemCase[]> {
    return clone(
      this.itemCases.filter((itemCase) => itemCase.eventId === eventId && itemCase.itemIntent === itemIntent)
    );
  }
}

export class InMemoryPersonMatchRepository implements PersonMatchRepository {
  constructor(private readonly matches: PersonMatchRecommendation[]) {}

  async create(match: PersonMatchRecommendation): Promise<PersonMatchRecommendation> {
    this.matches.push(clone(match));
    return clone(match);
  }

  async update(match: PersonMatchRecommendation): Promise<PersonMatchRecommendation> {
    const index = this.matches.findIndex((candidate) => candidate.id === match.id);
    if (index === -1) {
      throw new Error(`Person match ${match.id} was not found.`);
    }

    this.matches[index] = clone(match);
    return clone(match);
  }

  async getById(id: string): Promise<PersonMatchRecommendation | null> {
    return clone(this.matches.find((match) => match.id === id) ?? null);
  }

  async listByEvent(eventId: string): Promise<PersonMatchRecommendation[]> {
    return clone(this.matches.filter((match) => match.eventId === eventId));
  }
}

export class InMemoryItemMatchRepository implements ItemMatchRepository {
  constructor(private readonly matches: ItemMatchRecommendation[]) {}

  async create(match: ItemMatchRecommendation): Promise<ItemMatchRecommendation> {
    this.matches.push(clone(match));
    return clone(match);
  }

  async update(match: ItemMatchRecommendation): Promise<ItemMatchRecommendation> {
    const index = this.matches.findIndex((candidate) => candidate.id === match.id);
    if (index === -1) {
      throw new Error(`Item match ${match.id} was not found.`);
    }

    this.matches[index] = clone(match);
    return clone(match);
  }

  async getById(id: string): Promise<ItemMatchRecommendation | null> {
    return clone(this.matches.find((match) => match.id === id) ?? null);
  }

  async listByEvent(eventId: string): Promise<ItemMatchRecommendation[]> {
    return clone(this.matches.filter((match) => match.eventId === eventId));
  }
}

export class InMemoryPersonHandoverRepository implements PersonHandoverRepository {
  constructor(private readonly handoverRecords: PersonHandoverRecord[]) {}

  async create(record: PersonHandoverRecord): Promise<PersonHandoverRecord> {
    this.handoverRecords.push(clone(record));
    return clone(record);
  }

  async findByMatchId(matchId: string): Promise<PersonHandoverRecord | null> {
    return clone(this.handoverRecords.find((record) => record.matchId === matchId) ?? null);
  }

  async listByEvent(eventId: string): Promise<PersonHandoverRecord[]> {
    return clone(this.handoverRecords.filter((record) => record.eventId === eventId));
  }
}

export class InMemoryItemReleaseRepository implements ItemReleaseRepository {
  constructor(private readonly releaseRecords: ItemReleaseRecord[]) {}

  async create(record: ItemReleaseRecord): Promise<ItemReleaseRecord> {
    this.releaseRecords.push(clone(record));
    return clone(record);
  }

  async findByMatchId(matchId: string): Promise<ItemReleaseRecord | null> {
    return clone(this.releaseRecords.find((record) => record.matchId === matchId) ?? null);
  }

  async listByEvent(eventId: string): Promise<ItemReleaseRecord[]> {
    return clone(this.releaseRecords.filter((record) => record.eventId === eventId));
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
    const index = this.offlineSyncOperations.findIndex((candidate) => candidate.id === operation.id);
    if (index === -1) {
      throw new Error(`Offline operation ${operation.id} was not found.`);
    }

    this.offlineSyncOperations[index] = clone(operation);
    return clone(operation);
  }

  async listByEvent(eventId: string): Promise<OfflineSyncOperation[]> {
    return clone(this.offlineSyncOperations.filter((operation) => operation.payload.eventId === eventId));
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
  actorProfiles: ActorProfileLookup;
}

export interface ActorProfileLookup {
  getById(id: string): Promise<ActorProfile | null>;
  list(): Promise<ActorProfile[]>;
}

class InMemoryActorProfileLookup implements ActorProfileLookup {
  constructor(private readonly actorProfiles: ActorProfile[]) {}

  async getById(id: string): Promise<ActorProfile | null> {
    return clone(this.actorProfiles.find((actorProfile) => actorProfile.id === id) ?? null);
  }

  async list(): Promise<ActorProfile[]> {
    return clone(this.actorProfiles);
  }
}

export function createDemoRepositories(data: DemoDataSet = createDemoDataSet()): DemoRepositoryBundle {
  return {
    data,
    events: new InMemoryEventRepository(data.events),
    reunitePoints: new InMemoryReunitePointRepository(data.reunitePoints),
    personCases: new InMemoryPersonCaseRepository(data.personCases),
    itemCases: new InMemoryItemCaseRepository(data.itemCases),
    personMatches: new InMemoryPersonMatchRepository(data.personMatchRecommendations),
    itemMatches: new InMemoryItemMatchRepository(data.itemMatchRecommendations),
    personHandovers: new InMemoryPersonHandoverRepository(data.personHandoverRecords),
    itemReleases: new InMemoryItemReleaseRepository(data.itemReleaseRecords),
    announcements: new InMemoryAnnouncementRepository(data.announcementEscalations),
    audits: new InMemoryAuditRepository(data.auditLogs),
    offlineQueue: new InMemoryOfflineQueueRepository(data.offlineSyncOperations),
    actorProfiles: new InMemoryActorProfileLookup(data.actorProfiles)
  };
}

function clone<T>(value: T): T {
  return structuredClone(value);
}
