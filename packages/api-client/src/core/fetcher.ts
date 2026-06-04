// packages/api-client/src/core/fetcher.ts
import { z } from 'zod';
import { Result, CommerceError } from './error';
import { serverConfig } from '@purhami/config/server';

interface FetchOptions extends RequestInit {
  schema: z.ZodTypeAny;
  path: string;
}

export async function executeCommerceFetch<T>(options: FetchOptions): Promise<Result<T>> {
  const correlationId = crypto.randomUUID();
  const baseUrl = serverConfig.COMMERCE_API_URL;

  if (!baseUrl) {
    return {
      success: false,
      error: { code: 'UNAVAILABLE', message: 'Commerce API URL is unconfigured.', correlationId }
    };
  }

  const url = `${baseUrl}${options.path}`;
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-request-id': correlationId,
        ...(serverConfig.COMMERCE_API_SECRET && { 'Authorization': `Bearer ${serverConfig.COMMERCE_API_SECRET}` }),
        ...options.headers,
      },
    });

    const upstreamRequestLatencyMs = Date.now() - startTime;
    // Note: In a full environment, upstreamRequestLatencyMs would route to an OpenTelemetry span here.

    if (response.status === 404) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Resource not found', correlationId } };
    }

    if (!response.ok) {
      return { success: false, error: { code: 'UNAVAILABLE', message: `Upstream error: ${response.status}`, correlationId } };
    }

    const rawData = await response.json();
    const parsed = options.schema.safeParse(rawData);

    if (!parsed.success) {
      console.error(`[API-CLIENT] Contract Mismatch on ${options.path} (ID: ${correlationId})`, parsed.error.format());
      return { 
        success: false, 
        error: { code: 'CONTRACT_MISMATCH', message: 'Upstream payload failed schema validation', correlationId, details: parsed.error.format() } 
      };
    }

    return { success: true, data: parsed.data as T };

  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === 'TimeoutError';
    return {
      success: false,
      error: { 
        code: isTimeout ? 'TIMEOUT' : 'UNAVAILABLE', 
        message: error instanceof Error ? error.message : 'Unknown network failure', 
        correlationId 
      }
    };
  }
}
