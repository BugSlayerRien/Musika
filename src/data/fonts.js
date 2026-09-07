/* ============================================================
   MUSIKA — Typeface pairings
   ------------------------------------------------------------
   Each entry sets two variables: --font-ui for body copy and
   --font-display for headings, buttons and numerals.

   `letter` nudges display tracking, because a blackletter and a
   pixel face want very different spacing from a rounded sans.
   Families are requested in index.html as one Google Fonts call.
   ============================================================ */

const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif";

export const TYPEFACES = [
  {
    id: 'aero',
    label: 'Aero Rounded',
    blurb: 'Quicksand over Rubik. The house pairing.',
    ui: `'Rubik', ${SANS}`,
    display: `'Quicksand', ${SANS}`,
    letter: '-0.015em',
    sample: 'Aa',
  },
  {
    id: 'rounded',
    label: 'Bubble Round',
    blurb: 'Comfortaa — the roundest thing in the drawer.',
    ui: `'Nunito', ${SANS}`,
    display: `'Comfortaa', ${SANS}`,
    letter: '0em',
    sample: 'Aa',
  },
  {
    id: 'grotesk',
    label: 'Clean Grotesk',
    blurb: 'Space Grotesk. Neutral, modern, gets out of the way.',
    ui: `'Rubik', ${SANS}`,
    display: `'Space Grotesk', ${SANS}`,
    letter: '-0.02em',
    sample: 'Aa',
  },
  {
    id: 'geometric',
    label: 'Geometric Poster',
    blurb: 'Poppins. Wide circles, confident headlines.',
    ui: `'Poppins', ${SANS}`,
    display: `'Poppins', ${SANS}`,
    letter: '-0.01em',
    sample: 'Aa',
  },
  {
    id: 'editorial',
    label: 'Editorial Outfit',
    blurb: 'Outfit. Tight, magazine-ish, good at large sizes.',
    ui: `'Outfit', ${SANS}`,
    display: `'Outfit', ${SANS}`,
    letter: '-0.03em',
    sample: 'Aa',
  },
  {
    id: 'gothic',
    label: 'Cathedral Serif',
    blurb: 'Cinzel. Carved-in-stone capitals for the dark styles.',
    ui: `'Rubik', ${SANS}`,
    display: `'Cinzel', Georgia, serif`,
    letter: '0.04em',
    sample: 'Aa',
  },
  {
    id: 'blackletter',
    label: 'Blackletter',
    blurb: 'UnifrakturMaguntia. Full gothic. Headings only, obviously.',
    ui: `'Rubik', ${SANS}`,
    display: `'UnifrakturMaguntia', 'Cinzel', serif`,
    letter: '0.02em',
    sample: 'Aa',
  },
  {
    id: 'techno',
    label: 'Techno Wide',
    blurb: 'Orbitron. Chrome, vaporwave and anything with a grid.',
    ui: `'Rubik', ${SANS}`,
    display: `'Orbitron', ${SANS}`,
    letter: '0.06em',
    sample: 'Aa',
  },
  {
    id: 'mono',
    label: 'Terminal Mono',
    blurb: 'VT323. A phosphor tube, basically.',
    ui: `'Rubik', ${SANS}`,
    display: `'VT323', ui-monospace, Consolas, monospace`,
    letter: '0.04em',
    sample: 'Aa',
  },
  {
    id: 'pixel',
    label: 'Pixel Console',
    blurb: 'Press Start 2P. Tiny, blocky, loud. Use sparingly.',
    ui: `'Rubik', ${SANS}`,
    display: `'Press Start 2P', ui-monospace, monospace`,
    letter: '0.02em',
    sample: 'Aa',
  },
  {
    id: 'system',
    label: 'System Native',
    blurb: 'Whatever the machine already has. Fastest, no download.',
    ui: SANS,
    display: SANS,
    letter: '-0.01em',
    sample: 'Aa',
  },
];

export const typefaceById = (id) => TYPEFACES.find((f) => f.id === id) ?? TYPEFACES[0];
