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
} from "../domain/types";

export interface EventRepository {
  list(): Promise<Event[]>;
  getById(id: string): Promise<Event | null>;
  getActiveEvent(): Promise<Event | null>;
}

export interface HelpPointRepository {
  listByEvent(eventId: string): Promise<HelpPoint[]>;
  getById(id: string): Promise<HelpPoint | null>;
}

export interface SafetyCardRepository {
  create(card: SafetyCard): Promise<SafetyCard>;
  getById(id: string): Promise<SafetyCard | null>;
  findActiveByTokenHash(tokenHash: string): Promise<SafetyCard | null>;
  listByEvent(eventId: string): Promise<SafetyCard[]>;
}

export interface SeparationCaseRepository {
  create(separationCase: SeparationCase): Promise<SeparationCase>;
  update(separationCase: SeparationCase): Promise<SeparationCase>;
  getById(id: string): Promise<SeparationCase | null>;
  listByEvent(eventId: string): Promise<SeparationCase[]>;
  listByEventAndType(eventId: string, caseType: SeparationCase["caseType"]): Promise<SeparationCase[]>;
}

export interface MatchRepository {
  create(match: CaseMatch): Promise<CaseMatch>;
  update(match: CaseMatch): Promise<CaseMatch>;
  getById(id: string): Promise<CaseMatch | null>;
  listByEvent(eventId: string): Promise<CaseMatch[]>;
}

export interface HandoverRepository {
  create(record: HandoverRecord): Promise<HandoverRecord>;
  findByMatchId(matchId: string): Promise<HandoverRecord | null>;
  listByEvent(eventId: string): Promise<HandoverRecord[]>;
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
  helpPoints: HelpPointRepository;
  safetyCards: SafetyCardRepository;
  cases: SeparationCaseRepository;
  matches: MatchRepository;
  handovers: HandoverRepository;
  announcements: AnnouncementRepository;
  audits: AuditRepository;
  offlineQueue: OfflineQueueRepository;
}

export interface TokenHasher {
  hashToken(token: string): string;
}

export interface TokenGenerator {
  generateToken(): string;
}

export interface IdGenerator {
  nextId(prefix: string): string;
}
