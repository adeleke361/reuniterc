import { createDemoRepositories } from "../repositories/demo/in-memory-repositories";
import type { IdGenerator } from "../repositories";
import { createReuniteKernelServices } from "./safety-kernel";

export function createDemoSafetyKernel() {
  const repositories = createDemoRepositories();
  const idGenerator = createIncrementingIdGenerator();
  const services = createReuniteKernelServices(repositories, {
    idGenerator,
    now: () => "2026-08-10T21:05:00Z"
  });

  return {
    repositories,
    services
  };
}

export const createDemoReuniteKernel = createDemoSafetyKernel;

export function createIncrementingIdGenerator(): IdGenerator {
  let sequence = 1000;

  return {
    nextId(prefix: string): string {
      sequence += 1;
      return `${prefix}_${sequence}`;
    }
  };
}
