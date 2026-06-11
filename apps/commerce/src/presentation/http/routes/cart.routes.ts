import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AddItemToCartCommand } from '../../../application/commands/AddItemToCartCommand';

const prisma = new PrismaClient();

const cartParamsSchema = z.object({
  cartId: z.string().uuid(),
});

const cartItemParamsSchema = z.object({
  cartId: z.string().uuid(),
  itemId: z.string().uuid(),
});

const addItemBodySchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(999),
});

type CartParams = z.infer<typeof cartParamsSchema>;
type CartItemParams = z.infer<typeof cartItemParamsSchema>;
type AddItemBody = z.infer<typeof addItemBodySchema>;

type RouteErrorPayload = {
  error: string;
  message: string;
  statusCode: number;
};

type CartItemResponse = {
  id: string;
  variantId: string;
  quantity: number;
  title: string;
  sku: string;
  price: number;
  image: string;
  options: Record<string, unknown>;
};

function sendError(reply: FastifyReply, statusCode: number, error: string, message: string) {
  const payload: RouteErrorPayload = {
    error,
    message,
    statusCode,
  };

  return reply.status(statusCode).send(payload);
}

function parseParams<T>(schema: z.ZodSchema<T>, value: unknown): T {
  return schema.parse(value);
}

function parseBody<T>(schema: z.ZodSchema<T>, value: unknown): T {
  return schema.parse(value);
}

function toRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function toFiniteNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function toNonEmptyString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function isKnownApplicationError(error: unknown): error is Error & { code?: string } {
  return error instanceof Error;
}

function mapApplicationErrorToHttp(error: Error & { code?: string }): { statusCode: number; message: string } {
  switch (error.code ?? error.message) {
    case 'INVALID_INPUT':
      return { statusCode: 400, message: 'Invalid request payload' };
    case 'PRODUCT_NOT_FOUND':
      return { statusCode: 404, message: 'Product not found' };
    case 'VARIANT_NOT_FOUND':
      return { statusCode: 404, message: 'Variant not found' };
    case 'INSUFFICIENT_INVENTORY':
      return { statusCode: 409, message: 'Insufficient inventory' };
    case 'INVALID_VARIANT_PRICE':
      return { statusCode: 422, message: 'Variant pricing is invalid' };
    default:
      // 🌟 التعديل السحري: أي إيرور في الكود بعد كده هيرجع 500 عشان نعرف إنه Crash مش Bad Request
      return { statusCode: 500, message: error.message || 'Cart operation failed' };
  }
}

async function buildCartResponse(cartId: string): Promise<{ id: string; items: CartItemResponse[] }> {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    // 🌟 التعديل السحري: شيلنا الـ orderBy اللي كانت بتضرب Prisma Error صامت
    include: {
      items: true,
    },
  });

  if (!cart) {
    return {
      id: cartId,
      items: [],
    };
  }

  const variantIds = Array.from(new Set(cart.items.map((item) => item.variantId)));

  if (variantIds.length === 0) {
    return {
      id: cart.id,
      items: [],
    };
  }

  const variants = await prisma.variant.findMany({
    where: {
      id: {
        in: variantIds,
      },
    },
    include: {
      product: {
        include: {
          images: true, // 🌟 شيلنا الـ orderBy من هنا كمان للأمان
        },
      },
    },
  });

  const variantMap = new Map(variants.map((variant) => [variant.id, variant]));

  const items: CartItemResponse[] = cart.items.map((item) => {
    const variant = variantMap.get(item.variantId);
    const options = toRecord(variant?.options);

    return {
      id: item.id,
      variantId: item.variantId,
      quantity: item.quantity,
      title: toNonEmptyString(variant?.product?.title, toNonEmptyString(variant?.title, 'Unknown Product')),
      sku: toNonEmptyString(variant?.sku, 'UNKNOWN-SKU'),
      price: toFiniteNumber(variant?.priceAmount),
      image: toNonEmptyString(variant?.product?.images?.[0]?.url, ''),
      options,
    };
  });

  return {
    id: cart.id,
    items,
  };
}

export async function cartRoutes(app: FastifyInstance): Promise<void> {
  app.get('/:cartId', async (request: FastifyRequest<{ Params: CartParams }>, reply) => {
    try {
      const { cartId } = parseParams(cartParamsSchema, request.params);
      const response = await buildCartResponse(cartId);
      return reply.status(200).send(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendError(reply, 400, 'Bad Request', 'Invalid cart identifier');
      }

      app.log.error({ err: error }, 'Failed to fetch cart');
      return sendError(reply, 500, 'Internal Server Error', 'Failed to fetch cart');
    }
  });

  app.post('/:cartId/items', async (request: FastifyRequest<{ Params: CartParams; Body: AddItemBody }>, reply) => {
    try {
      const { cartId } = parseParams(cartParamsSchema, request.params);
      const { productId, quantity } = parseBody(addItemBodySchema, request.body);

      await AddItemToCartCommand.execute(cartId, productId, quantity);

      const response = await buildCartResponse(cartId);
      return reply.status(200).send(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendError(reply, 400, 'Bad Request', 'Invalid request payload');
      }

      if (isKnownApplicationError(error)) {
        const mappedError = mapApplicationErrorToHttp(error);
        if (mappedError.statusCode !== 500) {
           app.log.warn({ err: error, code: error.code ?? error.message }, 'Cart add operation rejected');
        } else {
           app.log.error({ err: error }, 'Cart add operation crashed silently');
        }
        return sendError(reply, mappedError.statusCode, 'Cart Operation Failed', mappedError.message);
      }

      app.log.error({ err: error }, 'Failed to add item to cart');
      return sendError(reply, 500, 'Internal Server Error', 'Failed to add item to cart');
    }
  });

  app.delete('/:cartId/items/:itemId', async (request: FastifyRequest<{ Params: CartItemParams }>, reply) => {
    try {
      const { cartId, itemId } = parseParams(cartItemParamsSchema, request.params);

      const deleted = await prisma.cartItem.deleteMany({
        where: {
          id: itemId,
          cartId,
        },
      });

      if (deleted.count === 0) {
        return sendError(reply, 404, 'Not Found', 'Cart item not found');
      }

      const response = await buildCartResponse(cartId);
      return reply.status(200).send(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendError(reply, 400, 'Bad Request', 'Invalid cart or item identifier');
      }

      app.log.error({ err: error }, 'Failed to delete cart item');
      return sendError(reply, 500, 'Internal Server Error', 'Failed to delete item from cart');
    }
  });
}
