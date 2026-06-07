// packages/observability/tests/logger.spec.ts
import { describe, it, expect } from 'vitest';
import { runWithTrace, getCorrelationId } from '../src/tracing/traceContext';

describe('Trace Context Propagation', () => {
  it('generates a random correlation ID if none is provided in context', () => {
    const id = getCorrelationId();
    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
  });

  it('maintains the injected correlation ID within the async context', () => {
    const mockTraceId = 'req-123-abc';
    
    runWithTrace(mockTraceId, () => {
      const id = getCorrelationId();
      expect(id).toBe(mockTraceId);
    });
  });

  it('isolates context between parallel execution flows', async () => {
    const flowA = new Promise<string>((resolve) => {
      runWithTrace('flow-A-trace', () => {
        setTimeout(() => resolve(getCorrelationId()), 10);
      });
    });

    const flowB = new Promise<string>((resolve) => {
      runWithTrace('flow-B-trace', () => {
        setTimeout(() => resolve(getCorrelationId()), 5);
      });
    });

    const results = await Promise.all([flowA, flowB]);
    expect(results[0]).toBe('flow-A-trace');
    expect(results[1]).toBe('flow-B-trace');
  });
});
