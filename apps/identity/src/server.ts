// apps/identity/src/server.ts
import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import { env } from './config/env';
import { logger } from '@purhami/observability';

import { setupTracePropagator } from './presentation/http/middleware/TracePropagator';
import { setupIdentityErrorHandler } from './presentation/http/middleware/IdentityErrorHandler';

import { healthRoutes } from './presentation/http/routes/health.routes';
import { authRoutes } from './presentation/http/routes/auth.routes';

async function bootstrap() {
  const app = Fastify({ disableRequestLogging: true });

  await app.register(helmet);

  setupTracePropagator(app);
  setupIdentityErrorHandler(app);

  app.register(healthRoutes, { prefix: '/health' });
  app.register(authRoutes, { prefix: '/internal/v1/auth' });

  try {
    await app.listen({ port: parseInt(env.PORT, 10), host: '0.0.0.0' });
    logger.info(`🛡️ Core Identity Service listening on port ${env.PORT}`);
    
    if (!env.DATABASE_URL) {
      logger.warn('DATABASE_URL is not set. Database operations will fail.');
    }
  } catch (err) {
    logger.fatal({ err }, 'Failed to start Identity Service');
    process.exit(1);
  }
}

bootstrap();
