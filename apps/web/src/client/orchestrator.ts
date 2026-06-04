// apps/web/src/client/orchestrator.ts
/**
 * Client-side execution orchestration for DOM-sensitive mutations.
 * Enforces rendering bounds and prevents layout thrashing.
 */

export const DOMOrchestrator = {
  lockScroll: () => {
    if (typeof document === 'undefined') return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.setAttribute('data-scroll-locked', 'true');
  },
  
  unlockScroll: () => {
    if (typeof document === 'undefined') return;
    document.body.style.paddingRight = '';
    document.body.removeAttribute('data-scroll-locked');
  }
};
