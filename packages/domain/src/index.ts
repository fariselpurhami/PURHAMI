// packages/domain/src/index.ts
export * from './core/Entity';
export * from './core/ValueObject';
export * from './catalog/entities/Product';
export * from './catalog/entities/Variant';
export * from './catalog/entities/Category';
export * from './catalog/value-objects/Price';
export * from './catalog/value-objects/InventoryLevel';
export * from './catalog/repositories/IProductRepository';
export * from './catalog/repositories/ICategoryRepository';
export * from './catalog/exceptions/CatalogExceptions';

// تصحيح المسارات بإزالة الـ /src الزائدة لضمان الـ Compilation السليم
export * from './cart/entities/Cart';
export * from './cart/entities/CartItem';
export * from './cart/repositories/ICartRepository';
