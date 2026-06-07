export const Logger = {
  info: (event: string, payload: any = {}) => console.info(`[PURHAMI:INFO] ${event}`, payload),
  warn: (event: string, payload: any = {}) => console.warn(`[PURHAMI:WARN] ${event}`, payload),
  error: (event: string, err: any) => console.error(`[PURHAMI:ERROR] ${event}`, err),
};
