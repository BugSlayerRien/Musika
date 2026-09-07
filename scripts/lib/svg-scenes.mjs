/* ============================================================
   MUSIKA — scene artwork, authored as SVG
   ------------------------------------------------------------
   These are the source drawings for the PNG backgrounds in
   public/aero/bg. Everything is drawn here rather than sourced
   from an archive, so the whole set is ours to ship, recolour
   and regenerate at any size.

   Each scene is a function returning an SVG string for the
   requested width/height.
   ============================================================ */

const W = 1600;
const H = 900;

/* ---------- shared drawing helpers ---------- */

/** Soft cumulus cloud built from overlapping blurred lozenges. */
function cloud(x, y, scale = 1, opacity = 0.95, tint = '#ffffff') {
  const s = (n) => (n * scale).toFixed(1);
  return `
  <g transform="translate(${x} ${y})" opacity="${opacity}" filter="url(#cloudSoft)">
    <ellipse cx="0"        cy="0"       rx="${s(150)}" ry="${s(46)}"  fill="${tint}"/>
    <ellipse cx="${s(-70)}" cy="${s(-18)}" rx="${s(78)}"  ry="${s(52)}"  fill="${tint}"/>
    <ellipse cx="${s(10)}"  cy="${s(-42)}" rx="${s(96)}"  ry="${s(66)}"  fill="${tint}"/>
    <ellipse cx="${s(92)}"  cy="${s(-14)}" rx="${s(70)}"  ry="${s(44)}"  fill="${tint}"/>
    <ellipse cx="${s(-140)}" cy="${s(10)}"  rx="${s(56)}"  ry="${s(30)}"  fill="${tint}"/>
  </g>`;
}

/** A field of clouds with depth: small and pale at the back. */
function cloudBank(seed = 1, count = 9, band = [80, 420], tint = '#ffffff') {
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  let out = '';
  for (let i = 0; i < count; i++) {
    const depth = rnd();
    const x = rnd() * (W + 400) - 200;
    const y = band[0] + rnd() * (band[1] - band[0]);
    out += cloud(x, y, 0.45 + depth * 1.05, 0.28 + depth * 0.62, tint);
  }
  return out;
}

/** Bubbles with a specular dot — the single most Aero object there is. */
function bubbleField(seed = 7, count = 26, tint = '#ffffff', area = [0, 0, W, H]) {
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  let out = '';
  for (let i = 0; i < count; i++) {
    const r = 8 + rnd() * 62;
    const cx = area[0] + rnd() * (area[2] - area[0]);
    const cy = area[1] + rnd() * (area[3] - area[1]);
    const o = 0.18 + rnd() * 0.5;
    out += `
    <g opacity="${o.toFixed(2)}">
      <circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="url(#bubbleFill)"/>
      <circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="none" stroke="${tint}" stroke-opacity=".55"/>
      <ellipse cx="${(cx - r * 0.34).toFixed(0)}" cy="${(cy - r * 0.4).toFixed(0)}"
               rx="${(r * 0.26).toFixed(0)}" ry="${(r * 0.18).toFixed(0)}" fill="${tint}" opacity=".85"/>
    </g>`;
  }
  return out;
}

/** Reusable defs every scene can reference. */
const commonDefs = `
  <radialGradient id="bubbleFill" cx="34%" cy="30%" r="72%">
    <stop offset="0%"  stop-color="#ffffff" stop-opacity=".55"/>
    <stop offset="42%" stop-color="#ffffff" stop-opacity=".05"/>
    <stop offset="82%" stop-color="#ffffff" stop-opacity=".22"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity=".04"/>
  </radialGradient>
  <filter id="cloudSoft" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="7"/>
  </filter>
  <filter id="soft" x="-25%" y="-25%" width="150%" height="150%">
    <feGaussianBlur stdDeviation="26"/>
  </filter>
  <filter id="softer" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="58"/>
  </filter>
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n"/>
    <feColorMatrix in="n" type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.035"/></feComponentTransfer>
  </filter>`;

/** Dither layer — smooth gradients band badly once quantised to PNG. */
const grain = `<rect width="${W}" height="${H}" filter="url(#grain)" opacity=".55"/>`;

const frame = (defs, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>${commonDefs}${defs}</defs>
${body}
${grain}
</svg>`;

/* ============================================================
   The scenes
   ============================================================ */

export const SCENES = {
  /* ---- Classic Frutiger Aero: sky, water, bubbles ---- */
  aqua: () => frame(`
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#0a3f8f"/>
      <stop offset="30%" stop-color="#1e7fd4"/>
      <stop offset="58%" stop-color="#63c3f0"/>
      <stop offset="72%" stop-color="#bde9fb"/>
      <stop offset="100%" stop-color="#e9f8ff"/>
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#7fdcf7"/>
      <stop offset="22%" stop-color="#1c93cf"/>
      <stop offset="70%" stop-color="#0b5896"/>
      <stop offset="100%" stop-color="#062f63"/>
    </linearGradient>
    <radialGradient id="sun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity=".95"/>
      <stop offset="55%" stop-color="#cdf0ff" stop-opacity=".35"/>
      <stop offset="100%" stop-color="#cdf0ff" stop-opacity="0"/>
    </radialGradient>`, `
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    <circle cx="1180" cy="250" r="360" fill="url(#sun)"/>
    ${cloudBank(3, 10, [70, 400])}
    <rect y="620" width="${W}" height="${H - 620}" fill="url(#sea)"/>
    <ellipse cx="1180" cy="640" rx="420" ry="34" fill="#ffffff" opacity=".55" filter="url(#soft)"/>
    <g opacity=".5">
      <rect y="618" width="${W}" height="5" fill="#ffffff" opacity=".8"/>
      <ellipse cx="900" cy="720" rx="620" ry="16" fill="#bfefff" opacity=".5"/>
      <ellipse cx="500" cy="800" rx="520" ry="14" fill="#bfefff" opacity=".4"/>
      <ellipse cx="1200" cy="860" rx="480" ry="12" fill="#bfefff" opacity=".35"/>
    </g>
    ${bubbleField(11, 30, '#ffffff', [0, 120, W, H])}`),

  /* ---- Bliss-adjacent: impossible green hills ---- */
  meadow: () => frame(`
    <linearGradient id="msky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#1567c8"/>
      <stop offset="42%" stop-color="#63b8ef"/>
      <stop offset="78%" stop-color="#cfeeff"/>
      <stop offset="100%" stop-color="#f2fbff"/>
    </linearGradient>
    <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#8fd94a"/>
      <stop offset="45%" stop-color="#4fae2e"/>
      <stop offset="100%" stop-color="#237a22"/>
    </linearGradient>
    <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#b6ea6a"/>
      <stop offset="100%" stop-color="#4d9c2c"/>
    </linearGradient>
    <radialGradient id="msun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fffef0" stop-opacity="1"/>
      <stop offset="40%" stop-color="#fff8c8" stop-opacity=".5"/>
      <stop offset="100%" stop-color="#fff8c8" stop-opacity="0"/>
    </radialGradient>`, `
    <rect width="${W}" height="${H}" fill="url(#msky)"/>
    <circle cx="330" cy="180" r="300" fill="url(#msun)"/>
    ${cloudBank(9, 11, [60, 380])}
    <path d="M0 640 C 260 560 520 596 780 636 C 1060 680 1320 636 1600 588 L1600 900 L0 900Z" fill="url(#hill2)" opacity=".9"/>
    <path d="M0 726 C 300 646 640 700 940 742 C 1200 778 1420 754 1600 720 L1600 900 L0 900Z" fill="url(#hill1)"/>
    <ellipse cx="800" cy="660" rx="900" ry="60" fill="#ffffff" opacity=".22" filter="url(#soft)"/>
    ${bubbleField(21, 16, '#ffffff', [0, 80, W, 640])}`),

  /* ---- Below the surface ---- */
  lagoon: () => frame(`
    <linearGradient id="deep" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#7ff0f5"/>
      <stop offset="20%" stop-color="#1fb6d8"/>
      <stop offset="58%" stop-color="#0a5f95"/>
      <stop offset="100%" stop-color="#03203f"/>
    </linearGradient>
    <linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity=".55"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>`, `
    <rect width="${W}" height="${H}" fill="url(#deep)"/>
    <g filter="url(#soft)" opacity=".8">
      <polygon points="300,0 420,0 620,900 380,900" fill="url(#shaft)"/>
      <polygon points="760,0 850,0 1010,900 830,900" fill="url(#shaft)" opacity=".7"/>
      <polygon points="1180,0 1310,0 1420,900 1200,900" fill="url(#shaft)" opacity=".55"/>
    </g>
    <ellipse cx="800" cy="-40" rx="1000" ry="180" fill="#ffffff" opacity=".5" filter="url(#soft)"/>
    ${bubbleField(31, 42, '#ffffff', [0, 60, W, H])}`),

  /* ---- The house palette: purple aurora ---- */
  amethyst: () => frame(`
    <linearGradient id="void" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#2a0f57"/>
      <stop offset="55%" stop-color="#16082f"/>
      <stop offset="100%" stop-color="#0b0320"/>
    </linearGradient>
    <radialGradient id="a1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity=".95"/>
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="a2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e879f9" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#e879f9" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="a3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity=".7"/>
      <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>`, `
    <rect width="${W}" height="${H}" fill="url(#void)"/>
    <ellipse cx="380" cy="200" rx="620" ry="460" fill="url(#a1)" filter="url(#softer)"/>
    <ellipse cx="1300" cy="700" rx="560" ry="420" fill="url(#a2)" filter="url(#softer)"/>
    <ellipse cx="900" cy="360" rx="500" ry="300" fill="url(#a3)" filter="url(#softer)" opacity=".8"/>
    ${bubbleField(5, 30, '#ffffff', [0, 0, W, H])}`),

  /* ---- Magenta dusk ---- */
  sunset: () => frame(`
    <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#2b0b4a"/>
      <stop offset="35%" stop-color="#8f2a86"/>
      <stop offset="62%" stop-color="#e35d8a"/>
      <stop offset="82%" stop-color="#ffa06b"/>
      <stop offset="100%" stop-color="#ffd8a0"/>
    </linearGradient>
    <linearGradient id="dwater" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#ff9f7a" stop-opacity=".9"/>
      <stop offset="35%" stop-color="#a3357f"/>
      <stop offset="100%" stop-color="#2a0942"/>
    </linearGradient>
    <radialGradient id="dsun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff3c4"/>
      <stop offset="48%" stop-color="#ffb072" stop-opacity=".65"/>
      <stop offset="100%" stop-color="#ffb072" stop-opacity="0"/>
    </radialGradient>`, `
    <rect width="${W}" height="${H}" fill="url(#dusk)"/>
    <circle cx="800" cy="640" r="330" fill="url(#dsun)"/>
    <circle cx="800" cy="640" r="96" fill="#fff6d8" opacity=".95"/>
    ${cloudBank(15, 8, [120, 460], '#ffd6e8')}
    <rect y="660" width="${W}" height="240" fill="url(#dwater)"/>
    <g opacity=".55">
      <ellipse cx="800" cy="700" rx="180" ry="7" fill="#ffe6b0"/>
      <ellipse cx="800" cy="740" rx="240" ry="8" fill="#ffd0a0" opacity=".8"/>
      <ellipse cx="800" cy="790" rx="320" ry="9" fill="#ffc0a0" opacity=".6"/>
      <ellipse cx="800" cy="850" rx="420" ry="10" fill="#ffb0a0" opacity=".45"/>
    </g>
    ${bubbleField(41, 18, '#ffe9d6', [0, 60, W, 660])}`),

  /* ---- Y2K brushed metal ---- */
  chrome: () => frame(`
    <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#4a4a5e"/>
      <stop offset="22%" stop-color="#c3c3d4"/>
      <stop offset="34%" stop-color="#8e8ea6"/>
      <stop offset="50%" stop-color="#e8e8f2"/>
      <stop offset="66%" stop-color="#7c7c94"/>
      <stop offset="82%" stop-color="#b6b6c8"/>
      <stop offset="100%" stop-color="#3a3a4c"/>
    </linearGradient>
    <filter id="brush">
      <feTurbulence type="fractalNoise" baseFrequency="0.002 0.85" numOctaves="3" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="14" xChannelSelector="R" yChannelSelector="G"/>
    </filter>`, `
    <rect width="${W}" height="${H}" fill="url(#metal)" filter="url(#brush)"/>
    <rect width="${W}" height="${H}" fill="#171622" opacity=".55"/>
    <ellipse cx="800" cy="120" rx="900" ry="220" fill="#ffffff" opacity=".18" filter="url(#soft)"/>`),

  /* ---- Gothic: cathedral dark, stained glass bloom ---- */
  gothic: () => frame(`
    <linearGradient id="nave" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#160a24"/>
      <stop offset="45%" stop-color="#0d0616"/>
      <stop offset="100%" stop-color="#05020b"/>
    </linearGradient>
    <radialGradient id="rose" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stop-color="#f0d9ff" stop-opacity=".9"/>
      <stop offset="18%" stop-color="#a855f7" stop-opacity=".7"/>
      <stop offset="42%" stop-color="#7e22ce" stop-opacity=".38"/>
      <stop offset="70%" stop-color="#4c1d95" stop-opacity=".16"/>
      <stop offset="100%" stop-color="#4c1d95" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="candle" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffb765" stop-opacity=".75"/>
      <stop offset="100%" stop-color="#ffb765" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="pane" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c084fc" stop-opacity=".5"/>
      <stop offset="100%" stop-color="#c084fc" stop-opacity="0"/>
    </linearGradient>`, `
    <rect width="${W}" height="${H}" fill="url(#nave)"/>
    <ellipse cx="800" cy="300" rx="520" ry="500" fill="url(#rose)"/>
    <g opacity=".55" stroke="#e9d5ff" stroke-opacity=".35" fill="none" stroke-width="3">
      <circle cx="800" cy="300" r="150"/>
      <circle cx="800" cy="300" r="96"/>
      <circle cx="800" cy="300" r="44"/>
      ${Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return `<line x1="${800 + Math.cos(a) * 44}" y1="${300 + Math.sin(a) * 44}"
                    x2="${800 + Math.cos(a) * 150}" y2="${300 + Math.sin(a) * 150}"/>`;
  }).join('')}
    </g>
    <g opacity=".55">
      ${[170, 350, 1250, 1430].map((x, i) => `
        <path d="M${x} 900 L${x} 520 Q${x} 430 ${x + 60} 360 Q${x + 120} 430 ${x + 120} 520 L${x + 120} 900Z"
              fill="url(#pane)" opacity="${0.9 - i * 0.12}"/>
        <path d="M${x} 900 L${x} 520 Q${x} 430 ${x + 60} 360 Q${x + 120} 430 ${x + 120} 520 L${x + 120} 900Z"
              fill="none" stroke="#e9d5ff" stroke-opacity=".22" stroke-width="2"/>
        <line x1="${x + 60}" y1="380" x2="${x + 60}" y2="900" stroke="#e9d5ff" stroke-opacity=".16" stroke-width="2"/>`).join('')}
    </g>
    <g opacity=".7" fill="#05020b">
      ${[0, 1, 2, 3, 4, 5].map((i) => {
    const x = i * 320 - 40;
    return `<path d="M${x} 900 L${x} 640 Q${x} 560 ${x + 90} 486 Q${x + 180} 560 ${x + 180} 640 L${x + 180} 900Z" opacity=".0"/>`;
  }).join('')}
    </g>
    <ellipse cx="420" cy="800" rx="220" ry="160" fill="url(#candle)" filter="url(#soft)"/>
    <ellipse cx="1180" cy="840" rx="180" ry="130" fill="url(#candle)" filter="url(#soft)" opacity=".7"/>`),

  /* ---- Vaporwave grid ---- */
  vapor: () => frame(`
    <linearGradient id="vsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#150430"/>
      <stop offset="42%" stop-color="#5b1a7a"/>
      <stop offset="66%" stop-color="#c2337d"/>
      <stop offset="82%" stop-color="#ff7a6b"/>
      <stop offset="100%" stop-color="#ffcf6b"/>
    </linearGradient>
    <linearGradient id="vgrid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#2a0940"/>
      <stop offset="100%" stop-color="#0a0118"/>
    </linearGradient>
    <linearGradient id="vsun" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffe45e"/>
      <stop offset="55%" stop-color="#ff5f9e"/>
      <stop offset="100%" stop-color="#8b2fd6"/>
    </linearGradient>`, `
    <rect width="${W}" height="${H}" fill="url(#vsky)"/>
    <g>
      <circle cx="800" cy="560" r="250" fill="url(#vsun)"/>
      <g fill="#150430">
        ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="530" y="${560 + i * 34}" width="540" height="${6 + i * 4}"/>`).join('')}
      </g>
    </g>
    <rect y="620" width="${W}" height="280" fill="url(#vgrid)"/>
    <g stroke="#ff3ea5" stroke-opacity=".7" stroke-width="2" fill="none">
      ${Array.from({ length: 14 }, (_, i) => {
    const y = 620 + (i * i) * 1.6;
    return y < 900 ? `<line x1="0" y1="${y.toFixed(0)}" x2="${W}" y2="${y.toFixed(0)}"/>` : '';
  }).join('')}
      ${Array.from({ length: 25 }, (_, i) => {
    const x = (i - 12) * 260 + 800;
    return `<line x1="800" y1="620" x2="${x}" y2="900"/>`;
  }).join('')}
    </g>
    <ellipse cx="800" cy="620" rx="900" ry="40" fill="#ff9ad5" opacity=".35" filter="url(#soft)"/>`),

  /* ---- Cyber: dark slate, neon wire ---- */
  cyber: () => frame(`
    <linearGradient id="cbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="#05131a"/>
      <stop offset="52%" stop-color="#071b26"/>
      <stop offset="100%" stop-color="#02090e"/>
    </linearGradient>
    <radialGradient id="cglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity=".55"/>
      <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cglow2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a3e635" stop-opacity=".42"/>
      <stop offset="100%" stop-color="#a3e635" stop-opacity="0"/>
    </radialGradient>`, `
    <rect width="${W}" height="${H}" fill="url(#cbg)"/>
    <ellipse cx="260" cy="220" rx="520" ry="380" fill="url(#cglow)" filter="url(#softer)"/>
    <ellipse cx="1380" cy="720" rx="480" ry="360" fill="url(#cglow2)" filter="url(#softer)"/>
    <g stroke="#22d3ee" stroke-opacity=".16" stroke-width="1.5" fill="none">
      ${Array.from({ length: 19 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="${W}" y2="${i * 50}"/>`).join('')}
      ${Array.from({ length: 33 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${H}"/>`).join('')}
    </g>
    <g stroke="#a3e635" stroke-opacity=".5" stroke-width="2.5" fill="none">
      <path d="M0 700 L300 700 L360 640 L720 640 L780 700 L1180 700 L1240 620 L1600 620"/>
      <path d="M0 250 L420 250 L470 190 L900 190 L960 260 L1600 260" stroke="#22d3ee" stroke-opacity=".45"/>
    </g>`),

  /* ---- Frost: white ice glass ---- */
  frost: () => frame(`
    <linearGradient id="ice" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#9fd6f0"/>
      <stop offset="40%" stop-color="#dcf0fb"/>
      <stop offset="75%" stop-color="#f4fbff"/>
      <stop offset="100%" stop-color="#cfe6f4"/>
    </linearGradient>
    <radialGradient id="iglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>`, `
    <rect width="${W}" height="${H}" fill="url(#ice)"/>
    <ellipse cx="1150" cy="180" rx="520" ry="360" fill="url(#iglow)" filter="url(#softer)"/>
    <g stroke="#ffffff" stroke-opacity=".85" stroke-width="2" fill="none" opacity=".7">
      ${Array.from({ length: 7 }, (_, i) => {
    const cx = 160 + i * 240;
    const cy = 180 + ((i * 137) % 560);
    const r = 26 + ((i * 53) % 40);
    return Array.from({ length: 6 }, (_, k) => {
      const a = (k / 6) * Math.PI * 2;
      return `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * r).toFixed(0)}" y2="${(cy + Math.sin(a) * r).toFixed(0)}"/>`;
    }).join('');
  }).join('')}
    </g>
    ${bubbleField(61, 20, '#ffffff', [0, 0, W, H])}`),
};

export const SCENE_SIZE = { W, H };
