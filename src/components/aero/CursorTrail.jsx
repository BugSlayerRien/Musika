import { useEffect, useRef } from 'react';
import { useProfile } from '@/context/ProfileContext';

/**
 * Canvas-free cursor trail. Particles are pooled DOM nodes so the
 * effect costs nothing measurable and switches style instantly.
 */
export function CursorTrail() {
  const { profile } = useProfile();
  const style = profile.theme.cursor;
  const calm = profile.theme.motion === 'calm';
  const pool = useRef([]);
  const idx = useRef(0);

  useEffect(() => {
    if (style === 'none' || calm) return undefined;

    const SIZE = style === 'comet' ? 14 : 22;
    const nodes = Array.from({ length: SIZE }, () => {
      const el = document.createElement('span');
      el.className = 'trail-dot';
      el.style.opacity = '0';
      document.body.appendChild(el);
      return el;
    });
    pool.current = nodes;

    let raf = 0;
    let lastEmit = 0;

    const emit = (x, y) => {
      const el = nodes[idx.current % nodes.length];
      idx.current++;

      const jitter = (n) => (Math.random() - 0.5) * n;
      const size =
        style === 'bubbletrail' ? 6 + Math.random() * 12
          : style === 'comet' ? 10 + Math.random() * 8
            : 4 + Math.random() * 7;

      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${x + jitter(10) - size / 2}px`;
      el.style.top = `${y + jitter(10) - size / 2}px`;
      el.style.transition = 'none';
      el.style.opacity = style === 'comet' ? '0.75' : '0.9';
      el.style.transform = 'translate3d(0,0,0) scale(1)';

      if (style === 'bubbletrail') {
        el.style.background =
          'radial-gradient(circle at 32% 28%, rgba(255,255,255,.95), rgba(255,255,255,.15) 40%, transparent 60%), ' +
          'radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--aura-3) 55%, transparent), transparent 70%)';
        el.style.border = '1px solid rgba(255,255,255,.5)';
        el.style.boxShadow = 'none';
      } else if (style === 'comet') {
        el.style.background =
          'radial-gradient(circle, rgba(255,255,255,.95), color-mix(in oklab, var(--aura-2) 70%, transparent) 45%, transparent 70%)';
        el.style.border = 'none';
        el.style.boxShadow = '0 0 14px color-mix(in oklab, var(--aura-2) 70%, transparent)';
      } else {
        el.style.background =
          'radial-gradient(circle, #fff, color-mix(in oklab, var(--aura-1) 75%, transparent) 40%, transparent 72%)';
        el.style.border = 'none';
        el.style.boxShadow = '0 0 12px color-mix(in oklab, var(--aura-2) 65%, transparent)';
      }

      // next frame: start the decay
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 700ms ease-out, transform 700ms cubic-bezier(.22,1,.36,1)';
        el.style.opacity = '0';
        el.style.transform =
          style === 'bubbletrail'
            ? 'translate3d(0,-34px,0) scale(1.35)'
            : 'translate3d(0,6px,0) scale(.3)';
      });
    };

    const onMove = (e) => {
      const now = performance.now();
      if (now - lastEmit < (style === 'comet' ? 16 : 34)) return;
      lastEmit = now;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => emit(e.clientX, e.clientY));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      nodes.forEach((n) => n.remove());
      pool.current = [];
    };
  }, [style, calm]);

  return null;
}
