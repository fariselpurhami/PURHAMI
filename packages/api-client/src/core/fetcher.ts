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
  const baseUrl = serverConfig.COMMERCE_API_URL || 'http://localhost:4000';

  if (!baseUrl) {
    return {
      success: false,
      error: { code: 'UNAVAILABLE', message: 'Commerce API URL is unconfigured.', correlationId }
    };
  }

  const url = `${baseUrl}${options.path}`;

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

    if (response.status === 404) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Resource not found', correlationId } };
    }

    if (!response.ok) {
      return { success: false, error: { code: 'UNAVAILABLE', message: `Upstream error: ${response.status}`, correlationId } };
    }

    const rawData = await response.json();
    
    console.log('\n================================================');
    console.log(`🛑 RAW PAYLOAD FROM GATEWAY FOR: ${options.path}`);
    console.log(JSON.stringify(rawData, null, 2));
    console.log('================================================\n');

    // -----------------------------------------------------------------
    // 🚀 THE FIX: Intelligent Envelope Unwrapping
    // استخراج البيانات من الغلاف إذا كانت موجودة لكي ينجح فحص الـ Zod
    // -----------------------------------------------------------------
    const payload = (rawData && typeof rawData === 'object' && 'data' in rawData) 
      ? rawData.data 
      : rawData;

    const parsed = options.schema.safeParse(payload);

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
