// packages/domain/src/catalog/exceptions/CatalogExceptions.ts
export class ProductNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Product with identifier ${identifier} not found.`);
    this.name = 'ProductNotFoundError';
  }
}

export class PersistenceNotConnectedError extends Error {
  constructor(repository: string) {
    super(`Persistence failure: The underlying data source for ${repository} is not connected or provisioned in this environment.`);
    this.name = 'PersistenceNotConnectedError';
  }
}
