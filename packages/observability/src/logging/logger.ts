// packages/observability/src/logging/logger.ts
import pino from 'pino';
import { getCorrelationId } from '../tracing/traceContext';

// Creates a structured JSON logger that automatically injects the current correlation ID
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  mixin() {
    return { correlationId: getCorrelationId() };
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
