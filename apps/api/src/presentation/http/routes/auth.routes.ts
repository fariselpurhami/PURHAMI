// apps/api/src/presentation/http/routes/auth.routes.ts
import { FastifyInstance } from 'fastify';

// رابط خدمة الـ Identity الداخلي
const IDENTITY_SERVICE_URL = 'http://localhost:4002/internal/v1/auth';

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    try {
      const response = await fetch(`${IDENTITY_SERVICE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.body),
      });

      const data = await response.json();

      if (!response.ok) {
        return reply.status(response.status).send(data);
      }

      return reply.status(200).send(data);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Identity Service Unavailable' });
    }
  });
}
