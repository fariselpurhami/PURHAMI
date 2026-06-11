import { randomUUID } from 'node:crypto';
import { RepositoryFactory } from '../../infrastructure/persistence/RepositoryFactory';
import { Cart, CartItem } from '@purhami/domain';
import { logger } from '@purhami/observability';

type VariantLike = {
  id?: unknown;
  getProps?: () => Record<string, unknown>;
  inventory?: {
    getProps?: () => Record<string, unknown>;
    quantityAvailable?: unknown;
  } | null;
  price?: {
    getProps?: () => Record<string, unknown>;
    amount?: unknown;
  } | null;
  inventoryQuantity?: unknown;
  priceAmount?: unknown;
  sku?: unknown;
  title?: unknown;
};

type ProductLike = {
  id?: unknown;
  variants?: unknown;
  getProps?: () => Record<string, unknown>;
};

type CartRepository = {
  findById(cartId: string): Promise<Cart | null>;
  save(cart: Cart): Promise<void>;
};

type ProductRepository = {
  findById(productId: string): Promise<ProductLike | null>;
  findVariantById(variantId: string): Promise<VariantLike | null>;
};

class ApplicationError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;

  constructor(code: string, message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    this.context = context;
  }
}

function normalizeIdentifier(value: string, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new ApplicationError('INVALID_INPUT', `${fieldName} must be a string`, { fieldName });
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new ApplicationError('INVALID_INPUT', `${fieldName} is required`, { fieldName });
  }

  if (normalized.length > 128) {
    throw new ApplicationError('INVALID_INPUT', `${fieldName} exceeds maximum length`, { fieldName });
  }

  return normalized;
}

function normalizeQuantity(value: number): number {
  if (!Number.isInteger(value)) {
    throw new ApplicationError('INVALID_INPUT', 'quantity must be an integer', { quantity: value });
  }

  if (value < 1 || value > 999) {
    throw new ApplicationError('INVALID_INPUT', 'quantity must be between 1 and 999', { quantity: value });
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toProps<T extends Record<string, unknown>>(value: unknown): T {
  if (isRecord(value) && typeof value.getProps === 'function') {
    const props = value.getProps();
    if (isRecord(props)) {
      return props as T;
    }
  }

  if (isRecord(value)) {
    return value as T;
  }

  return {} as T;
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function toNonEmptyString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function extractAvailableQuantity(variant: VariantLike): number {
  const variantProps = toProps<VariantLike>(variant);
  const inventoryProps = toProps<{ quantityAvailable?: unknown }>(variantProps.inventory);

  const quantityCandidates: unknown[] = [
    variantProps.inventory?.getProps?.()['quantityAvailable'],
    inventoryProps.quantityAvailable,
    variantProps.inventory?.quantityAvailable,
    variantProps.inventoryQuantity,
  ];

  for (const candidate of quantityCandidates) {
    const quantity = toFiniteNumber(candidate);
    if (quantity !== null) {
      return Math.max(0, Math.floor(quantity));
    }
  }

  return 0;
}

function extractPriceAmount(variant: VariantLike): number {
  const variantProps = toProps<VariantLike>(variant);
  const priceProps = toProps<{ amount?: unknown }>(variantProps.price);

  const priceCandidates: unknown[] = [
    variantProps.price?.getProps?.()['amount'],
    priceProps.amount,
    variantProps.price?.amount,
    variantProps.priceAmount,
  ];

  for (const candidate of priceCandidates) {
    const price = toFiniteNumber(candidate);
    if (price !== null && price >= 0) {
      return price;
    }
  }

  throw new ApplicationError('INVALID_VARIANT_PRICE', 'Variant price is missing or invalid', {
    variantTitle: toNonEmptyString(variantProps.title, 'UNKNOWN'),
    sku: toNonEmptyString(variantProps.sku, 'UNKNOWN-SKU'),
  });
}

function createCartItemFromVariant(variantId: string, quantity: number, variant: VariantLike): CartItem {
  const variantProps = toProps<VariantLike>(variant);
  const sku = toNonEmptyString(variantProps.sku, 'UNKNOWN-SKU');
  const title = toNonEmptyString(variantProps.title, 'Unknown Product');
  const price = extractPriceAmount(variant);

  return CartItem.create(randomUUID(), {
    variantId,
    sku,
    title,
    price,
    quantity,
  });
}

function normalizeVariantEntity(candidate: unknown): VariantLike | null {
  if (!isRecord(candidate)) {
    return null;
  }

  const variantId = toNonEmptyString(candidate.id, '');
  const variantProps = toProps<VariantLike>(candidate);
  const derivedId = toNonEmptyString(variantProps.id, variantId);

  if (!derivedId) {
    return null;
  }

  return {
    ...variantProps,
    ...candidate,
    id: derivedId,
  };
}

function extractVariantsFromProduct(product: ProductLike): VariantLike[] {
  const productProps = toProps<ProductLike>(product);
  const variantCandidates = Array.isArray(productProps.variants)
    ? productProps.variants
    : Array.isArray(product.variants)
      ? product.variants
      : [];

  return variantCandidates
    .map((candidate) => normalizeVariantEntity(candidate))
    .filter((variant): variant is VariantLike => variant !== null);
}

function resolvePreferredVariant(productId: string, variants: VariantLike[], requestedQuantity: number): VariantLike {
  if (variants.length === 0) {
    throw new ApplicationError('VARIANT_NOT_FOUND', 'Variant not found', { productId });
  }

  const inStockVariant = variants.find((variant) => extractAvailableQuantity(variant) >= requestedQuantity);
  if (inStockVariant) {
    return inStockVariant;
  }

  return variants[0];
}

function extractVariantId(variant: VariantLike, productId: string): string {
  const variantProps = toProps<VariantLike>(variant);
  const variantId = toNonEmptyString(variant.id, toNonEmptyString(variantProps.id, ''));

  if (!variantId) {
    throw new ApplicationError('VARIANT_NOT_FOUND', 'Variant identifier is missing', { productId });
  }

  return variantId;
}

export class AddItemToCartCommand {
  static async execute(cartId: string, productId: string, quantity: number): Promise<Cart> {
    const normalizedCartId = normalizeIdentifier(cartId, 'cartId');
    const normalizedProductId = normalizeIdentifier(productId, 'productId');
    const normalizedQuantity = normalizeQuantity(quantity);

    const cartRepo = RepositoryFactory.getCartRepository() as CartRepository;
    const productRepo = RepositoryFactory.getProductRepository() as ProductRepository;

    let cart = await cartRepo.findById(normalizedCartId);

    if (!cart) {
      logger.info({ cartId: normalizedCartId }, 'Cart not found. Initializing a new cart.');
      cart = Cart.create(normalizedCartId, { items: [] });
    }

    const product = await productRepo.findById(normalizedProductId);

    if (!product) {
      logger.warn(
        { cartId: normalizedCartId, productId: normalizedProductId },
        'Product not found while adding item to cart',
      );
      throw new ApplicationError('PRODUCT_NOT_FOUND', 'Product not found', {
        cartId: normalizedCartId,
        productId: normalizedProductId,
      });
    }

    const variants = extractVariantsFromProduct(product);
    const selectedVariant = resolvePreferredVariant(normalizedProductId, variants, normalizedQuantity);
    const resolvedVariantId = extractVariantId(selectedVariant, normalizedProductId);
    const hydratedVariant = await productRepo.findVariantById(resolvedVariantId);

    if (!hydratedVariant) {
      logger.warn(
        {
          cartId: normalizedCartId,
          productId: normalizedProductId,
          variantId: resolvedVariantId,
        },
        'Resolved variant could not be loaded while adding item to cart',
      );
      throw new ApplicationError('VARIANT_NOT_FOUND', 'Variant not found', {
        cartId: normalizedCartId,
        productId: normalizedProductId,
        variantId: resolvedVariantId,
      });
    }

    const availableQuantity = extractAvailableQuantity(hydratedVariant);

    if (availableQuantity < normalizedQuantity) {
      logger.warn(
        {
          cartId: normalizedCartId,
          productId: normalizedProductId,
          variantId: resolvedVariantId,
          requestedQuantity: normalizedQuantity,
          availableQuantity,
        },
        'Insufficient inventory for cart add operation',
      );
      throw new ApplicationError('INSUFFICIENT_INVENTORY', 'Insufficient inventory', {
        cartId: normalizedCartId,
        productId: normalizedProductId,
        variantId: resolvedVariantId,
        requestedQuantity: normalizedQuantity,
        availableQuantity,
      });
    }

    const item = createCartItemFromVariant(resolvedVariantId, normalizedQuantity, hydratedVariant);

    cart.addItem(item);
    await cartRepo.save(cart);

    logger.info(
      {
        cartId: normalizedCartId,
        productId: normalizedProductId,
        variantId: resolvedVariantId,
        quantity: normalizedQuantity,
        itemId: item.getProps?.().id ?? undefined,
      },
      'Item successfully added to cart',
    );

    return cart;
  }
}
