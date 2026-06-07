// apps/identity/src/application/services/TokenService.ts
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export interface TokenPayload {
  sub: string; // User ID
  role: string;
}

export class TokenService {
  static signAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: '15m', // Short-lived access token
      algorithm: 'HS256',
      issuer: 'purhami:identity',
    });
  }

  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET, {
        algorithms: ['HS256'],
        issuer: 'purhami:identity',
      }) as TokenPayload;
    } catch (error) {
      throw new Error('INVALID_TOKEN');
    }
  }
}
