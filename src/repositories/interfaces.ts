import type {
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
} from "../domain/types";

export interface EventRepository {
  list(): Promise<Event[]>;
  getById(id: string): Promise<Event | null>;
  getActiveEvent(): Promise<Event | null>;
}

export interface ReunitePointRepository {
  listByEvent(eventId: string): Promise<ReunitePoint[]>;
  getById(id: string): Promise<ReunitePoint | null>;
  getByCode(eventId: string, code: string): Promise<ReunitePoint | null>;
}

export interface PersonCaseRepository {
  create(personCase: PersonCase): Promise<PersonCase>;
  update(personCase: PersonCase): Promise<PersonCase>;
  getById(id: string): Promise<PersonCase | null>;
  listByEvent(eventId: string): Promise<PersonCase[]>;
  listByEventAndIntent(eventId: string, caseIntent: PersonCase["caseIntent"]): Promise<PersonCase[]>;
}

export interface ItemCaseRepository {
  create(itemCase: ItemCase): Promise<ItemCase>;
  update(itemCase: ItemCase): Promise<ItemCase>;
  getById(id: string): Promise<ItemCase | null>;
  listByEvent(eventId: string): Promise<ItemCase[]>;
  listByEventAndIntent(eventId: string, itemIntent: ItemCase["itemIntent"]): Promise<ItemCase[]>;
}

export interface PersonMatchRepository {
  create(match: PersonMatchRecommendation): Promise<PersonMatchRecommendation>;
  update(match: PersonMatchRecommendation): Promise<PersonMatchRecommendation>;
  getById(id: string): Promise<PersonMatchRecommendation | null>;
  listByEvent(eventId: string): Promise<PersonMatchRecommendation[]>;
}

export interface ItemMatchRepository {
  create(match: ItemMatchRecommendation): Promise<ItemMatchRecommendation>;
  update(match: ItemMatchRecommendation): Promise<ItemMatchRecommendation>;
  getById(id: string): Promise<ItemMatchRecommendation | null>;
  listByEvent(eventId: string): Promise<ItemMatchRecommendation[]>;
}

export interface PersonHandoverRepository {
  create(record: PersonHandoverRecord): Promise<PersonHandoverRecord>;
  findByMatchId(matchId: string): Promise<PersonHandoverRecord | null>;
  listByEvent(eventId: string): Promise<PersonHandoverRecord[]>;
}

export interface ItemReleaseRepository {
  create(record: ItemReleaseRecord): Promise<ItemReleaseRecord>;
  findByMatchId(matchId: string): Promise<ItemReleaseRecord | null>;
  listByEvent(eventId: string): Promise<ItemReleaseRecord[]>;
}

export interface AnnouncementRepository {
  create(escalation: AnnouncementEscalation): Promise<AnnouncementEscalation>;
  getById(id: string): Promise<AnnouncementEscalation | null>;
  listByEvent(eventId: string): Promise<AnnouncementEscalation[]>;
}

export interface AuditRepository {
  append(log: AuditLog): Promise<AuditLog>;
  listByEvent(eventId: string): Promise<AuditLog[]>;
}

export interface OfflineQueueRepository {
  enqueue(operation: OfflineSyncOperation): Promise<OfflineSyncOperation>;
  update(operation: OfflineSyncOperation): Promise<OfflineSyncOperation>;
  listByEvent(eventId: string): Promise<OfflineSyncOperation[]>;
  listPendingByEvent(eventId: string): Promise<OfflineSyncOperation[]>;
}

export interface ReuniteRepositories {
  events: EventRepository;
  reunitePoints: ReunitePointRepository;
  personCases: PersonCaseRepository;
  itemCases: ItemCaseRepository;
  personMatches: PersonMatchRepository;
  itemMatches: ItemMatchRepository;
  personHandovers: PersonHandoverRepository;
  itemReleases: ItemReleaseRepository;
  announcements: AnnouncementRepository;
  audits: AuditRepository;
  offlineQueue: OfflineQueueRepository;
}

export interface IdGenerator {
  nextId(prefix: string): string;
}
