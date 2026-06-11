// apps/api/src/server.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { env } from './config/env';
import { logger } from '@purhami/observability';
import { authRoutes } from './presentation/http/routes/auth.routes';
import { setupCorrelationHook } from './presentation/http/middleware/CorrelationHook';
import { setupGlobalErrorHandler } from './presentation/http/middleware/GlobalErrorHandler';
import { cartRoutes } from './presentation/http/routes/cart.routes';
import { healthRoutes } from './presentation/http/routes/health.routes';
import { catalogRoutes } from './presentation/http/routes/catalog.routes';
import { navigationRoutes } from './presentation/http/routes/navigation.routes';

async function bootstrap() {
  const app = Fastify({
    disableRequestLogging: true, // Handled by our custom correlation hook
  });

  // Core Security Middleware
  await app.register(helmet);
  await app.register(cors, {
    origin: env.NODE_ENV === 'development' ? '*' : 'https://purhami.com', // Strict origin in prod
    credentials: true,
  });

  // Hooks & Error Handling
  setupCorrelationHook(app);
  setupGlobalErrorHandler(app);

  app.register(cartRoutes, { prefix: '/api/v1/carts' });

  // Route Registration
  app.register(healthRoutes, { prefix: '/health' });
  app.register(catalogRoutes, { prefix: '/api/v1/catalog' });
  app.register(navigationRoutes, { prefix: '/api/v1' });
  app.register(authRoutes, { prefix: '/api/v1/auth' });
  // Startup
  try {
    await app.listen({ port: parseInt(env.PORT, 10), host: '0.0.0.0' });
    logger.info(`🚀 PURHAMI API Gateway listening on port ${env.PORT}`);
  } catch (err) {
    logger.fatal({ err }, 'Failed to start API Gateway');
    process.exit(1);
  }
}

bootstrap();
