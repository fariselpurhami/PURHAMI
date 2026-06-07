// packages/observability/src/tracing/traceContext.ts
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

export interface TraceContext {
  correlationId: string;
}

export const traceStorage = new AsyncLocalStorage<TraceContext>();

export function getCorrelationId(): string {
  const store = traceStorage.getStore();
  return store?.correlationId ?? randomUUID();
}

export function runWithTrace<T>(correlationId: string, callback: () => T): T {
  return traceStorage.run({ correlationId }, callback);
}
