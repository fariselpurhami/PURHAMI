// apps/identity/src/application/commands/AuthenticateUserCommand.ts
import { prisma } from '@purhami/persistence';
import { PasswordService } from '../services/PasswordService';
import { TokenService } from '../services/TokenService';

export class AuthenticateUserCommand {
  static async execute(email: string, passwordRaw: string): Promise<{ accessToken: string }> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isValid = await PasswordService.verify(passwordRaw, user.passwordHash, user.salt);
    
    if (!isValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const accessToken = TokenService.signAccessToken({
      sub: user.id,
      role: user.role,
    });

    return { accessToken };
  }
}
