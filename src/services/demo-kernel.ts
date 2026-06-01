import { createReuniteKernelServices } from "./safety-kernel";
import { createDemoRepositories } from "../repositories/demo/in-memory-repositories";
import { demoHashToken } from "../repositories/demo/seed-data";
import type { IdGenerator, TokenGenerator, TokenHasher } from "../repositories";

export function createDemoSafetyKernel() {
  const repositories = createDemoRepositories();
  const idGenerator = createIncrementingIdGenerator();
  const tokenGenerator = createDemoTokenGenerator();
  const tokenHasher: TokenHasher = {
    hashToken: demoHashToken
  };
  const services = createReuniteKernelServices(repositories, {
    idGenerator,
    tokenGenerator,
    tokenHasher,
    now: () => "2026-08-10T21:05:00Z"
  });

  return {
    repositories,
    services
  };
}

export function createIncrementingIdGenerator(): IdGenerator {
  let sequence = 1000;

  return {
    nextId(prefix: string): string {
      sequence += 1;
      return `${prefix}_${sequence}`;
    }
  };
}

export function createDemoTokenGenerator(): TokenGenerator {
  let sequence = 7000;

  return {
    generateToken(): string {
      sequence += 1;
      return `DEMO-GENERATED-SAFE-TOKEN-${sequence}`;
    }
  };
}
