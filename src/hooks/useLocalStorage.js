import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * State that survives a reload.
 *
 * Writes are debounced so dragging a colour picker does not hammer
 * localStorage — but with a timer rather than requestAnimationFrame,
 * because rAF does not fire in a hidden tab and preferences changed
 * just before switching away would be lost. A pagehide/visibility
 * listener flushes anything still pending.
 */
export function useLocalStorage(key, initial, migrate) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) return initial;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        // merge so defaults added after a user's last visit still reach them
        return migrate ? migrate(parsed) : { ...initial, ...parsed };
      }
      return parsed;
    } catch {
      return initial;
    }
  });

  const timer = useRef(0);
  const pending = useRef(null);

  const flush = useCallback(() => {
    if (pending.current === null) return;
    try {
      window.localStorage.setItem(key, pending.current);
    } catch {
      /* quota or private mode — the app still works, it just forgets */
    }
    pending.current = null;
  }, [key]);

  useEffect(() => {
    pending.current = JSON.stringify(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, 120);
    return () => clearTimeout(timer.current);
  }, [value, flush]);

  /* Never lose a change because the tab went away mid-debounce. */
  useEffect(() => {
    const onHide = () => { if (document.visibilityState === 'hidden') flush(); };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onHide);
      flush();
    };
  }, [flush]);

  const reset = useCallback(() => setValue(initial), [initial]);

  return [value, setValue, reset];
}
