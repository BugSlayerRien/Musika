import { useEffect, useRef } from 'react';
import { sound } from '@/audio/soundEngine';
import { useProfile } from '@/context/ProfileContext';

/**
 * Live spectrum drawn from the audio graph's analyser node — so it
 * reacts to the actual synthesised preview, not a fake animation.
 * Falls back to a gentle idle wave when nothing is playing.
 */
export function Visualizer({ bars = 34, height = 40, playing }) {
  const ref = useRef(null);
  const { profile } = useProfile();
  const calm = profile.theme.motion === 'calm';

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const spans = Array.from(el.children);
    let raf = 0;
    let t = 0;
    const data = new Uint8Array(256);

    const frame = () => {
      t += 0.05;
      const spectrum = playing ? sound.spectrum(data) : null;
      spans.forEach((s, i) => {
        let v;
        if (spectrum) {
          // Real recordings fill the spectrum, so spread across most of
          // it and use a gamma above 1 — otherwise every bar pegs at the
          // ceiling and the meter stops meaning anything.
          const bin = 1 + Math.floor(((i / spans.length) ** 1.35) * 96);
          v = Math.max(0.06, (spectrum[bin] / 255) ** 1.35);
        } else {
          v = 0.1 + 0.06 * (1 + Math.sin(t + i * 0.4));
        }
        s.style.transform = `scaleY(${v.toFixed(3)})`;
      });
      raf = requestAnimationFrame(frame);
    };

    if (calm) {
      spans.forEach((s, i) => { s.style.transform = `scaleY(${0.2 + (i % 5) * 0.12})`; });
    } else {
      raf = requestAnimationFrame(frame);
    }
    return () => cancelAnimationFrame(raf);
  }, [playing, calm]);

  return (
    <div className="viz" ref={ref} style={{ height }} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => <span key={i} className="viz-bar" />)}
    </div>
  );
}
