'use client';

import { useState, useEffect } from 'react';

export function usePresence(isPresent: boolean, durationMs: number = 600) {
  const [state, setState] = useState({
    render: isPresent,
    show: isPresent
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isPresent) {
      setState({ render: true, show: false });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setState({ render: true, show: true }));
      });
    } else {
      setState(prev => ({ ...prev, show: false }));
      timeoutId = setTimeout(() => {
        setState({ render: false, show: false });
      }, durationMs);
    }
    return () => clearTimeout(timeoutId);
  }, [isPresent, durationMs]);

  return state;
}
