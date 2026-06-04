// apps/web/src/server/env.ts
import { headers } from 'next/headers';

/**
 * Server-only utility to extract request-level telemetry context safely.
 * Returns architectural context without executing edge-unsafe Node primitives.
 */
export function getRequestTelemetryContext() {
  const headersList = headers();
  return {
    pathname: headersList.get('x-invoke-path') || '/',
    userAgent: headersList.get('user-agent') || 'unknown',
    requestId: headersList.get('x-request-id') || crypto.randomUUID(),
  };
}
