/* ============================================================
   MUSIKA — decal artwork
   ------------------------------------------------------------
   Transparent PNG stickers: the floating objects that sell the
   Frutiger Aero look. Drawn here, rasterised to public/aero/png.
   ============================================================ */

const svg = (size, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 200 200">
<defs>${defs}</defs>${body}</svg>`;

const GLOSS = `
  <radialGradient id="hi" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffffff" stop-opacity=".95"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>`;

/** A soap bubble: rim light, thin-film colour, specular cap. */
const bubble = (c1, c2) => svg(256, `
  ${GLOSS}
  <radialGradient id="film" cx="36%" cy="30%" r="76%">
    <stop offset="0%"  stop-color="#ffffff" stop-opacity=".62"/>
    <stop offset="34%" stop-color="${c1}" stop-opacity=".16"/>
    <stop offset="66%" stop-color="${c2}" stop-opacity=".30"/>
    <stop offset="88%" stop-color="#ffffff" stop-opacity=".40"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity=".05"/>
  </radialGradient>
  <radialGradient id="rim" cx="50%" cy="50%" r="50%">
    <stop offset="82%" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="95%" stop-color="#ffffff" stop-opacity=".55"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity=".05"/>
  </radialGradient>`, `
  <circle cx="100" cy="100" r="94" fill="url(#film)"/>
  <circle cx="100" cy="100" r="94" fill="url(#rim)"/>
  <ellipse cx="72" cy="62" rx="30" ry="20" fill="url(#hi)" transform="rotate(-28 72 62)"/>
  <ellipse cx="132" cy="146" rx="16" ry="10" fill="#ffffff" opacity=".30"/>`);

/** A solid glossy marble — the Aero "orb" button. */
const orb = (c1, c2) => svg(256, `
  ${GLOSS}
  <radialGradient id="body" cx="34%" cy="28%" r="82%">
    <stop offset="0%"  stop-color="#ffffff"/>
    <stop offset="22%" stop-color="${c1}"/>
    <stop offset="72%" stop-color="${c2}"/>
    <stop offset="100%" stop-color="#0b0322"/>
  </radialGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#ffffff" stop-opacity=".45"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>`, `
  <circle cx="100" cy="100" r="92" fill="url(#body)"/>
  <path d="M22 128 A92 92 0 0 0 178 128 A92 62 0 0 1 22 128Z" fill="url(#floor)" opacity=".5"/>
  <ellipse cx="74" cy="54" rx="38" ry="24" fill="url(#hi)" transform="rotate(-24 74 54)"/>
  <circle cx="100" cy="100" r="92" fill="none" stroke="#ffffff" stroke-opacity=".7" stroke-width="2"/>`);

/** Water droplet with refraction. */
const droplet = svg(256, `
  ${GLOSS}
  <linearGradient id="drop" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"  stop-color="#dffaff" stop-opacity=".85"/>
    <stop offset="55%" stop-color="#69cdf0" stop-opacity=".65"/>
    <stop offset="100%" stop-color="#1b7fb8" stop-opacity=".85"/>
  </linearGradient>`, `
  <path d="M100 14 C136 74 168 104 168 134 A68 68 0 0 1 32 134 C32 104 64 74 100 14Z" fill="url(#drop)"/>
  <path d="M100 14 C136 74 168 104 168 134 A68 68 0 0 1 32 134 C32 104 64 74 100 14Z"
        fill="none" stroke="#ffffff" stroke-opacity=".7" stroke-width="2"/>
  <ellipse cx="76" cy="128" rx="16" ry="26" fill="url(#hi)" opacity=".9"/>
  <ellipse cx="124" cy="158" rx="12" ry="8" fill="#ffffff" opacity=".45"/>`);

/** Glossy leaf — the other half of the Aero vocabulary. */
const leaf = svg(256, `
  <linearGradient id="lf" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%"  stop-color="#c8f36a"/>
    <stop offset="45%" stop-color="#57bb2e"/>
    <stop offset="100%" stop-color="#1c6b23"/>
  </linearGradient>
  <linearGradient id="lfhi" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#ffffff" stop-opacity=".55"/>
    <stop offset="60%" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>`, `
  <path d="M28 172 C28 78 96 24 178 22 C180 106 118 174 28 172Z" fill="url(#lf)"/>
  <path d="M28 172 C28 78 96 24 178 22 C180 106 118 174 28 172Z" fill="url(#lfhi)"/>
  <path d="M32 170 C80 128 130 78 176 26" stroke="#eaffc8" stroke-opacity=".7" stroke-width="3" fill="none"/>
  <g stroke="#eaffc8" stroke-opacity=".4" stroke-width="2" fill="none">
    <path d="M70 150 C86 128 92 112 96 88"/>
    <path d="M104 128 C120 108 128 94 134 72"/>
    <path d="M48 162 C60 146 66 134 68 118"/>
  </g>`);

/** Cloud puff sticker. */
const cloudPuff = svg(384, `
  <linearGradient id="cl" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"  stop-color="#ffffff"/>
    <stop offset="65%" stop-color="#f2f9ff"/>
    <stop offset="100%" stop-color="#c9dff0"/>
  </linearGradient>`, `
  <g fill="url(#cl)">
    <ellipse cx="100" cy="126" rx="88" ry="30"/>
    <ellipse cx="62"  cy="112" rx="42" ry="30"/>
    <ellipse cx="104" cy="96"  rx="54" ry="38"/>
    <ellipse cx="146" cy="114" rx="40" ry="27"/>
  </g>
  <ellipse cx="92" cy="86" rx="42" ry="18" fill="#ffffff" opacity=".9"/>`);

/** Rainbow arc. */
const rainbow = svg(512, '', `
  <g fill="none" stroke-width="11" opacity=".85">
    <path d="M14 190 A86 86 0 0 1 186 190" stroke="#ff4d6d"/>
    <path d="M26 190 A74 74 0 0 1 174 190" stroke="#ffa64d"/>
    <path d="M38 190 A62 62 0 0 1 162 190" stroke="#ffe14d"/>
    <path d="M50 190 A50 50 0 0 1 150 190" stroke="#5ce68a"/>
    <path d="M62 190 A38 38 0 0 1 138 190" stroke="#4dc4ff"/>
    <path d="M74 190 A26 26 0 0 1 126 190" stroke="#a86bff"/>
  </g>`);

/** Six-arm snowflake. */
const snowflake = svg(256, '', `
  <g stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".95">
    ${Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2;
    const x = 100 + Math.cos(a) * 82;
    const y = 100 + Math.sin(a) * 82;
    const bx = 100 + Math.cos(a) * 48;
    const by = 100 + Math.sin(a) * 48;
    const p = a + 0.6;
    const m = a - 0.6;
    return `<line x1="100" y1="100" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>
            <line x1="${bx.toFixed(1)}" y1="${by.toFixed(1)}" x2="${(bx + Math.cos(p) * 26).toFixed(1)}" y2="${(by + Math.sin(p) * 26).toFixed(1)}"/>
            <line x1="${bx.toFixed(1)}" y1="${by.toFixed(1)}" x2="${(bx + Math.cos(m) * 26).toFixed(1)}" y2="${(by + Math.sin(m) * 26).toFixed(1)}"/>`;
  }).join('')}
  </g>`);

/** Star sparkle / four-point twinkle. */
const sparkle = svg(256, `
  ${GLOSS}`, `
  <circle cx="100" cy="100" r="70" fill="url(#hi)" opacity=".55"/>
  <path d="M100 12 C110 74 126 90 188 100 C126 110 110 126 100 188 C90 126 74 110 12 100 C74 90 90 74 100 12Z"
        fill="#ffffff"/>`);

/** Ember / flame mote for the gothic style. */
const ember = svg(256, `
  <radialGradient id="em" cx="50%" cy="60%" r="50%">
    <stop offset="0%"  stop-color="#fff1c4"/>
    <stop offset="35%" stop-color="#ff9a3c" stop-opacity=".9"/>
    <stop offset="70%" stop-color="#c2410c" stop-opacity=".45"/>
    <stop offset="100%" stop-color="#7c2d12" stop-opacity="0"/>
  </radialGradient>`, `
  <circle cx="100" cy="100" r="94" fill="url(#em)"/>
  <ellipse cx="100" cy="92" rx="18" ry="30" fill="#fff6d8" opacity=".8"/>`);

/** Chrome bezel ring for framing avatars. */
const chromeRing = svg(320, `
  <linearGradient id="cr" x1="0" y1="0" x2="0.7" y2="1">
    <stop offset="0%"  stop-color="#ffffff"/>
    <stop offset="18%" stop-color="#9a9ab4"/>
    <stop offset="38%" stop-color="#f4f4fa"/>
    <stop offset="58%" stop-color="#6c6c86"/>
    <stop offset="78%" stop-color="#e4e4ee"/>
    <stop offset="100%" stop-color="#4a4a60"/>
  </linearGradient>`, `
  <circle cx="100" cy="100" r="92" fill="none" stroke="url(#cr)" stroke-width="15"/>
  <circle cx="100" cy="100" r="99" fill="none" stroke="#ffffff" stroke-opacity=".55"/>
  <circle cx="100" cy="100" r="84" fill="none" stroke="#1a1526" stroke-opacity=".45"/>`);

/** Aero lozenge — the glossy pill used as a plaque/badge base. */
const lozenge = (c1, c2) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="192" viewBox="0 0 400 150">
  <defs>
    <linearGradient id="lz" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="${c1}"/>
      <stop offset="49%" stop-color="${c2}"/>
      <stop offset="51%" stop-color="${c2}" stop-opacity=".82"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity=".92"/>
    </linearGradient>
    <linearGradient id="lzhi" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#ffffff" stop-opacity=".78"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity=".05"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="388" height="138" rx="69" fill="url(#lz)"/>
  <rect x="6" y="6" width="388" height="138" rx="69" fill="none" stroke="#ffffff" stroke-opacity=".7" stroke-width="3"/>
  <path d="M20 66 Q200 4 380 66 Q200 96 20 66Z" fill="url(#lzhi)"/>
</svg>`;

/** Soft radial glow used for bloom overlays. */
const glow = (c) => svg(256, `
  <radialGradient id="g" cx="50%" cy="50%" r="50%">
    <stop offset="0%"  stop-color="${c}" stop-opacity=".85"/>
    <stop offset="45%" stop-color="${c}" stop-opacity=".28"/>
    <stop offset="100%" stop-color="${c}" stop-opacity="0"/>
  </radialGradient>`, `<circle cx="100" cy="100" r="100" fill="url(#g)"/>`);

export const DECALS = {
  'bubble-aqua': bubble('#7dd3fc', '#a5f3fc'),
  'bubble-violet': bubble('#c4b5fd', '#f0abfc'),
  'bubble-mint': bubble('#a7f3d0', '#bef264'),
  'orb-violet': orb('#c084fc', '#7c3aed'),
  'orb-aqua': orb('#7dd3fc', '#0ea5e9'),
  'orb-rose': orb('#fda4af', '#e11d48'),
  'orb-lime': orb('#bef264', '#4d7c0f'),
  droplet,
  leaf,
  'cloud-puff': cloudPuff,
  rainbow,
  snowflake,
  sparkle,
  ember,
  'chrome-ring': chromeRing,
  'lozenge-violet': lozenge('#a855f7', '#e879f9'),
  'lozenge-aqua': lozenge('#0ea5e9', '#67e8f9'),
  'glow-violet': glow('#a855f7'),
  'glow-aqua': glow('#22d3ee'),
  'glow-amber': glow('#fbbf24'),
};
