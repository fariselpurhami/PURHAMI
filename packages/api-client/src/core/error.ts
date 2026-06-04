// packages/api-client/src/core/error.ts
export type ErrorCode = 'NOT_FOUND' | 'UNAVAILABLE' | 'CONTRACT_MISMATCH' | 'TIMEOUT';

export interface CommerceError {
  code: ErrorCode;
  message: string;
  correlationId: string;
  details?: unknown;
}

export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: CommerceError };
