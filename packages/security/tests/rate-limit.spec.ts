// packages/security/tests/rate-limit.spec.ts
import { describe, it, expect } from 'vitest';
import { RATE_LIMIT_POLICIES } from '../src/rate-limiting/RateLimitPolicy';
import { extractBearerToken } from '../src/auth/TokenExtractor';

describe('Security Primitives', () => {
  describe('Rate Limiting Policies', () => {
    it('defines strict boundaries for public and sensitive routes', () => {
      expect(RATE_LIMIT_POLICIES.PUBLIC_API.maxRequests).toBeGreaterThan(RATE_LIMIT_POLICIES.SENSITIVE_API.maxRequests);
      expect(RATE_LIMIT_POLICIES.SENSITIVE_API.maxRequests).toBe(5);
    });
  });

  describe('Token Extractor', () => {
    it('correctly extracts a valid Bearer token', () => {
      const token = extractBearerToken('Bearer eyJhbGciOiJIUzI1NiIsInR...');
      expect(token).toBe('eyJhbGciOiJIUzI1NiIsInR...');
    });

    it('returns null for malformed or missing headers', () => {
      expect(extractBearerToken('Basic dXNlcm5hbWU6cGFzc3dvcmQ=')).toBeNull();
      expect(extractBearerToken('Bearer')).toBeNull();
      expect(extractBearerToken(undefined)).toBeNull();
    });
  });
});
