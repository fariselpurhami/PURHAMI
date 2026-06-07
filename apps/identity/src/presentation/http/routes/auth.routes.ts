// apps/identity/src/presentation/http/routes/auth.routes.ts
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AuthenticateUserCommand } from '../../../application/commands/AuthenticateUserCommand';
import { TokenService } from '../../../application/services/TokenService';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const VerifySchema = z.object({
  token: z.string().min(1),
});

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const parsed = LoginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Malformed payload' });
    }

    const { accessToken } = await AuthenticateUserCommand.execute(
      parsed.data.email, 
      parsed.data.password
    );

    return reply.status(200).send({ success: true, accessToken });
  });

  app.post('/verify', async (request, reply) => {
    const parsed = VerifySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Missing token parameter' });
    }

    // Will throw 'INVALID_TOKEN' if verification fails, caught by global error handler
    const payload = TokenService.verifyAccessToken(parsed.data.token);
    
    return reply.status(200).send({ success: true, user: payload });
  });
}
