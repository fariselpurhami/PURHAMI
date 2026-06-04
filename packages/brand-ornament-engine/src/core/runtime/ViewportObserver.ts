// packages/brand-ornament-engine/src/core/runtime/ViewportObserver.ts
export function createViewportObserver(
  element: HTMLElement,
  onEnter: () => void,
  onExit: () => void
): () => void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    onEnter();
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onEnter();
        } else {
          onExit();
        }
      });
    },
    { threshold: 0.1, rootMargin: '100px' }
  );

  observer.observe(element);

  return () => {
    observer.disconnect();
  };
}
