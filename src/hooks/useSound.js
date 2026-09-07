import { useCallback, useMemo } from 'react';
import { sound } from '@/audio/soundEngine';
import { useProfile } from '@/context/ProfileContext';

/**
 * The single entry point every component uses to make noise.
 * Respects the member's per-category switches (hover / nav) so
 * someone can keep click feedback but silence the cursor.
 */
export function useSound() {
  const { profile } = useProfile();
  const a = profile.audio;

  const play = useCallback((event) => {
    if (!a.enabled) return;
    if (event === 'hover' && !a.hoverSounds) return;
    if (event === 'nav' && !a.navSounds) return;
    sound.unlock();
    sound.play(event);
  }, [a.enabled, a.hoverSounds, a.navSounds]);

  /** Spread onto any interactive element for the full blip treatment. */
  const sfx = useMemo(() => (clickEvent = 'click') => ({
    onPointerEnter: () => play('hover'),
    onClick: () => play(clickEvent),
  }), [play]);

  return { play, sfx, engine: sound };
}
