import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const DEFAULT_COMMERCE_SERVICE_URL = 'http://localhost:4001/internal/v1/carts';
const COMMERCE_SERVICE_URL = process.env.COMMERCE_SERVICE_URL?.trim() || DEFAULT_COMMERCE_SERVICE_URL;
const UPSTREAM_TIMEOUT_MS = Number.parseInt(process.env.COMMERCE_SERVICE_TIMEOUT_MS ?? '5000', 10);

type CartParams = {
  cartId: string;
};

type CartItemParams = {
  cartId: string;
  itemId: string;
};

type AddCartItemBody = {
  productId: string;
  quantity: number;
};

type JsonRecord = Record<string, unknown>;

function isNonEmptyString(value: unknown, maxLength = 100): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
}

function isValidQuantity(value: unknown): value is number {
  return Number.isInteger(value) && value >= 1 && value <= 999;
}

function getRequestId(request: FastifyRequest): string | undefined {
  const requestIdHeader = request.headers['x-request-id'];

  if (Array.isArray(requestIdHeader)) {
    return requestIdHeader.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim();
  }

  return typeof requestIdHeader === 'string' && requestIdHeader.trim().length > 0
    ? requestIdHeader.trim()
    : undefined;
}

function buildUpstreamHeaders(requestId?: string, includeJsonContentType = false): Headers {
  const headers = new Headers();
  headers.set('accept', 'application/json');

  if (includeJsonContentType) {
    headers.set('content-type', 'application/json');
  }

  if (requestId) {
    headers.set('x-request-id', requestId);
  }

  return headers;
}

function sendValidationError(reply: FastifyReply, message: string) {
  return reply.status(400).send({
    error: 'Bad Request',
    message,
    statusCode: 400,
  });
}

function sendServiceUnavailable(reply: FastifyReply) {
  return reply.status(503).send({
    error: 'Service Unavailable',
    message: 'Commerce Service Unavailable',
    statusCode: 503,
  });
}

function validateCartParams(params: unknown): params is CartParams {
  if (typeof params !== 'object' || params === null) {
    return false;
  }

  const candidate = params as Partial<CartParams>;
  return isNonEmptyString(candidate.cartId);
}

function validateCartItemParams(params: unknown): params is CartItemParams {
  if (typeof params !== 'object' || params === null) {
    return false;
  }

  const candidate = params as Partial<CartItemParams>;
  return isNonEmptyString(candidate.cartId) && isNonEmptyString(candidate.itemId);
}

// 🔍 التعديل هنا: الدالة دي هتطبعلك المشكلة في الـ Terminal لو الريكويست اترفض
function validateAddCartItemBody(body: unknown): body is AddCartItemBody {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    console.error('❌ Validation Failed: Body is not a JSON object. Fastify received:', body);
    return false;
  }

  const candidate = body as Partial<AddCartItemBody>;

  if (typeof candidate.productId !== 'string' || candidate.productId.trim().length === 0) {
    console.error('❌ Validation Failed: productId is missing or not a string. Fastify received:', candidate);
    return false;
  }

  if (!isValidQuantity(candidate.quantity)) {
    console.error('❌ Validation Failed: quantity is invalid:', candidate.quantity);
    return false;
  }

  return true;
}

async function parseUpstreamBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
  const hasJsonBody = contentType.includes('application/json');
  const hasTextBody = contentType.startsWith('text/');

  if (hasJsonBody) {
    try {
      return (await response.json()) as unknown;
    } catch {
      return {
        error: 'Bad Gateway',
        message: 'Invalid JSON received from upstream service',
        statusCode: 502,
      };
    }
  }

  if (hasTextBody) {
    const text = await response.text();
    return text.length > 0 ? { message: text } : undefined;
  }

  const text = await response.text();
  return text.length > 0 ? { message: text } : undefined;
}

async function proxyUpstreamRequest(args: {
  url: string;
  method: 'GET' | 'POST' | 'DELETE';
  requestId?: string;
  body?: JsonRecord;
}): Promise<Response> {
  const controller = new AbortController();
  const timeout = Number.isFinite(UPSTREAM_TIMEOUT_MS) && UPSTREAM_TIMEOUT_MS > 0 ? UPSTREAM_TIMEOUT_MS : 5000;
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(args.url, {
      method: args.method,
      headers: buildUpstreamHeaders(args.requestId, args.body !== undefined),
      body: args.body !== undefined ? JSON.stringify(args.body) : undefined,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function forwardUpstreamResponse(response: Response, reply: FastifyReply) {
  if (response.status === 204) {
    return reply.status(204).send();
  }

  const payload = await parseUpstreamBody(response);
  return reply.status(response.status).send(payload);
}

export async function cartRoutes(app: FastifyInstance): Promise<void> {
  app.get('/:cartId', async (request, reply) => {
    if (!validateCartParams(request.params)) {
      return sendValidationError(reply, 'Invalid cartId');
    }

    const { cartId } = request.params;
    const requestId = getRequestId(request);

    try {
      const response = await proxyUpstreamRequest({
        url: `${COMMERCE_SERVICE_URL}/${encodeURIComponent(cartId)}`,
        method: 'GET',
        requestId,
      });

      return await forwardUpstreamResponse(response, reply);
    } catch (error) {
      app.log.error(
        {
          err: error,
          cartId,
          requestId,
          upstream: COMMERCE_SERVICE_URL,
          operation: 'getCart',
        },
        'Failed to fetch cart from commerce service',
      );
      return sendServiceUnavailable(reply);
    }
  });

  // 🔍 التعديل هنا: إضافة الـ Logs لمعرفة مسار الريكويست
  app.post('/:cartId/items', async (request, reply) => {
    console.log('\n🚀 --- NEW POST REQUEST RECEIVED IN GATEWAY ---');
    console.log('📦 Raw Body Received:', request.body);

    if (!validateCartParams(request.params)) {
      return sendValidationError(reply, 'Invalid cartId');
    }

    if (!validateAddCartItemBody(request.body)) {
      return sendValidationError(reply, 'Request body must include a valid productId and quantity');
    }

    const { cartId } = request.params;
    const requestId = getRequestId(request);
    const payload = {
      productId: (request.body as AddCartItemBody).productId.trim(),
      quantity: (request.body as AddCartItemBody).quantity,
    };

    console.log('✅ Validation Passed! Sending Payload to Commerce:', payload);

    try {
      const response = await proxyUpstreamRequest({
        url: `${COMMERCE_SERVICE_URL}/${encodeURIComponent(cartId)}/items`,
        method: 'POST',
        requestId,
        body: payload as JsonRecord,
      });

      return await forwardUpstreamResponse(response, reply);
    } catch (error) {
      app.log.error(
        {
          err: error,
          cartId,
          requestId,
          upstream: COMMERCE_SERVICE_URL,
          operation: 'addItemToCart',
        },
        'Failed to add item to cart through commerce service',
      );
      return sendServiceUnavailable(reply);
    }
  });

  app.delete('/:cartId/items/:itemId', async (request, reply) => {
    if (!validateCartItemParams(request.params)) {
      return sendValidationError(reply, 'Invalid cartId or itemId');
    }

    const { cartId, itemId } = request.params;
    const requestId = getRequestId(request);

    try {
      const response = await proxyUpstreamRequest({
        url: `${COMMERCE_SERVICE_URL}/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}`,
        method: 'DELETE',
        requestId,
      });

      return await forwardUpstreamResponse(response, reply);
    } catch (error) {
      app.log.error(
        {
          err: error,
          cartId,
          itemId,
          requestId,
          upstream: COMMERCE_SERVICE_URL,
          operation: 'removeItemFromCart',
        },
        'Failed to remove item from cart through commerce service',
      );
      return sendServiceUnavailable(reply);
    }
  });
}
