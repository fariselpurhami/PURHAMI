// packages/config/src/index.ts
export * from './client';
// Note: server config is strictly isolated and should only be imported from '@purhami/config/server' in the consuming app where needed, to avoid leaking secrets to the client bundle.
export * from './shared';
