import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DEFAULT_PROFILE, AURA_PRESETS } from '@/data/profilePresets';
import { styleById } from '@/data/styles';
import { typefaceById } from '@/data/fonts';
import { sound } from '@/audio/soundEngine';

const ProfileCtx = createContext(null);

const STORE_KEY = 'musika.profile.v3';

/**
 * Preferences are nested, so a plain spread would strand a returning
 * member on an old `theme` or `audio` object the moment a new option
 * ships. Merge one level deeper.
 */
const migrate = (stored) => ({
  ...DEFAULT_PROFILE,
  ...stored,
  orb: { ...DEFAULT_PROFILE.orb, ...stored.orb },
  skin: { ...DEFAULT_PROFILE.skin, ...stored.skin },
  theme: { ...DEFAULT_PROFILE.theme, ...stored.theme },
  audio: { ...DEFAULT_PROFILE.audio, ...stored.audio },
});

export function ProfileProvider({ children }) {
  const [profile, setProfile, resetProfile] = useLocalStorage(STORE_KEY, DEFAULT_PROFILE, migrate);

  /* ---- generic patchers ---- */
  const patch = useCallback((fields) => setProfile((p) => ({ ...p, ...fields })), [setProfile]);

  const patchTheme = useCallback(
    (fields) => setProfile((p) => ({ ...p, theme: { ...p.theme, ...fields } })),
    [setProfile],
  );

  const patchAudio = useCallback(
    (fields) => setProfile((p) => ({ ...p, audio: { ...p.audio, ...fields } })),
    [setProfile],
  );

  const patchOrb = useCallback(
    (fields) => setProfile((p) => ({ ...p, orb: { ...p.orb, ...fields } })),
    [setProfile],
  );

  /* The profile's own look. Deliberately separate from patchTheme:
     a skin belongs to the profile and will be served to other
     viewers; a theme belongs to this browser and never leaves it. */
  const patchSkin = useCallback(
    (fields) => setProfile((p) => ({ ...p, skin: { ...p.skin, ...fields } })),
    [setProfile],
  );

  const applySkinPreset = useCallback((preset) => {
    setProfile((p) => ({ ...p, skin: { ...p.skin, ...preset } }));
  }, [setProfile]);

  /* ------------------------------------------------------------
     Applying a style rewrites the whole look in one move —
     wallpaper, palette, ink, corner sharpness, glass, weather,
     typeface — and optionally the sound pack with it.
     ------------------------------------------------------------ */
  const applyStyle = useCallback((id, { withSound = true } = {}) => {
    const s = styleById(id);
    setProfile((p) => ({
      ...p,
      theme: {
        ...p.theme,
        style: s.id,
        auraColors: [...s.palette],
        scene: [...s.scene],
        ink: s.ink,
        radiusScale: s.radius,
        panelAlpha: s.glass.alpha,
        glassBlur: s.glass.blur,
        panelTint: s.glass.tint,
        particle: s.particle,
        typeface: s.typeface,
      },
      audio: withSound ? { ...p.audio, pack: s.pack } : p.audio,
    }));
  }, [setProfile]);

  const applyAuraPreset = useCallback((id) => {
    const preset = AURA_PRESETS.find((a) => a.id === id);
    if (!preset) return;
    patchTheme({ auraColors: [...preset.colors] });
  }, [patchTheme]);

  /* ---- collections ---- */
  const toggleHeart = useCallback((songId) => {
    let added = false;
    setProfile((p) => {
      const has = p.hearted.includes(songId);
      added = !has;
      return {
        ...p,
        hearted: has ? p.hearted.filter((s) => s !== songId) : [songId, ...p.hearted],
      };
    });
    return added;
  }, [setProfile]);

  const isHearted = useCallback((songId) => profile.hearted.includes(songId), [profile.hearted]);

  const toggleAnthem = useCallback((songId) => {
    setProfile((p) => {
      if (p.anthems.includes(songId)) {
        return { ...p, anthems: p.anthems.filter((s) => s !== songId) };
      }
      return { ...p, anthems: [...p.anthems, songId].slice(-5) };
    });
  }, [setProfile]);

  const isAnthem = useCallback((songId) => profile.anthems.includes(songId), [profile.anthems]);

  const visitCountry = useCallback((countryId) => {
    setProfile((p) =>
      p.visited.includes(countryId) ? p : { ...p, visited: [...p.visited, countryId] });
  }, [setProfile]);

  const addSubmission = useCallback((entry) => {
    setProfile((p) => ({ ...p, submissions: [{ ...entry, at: Date.now() }, ...p.submissions] }));
  }, [setProfile]);

  const setModules = useCallback((modules) => patch({ modules }), [patch]);

  /* ------------------------------------------------------------
     Project the theme onto <html> as CSS custom properties.
     One effect, every visual preference — this is what makes the
     Studio feel instant.
     ------------------------------------------------------------ */
  useEffect(() => {
    const root = document.documentElement;
    const t = profile.theme;
    const [a1, a2, a3, a4] = t.auraColors;
    const [s1, s2, s3] = t.scene;
    const face = typefaceById(t.typeface);

    root.style.setProperty('--aura-1', a1);
    root.style.setProperty('--aura-2', a2);
    root.style.setProperty('--aura-3', a3);
    root.style.setProperty('--aura-4', a4);
    root.style.setProperty('--aura-angle', `${t.auraAngle}deg`);
    root.style.setProperty('--aura-intensity', String(t.auraIntensity));

    root.style.setProperty('--scene-a', s1);
    root.style.setProperty('--scene-b', s2);
    root.style.setProperty('--scene-c', s3);

    root.style.setProperty('--glass-blur', `${t.glass ? t.glassBlur : 0}px`);
    root.style.setProperty('--panel-alpha', String(t.panelAlpha));
    root.style.setProperty('--panel-tint', t.panelTint);
    root.style.setProperty('--radius-scale', String(t.radiusScale));

    root.style.setProperty('--font-ui', face.ui);
    root.style.setProperty('--font-display', face.display);
    root.style.setProperty('--display-letter', face.letter);

    root.dataset.style = t.style;
    root.dataset.ink = t.ink;
    root.dataset.density = t.density;
    root.dataset.motion = t.motion === 'calm' ? 'calm' : 'full';
    root.dataset.glass = t.glass ? 'on' : 'off';
    root.dataset.scanlines = t.scanlines ? 'on' : 'off';
  }, [profile.theme]);

  /* ---- keep the audio engine in sync with preferences ---- */
  useEffect(() => {
    sound.configure({
      enabled: profile.audio.enabled,
      uiVolume: profile.audio.uiVolume,
      musicVolume: profile.audio.musicVolume,
      pack: profile.audio.pack,
      ambience: profile.audio.ambience,
    });
  }, [profile.audio]);

  const value = useMemo(() => ({
    profile,
    setProfile,
    resetProfile,
    patch,
    patchTheme,
    patchAudio,
    patchOrb,
    patchSkin,
    applySkinPreset,
    applyStyle,
    applyAuraPreset,
    toggleHeart,
    isHearted,
    toggleAnthem,
    isAnthem,
    visitCountry,
    addSubmission,
    setModules,
  }), [profile, setProfile, resetProfile, patch, patchTheme, patchAudio, patchOrb,
    patchSkin, applySkinPreset, applyStyle, applyAuraPreset, toggleHeart, isHearted, toggleAnthem, isAnthem,
    visitCountry, addSubmission, setModules]);

  return <ProfileCtx.Provider value={value}>{children}</ProfileCtx.Provider>;
}

export const useProfile = () => {
  const ctx = useContext(ProfileCtx);
  if (!ctx) throw new Error('useProfile must be used inside <ProfileProvider>');
  return ctx;
};
