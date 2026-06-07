// apps/identity/src/application/services/PasswordService.ts
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

export class PasswordService {
  static async hash(password: string): Promise<{ hash: string; salt: string }> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return { hash: derivedKey.toString('hex'), salt };
  }

  static async verify(password: string, hash: string, salt: string): Promise<boolean> {
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    const targetKey = Buffer.from(hash, 'hex');
    
    // Constant-time comparison to prevent timing attacks
    return timingSafeEqual(derivedKey, targetKey);
  }
}
