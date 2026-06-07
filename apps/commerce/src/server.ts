// apps/commerce/src/server.ts
import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import { env } from './config/env';
import { logger } from '@purhami/observability';

import { setupTracePropagator } from './presentation/http/middleware/TracePropagator';
import { setupDomainErrorHandler } from './presentation/http/middleware/DomainErrorHandler';

import { cartRoutes } from './presentation/http/routes/cart.routes';
import { healthRoutes } from './presentation/http/routes/health.routes';
import { catalogRoutes } from './presentation/http/routes/catalog.routes';
import { navigationRoutes } from './presentation/http/routes/navigation.routes';

async function bootstrap() {
  const app = Fastify({ disableRequestLogging: true });

  await app.register(helmet);

  setupTracePropagator(app);
  setupDomainErrorHandler(app);

  app.register(healthRoutes, { prefix: '/health' });
  app.register(catalogRoutes, { prefix: '/internal/v1/catalog' });
  app.register(navigationRoutes, { prefix: '/internal/v1' });
  app.register(cartRoutes, { prefix: '/internal/v1/carts' });

  try {
    await app.listen({ port: parseInt(env.PORT, 10), host: '0.0.0.0' });
    logger.info(`🏛️ Core Commerce Service listening on port ${env.PORT}`);
    
    if (!env.ALLOW_LOCAL_FIXTURES) {
       logger.warn('Persistence check: Database driver not initialized. Service is operating in degraded read mode.');
    }
  } catch (err) {
    logger.fatal({ err }, 'Failed to start Commerce Service');
    process.exit(1);
  }
}

bootstrap();
