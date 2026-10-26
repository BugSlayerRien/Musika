/* ============================================================
   MUSIKA — Profile skins
   ------------------------------------------------------------
   A skin is how a member's PROFILE looks, as opposed to `theme`,
   which is how the APP looks to that member.

   The distinction matters and is the whole point of this file:

     theme → yours, private, follows you around the app
     skin  → part of your profile, travels WITH the profile

   So when a backend arrives and someone else opens your page,
   they see YOUR skin inside their own app chrome. Nothing here
   reads the viewer's theme, and nothing here writes to :root —
   a skin is projected onto a wrapper element instead. That is
   what makes it work for a profile you do not own.

   Every value lands in `user_prefs.skin` (jsonb) per
   docs/NEXT-STEPS.md, with no reshaping needed.
   ============================================================ */

/* ---------------- Banner treatments ---------------- */
export const BANNERS = [
  { id: 'aurora', label: 'Aurora', blurb: 'Soft light sheets in your accent colours.' },
  { id: 'wallpaper', label: 'Scenery', blurb: 'One of the generated Aero wallpapers.' },
  { id: 'gradient', label: 'Clean Gradient', blurb: 'A plain two-colour wash.' },
  { id: 'stripes', label: 'Diagonal Stripes', blurb: 'Fine ruled lines, barbershop energy.' },
  { id: 'grid', label: 'Blueprint Grid', blurb: 'Technical, cool, lots of straight lines.' },
  { id: 'bubbles', label: 'Bubble Bath', blurb: 'Floating glass spheres over colour.' },
  { id: 'solid', label: 'Flat Colour', blurb: 'No texture at all. Confident.' },
];

/* Which generated wallpaper the `wallpaper` banner uses. */
export const BANNER_SCENES = [
  'aqua', 'meadow', 'lagoon', 'amethyst', 'sunset', 'frost', 'chrome', 'gothic', 'vapor', 'cyber',
];

/* ---------------- Name treatments ---------------- */
export const NAME_STYLES = [
  { id: 'iridescent', label: 'Iridescent' },
  { id: 'solid', label: 'Solid' },
  { id: 'gradient', label: 'Accent Gradient' },
  { id: 'outline', label: 'Outline' },
];

/* ---------------- Banner heights ---------------- */
export const BANNER_HEIGHTS = [
  { id: 'slim', label: 'Slim', px: 110 },
  { id: 'standard', label: 'Standard', px: 170 },
  { id: 'tall', label: 'Tall', px: 250 },
];

/* ---------------- Ready-made looks ----------------
   A starting point, not a cage: each one just seeds the
   individual controls below it.
   -------------------------------------------------- */
export const SKIN_PRESETS = [
  {
    id: 'house',
    label: 'House Violet',
    blurb: 'The MUSIKA default. Aurora banner, iridescent name.',
    skin: {
      banner: 'aurora', scene: 'amethyst', height: 'standard',
      accent: ['#8b5cf6', '#e879f9'], ink: 'light',
      name: 'iridescent', corners: 1, glass: 0.42, tint: '26, 10, 54',
    },
  },
  {
    id: 'poolside',
    label: 'Poolside',
    blurb: 'Bright water and white glass. Dark type.',
    skin: {
      banner: 'bubbles', scene: 'aqua', height: 'standard',
      accent: ['#0ea5e9', '#22d3ee'], ink: 'dark',
      name: 'gradient', corners: 1.1, glass: 0.55, tint: '255, 255, 255',
    },
  },
  {
    id: 'meadow',
    label: 'Open Meadow',
    blurb: 'Grass and sky, rounded and friendly.',
    skin: {
      banner: 'wallpaper', scene: 'meadow', height: 'tall',
      accent: ['#4fae2e', '#8fd94a'], ink: 'dark',
      name: 'solid', corners: 1.1, glass: 0.58, tint: '255, 255, 255',
    },
  },
  {
    id: 'cathedral',
    label: 'Cathedral',
    blurb: 'Dark, sharp-cornered, candlelit.',
    skin: {
      banner: 'wallpaper', scene: 'gothic', height: 'tall',
      accent: ['#7e22ce', '#f59e0b'], ink: 'light',
      name: 'outline', corners: 0.22, glass: 0.55, tint: '18, 8, 30',
    },
  },
  {
    id: 'terminal',
    label: 'Terminal',
    blurb: 'Blueprint grid, neon accent, hard edges.',
    skin: {
      banner: 'grid', scene: 'cyber', height: 'slim',
      accent: ['#22d3ee', '#a3e635'], ink: 'light',
      name: 'solid', corners: 0.18, glass: 0.5, tint: '4, 18, 26',
    },
  },
  {
    id: 'cassette',
    label: 'Cassette',
    blurb: 'Dusk stripes and warm magenta.',
    skin: {
      banner: 'stripes', scene: 'sunset', height: 'standard',
      accent: ['#e11d48', '#fbbf24'], ink: 'light',
      name: 'gradient', corners: 0.9, glass: 0.44, tint: '52, 10, 44',
    },
  },
  {
    id: 'frost',
    label: 'Frostglass',
    blurb: 'Pale ice, maximum legibility.',
    skin: {
      banner: 'gradient', scene: 'frost', height: 'slim',
      accent: ['#0284c7', '#7dd3fc'], ink: 'dark',
      name: 'solid', corners: 1.1, glass: 0.62, tint: '255, 255, 255',
    },
  },
  {
    id: 'blackout',
    label: 'Blackout',
    blurb: 'Flat colour, no weather, nothing shiny.',
    skin: {
      banner: 'solid', scene: 'chrome', height: 'slim',
      accent: ['#64748b', '#cbd5e1'], ink: 'light',
      name: 'solid', corners: 0.5, glass: 0.6, tint: '18, 18, 24',
    },
  },
];

export const DEFAULT_SKIN = { ...SKIN_PRESETS[0].skin };

export const skinPresetById = (id) => SKIN_PRESETS.find((s) => s.id === id);

export const bannerHeightPx = (id) =>
  (BANNER_HEIGHTS.find((h) => h.id === id) ?? BANNER_HEIGHTS[1]).px;

/**
 * Turn a skin into inline CSS custom properties.
 *
 * Returned as a style object rather than written to :root, so a
 * profile's look stays scoped to its own card. That is what lets
 * two different skins coexist — yours in the app, someone else's
 * on the page you are reading.
 */
export function skinVars(skin = DEFAULT_SKIN) {
  const s = { ...DEFAULT_SKIN, ...skin };
  const [a1, a2] = s.accent;
  return {
    '--skin-a1': a1,
    '--skin-a2': a2,
    '--skin-corners': String(s.corners),
    '--skin-glass': String(s.glass),
    '--skin-tint': s.tint,
    '--skin-banner-h': `${bannerHeightPx(s.height)}px`,
    '--skin-scene': `url(/aero/bg/${s.scene}.png)`,
  };
}

/** Class list for the wrapper: drives banner pattern, ink and name. */
export function skinClasses(skin = DEFAULT_SKIN) {
  const s = { ...DEFAULT_SKIN, ...skin };
  return `skin skin-banner-${s.banner} skin-ink-${s.ink} skin-name-${s.name}`;
}
