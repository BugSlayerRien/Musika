/* ============================================================
   MUSIKA — Profile customisation vocabulary
   Everything the Profile Studio can change lives here: the
   palettes, emblems, frames, sceneries, cursors, titles and
   badges. Adding an option is a one-line change.
   ============================================================ */

/* ---------------- Aura palettes ---------------- */
export const AURA_PRESETS = [
  { id: 'amethyst', label: 'Amethyst Bloom', colors: ['#8b5cf6', '#e879f9', '#22d3ee', '#a7f3d0'] },
  { id: 'orchid', label: 'Orchid Static', colors: ['#a855f7', '#f0abfc', '#7dd3fc', '#fbcfe8'] },
  { id: 'nebula', label: 'Nebula Drift', colors: ['#6d28d9', '#db2777', '#0ea5e9', '#c4b5fd'] },
  { id: 'lagoon', label: 'Lagoon Glass', colors: ['#7c3aed', '#22d3ee', '#5eead4', '#bae6fd'] },
  { id: 'sunset', label: 'Cassette Sunset', colors: ['#9333ea', '#fb7185', '#fbbf24', '#fda4af'] },
  { id: 'mint', label: 'Mint Chrome', colors: ['#8b5cf6', '#34d399', '#a5f3fc', '#d9f99d'] },
  { id: 'bubblegum', label: 'Bubblegum CD', colors: ['#c026d3', '#f472b6', '#60a5fa', '#fbcfe8'] },
  { id: 'deepsea', label: 'Deep Sea Screensaver', colors: ['#4c1d95', '#2563eb', '#06b6d4', '#a78bfa'] },
  { id: 'ultraviolet', label: 'Ultraviolet', colors: ['#7e22ce', '#a21caf', '#4f46e5', '#e9d5ff'] },
  { id: 'holo', label: 'Holo Sticker', colors: ['#a78bfa', '#fca5a5', '#7dd3fc', '#fde68a'] },
];

/* ---------------- Avatar orb: patterns ---------------- */
export const ORB_PATTERNS = [
  { id: 'bubble', label: 'Bubble' },
  { id: 'swirl', label: 'Swirl' },
  { id: 'prism', label: 'Prism' },
  { id: 'wave', label: 'Wave' },
  { id: 'starburst', label: 'Starburst' },
  { id: 'grid', label: 'Grid' },
  { id: 'droplet', label: 'Droplet' },
  { id: 'nebula', label: 'Nebula' },
];

/* ---------------- Avatar orb: emblems ---------------- */
export const EMBLEMS = [
  '♪', '♫', '★', '✦', '❋', '☂', '⚡', '☾', '✿', '❤', '☀', '⌘',
  '◈', '☁', '♬', '✈', '⚓', '☕', '✧', '⚙', '♠', '☘', '✺', '❄',
];

/* ---------------- Avatar frames ---------------- */
export const FRAMES = [
  { id: 'none', label: 'Bare' },
  { id: 'chrome', label: 'Chrome Bezel' },
  { id: 'iris', label: 'Iridescent Ring' },
  { id: 'glow', label: 'Aura Glow' },
  { id: 'orbit', label: 'Orbit Ring' },
  { id: 'bubbleframe', label: 'Bubble Cluster' },
];

/* ---------------- Cursor styles ---------------- */
export const CURSORS = [
  { id: 'none', label: 'System', blurb: 'No trail. Just the pointer.' },
  { id: 'sparkle', label: 'Sparkle Trail', blurb: 'Iridescent motes falling behind the cursor.' },
  { id: 'bubbletrail', label: 'Bubble Trail', blurb: 'Tiny bubbles that rise and pop.' },
  { id: 'comet', label: 'Comet', blurb: 'A single glowing tail.' },
];

/* ---------------- Member titles (flair under the name) ---------------- */
export const TITLES = [
  'Crate Digger', 'Archivist', 'Karaoke Champion', 'Liner-Notes Reader',
  'Bootleg Historian', 'Radio Ghost', 'Cassette Rewinder', 'Setlist Keeper',
  'Scene Reporter', 'Sleeve Collector', 'First Pressing', 'Night Shift DJ',
];

/* ---------------- Badges ---------------- */
export const BADGES = [
  { id: 'founder', label: 'Founding Member', icon: '✦', blurb: 'Here before the first hundred entries.', tone: 'iris' },
  { id: 'curator', label: 'Curator', icon: '★', blurb: 'Ten submissions accepted into the atlas.', tone: 'gold' },
  { id: 'archivist', label: 'Archivist', icon: '❋', blurb: 'Added liner notes to twenty-five entries.', tone: 'violet' },
  { id: 'globetrotter', label: 'Globetrotter', icon: '✈', blurb: 'Filed songs from five different countries.', tone: 'aqua' },
  { id: 'opm', label: 'OPM Corner', icon: '☀', blurb: 'Championed the Philippine room.', tone: 'gold' },
  { id: 'nightowl', label: 'Night Shift', icon: '☾', blurb: 'Listened past 3am, repeatedly.', tone: 'violet' },
  { id: 'firstpress', label: 'First Pressing', icon: '◈', blurb: 'Submitted a song nobody else had filed.', tone: 'mint' },
  { id: 'crooner', label: 'Crooner', icon: '♪', blurb: 'Built a ballads-only rotation. No regrets.', tone: 'aqua' },
  { id: 'loudest', label: 'Loudest in the Room', icon: '⚡', blurb: 'Volume defaults set irresponsibly high.', tone: 'gold' },
];

export const badgeById = (id) => BADGES.find((b) => b.id === id);

/* ---------------- Profile module registry ----------------
   The Studio lets a member choose which panels appear on their
   public profile, and in what order.
   -------------------------------------------------------- */
export const PROFILE_MODULES = [
  { id: 'anthems', label: 'Top Five Anthems', blurb: 'Your permanent rotation, pinned.' },
  { id: 'submissions', label: 'Submissions', blurb: 'Songs you filed into the atlas.' },
  { id: 'passport', label: 'Country Passport', blurb: 'Every scene you have listened through.' },
  { id: 'badges', label: 'Badge Shelf', blurb: 'What you have earned.' },
  { id: 'stats', label: 'Listening Stats', blurb: 'Numbers, decades, genres.' },
  { id: 'guestbook', label: 'Guestbook', blurb: 'A wall for other members to sign.' },
  { id: 'nowspinning', label: 'Now Spinning', blurb: 'What you last had on.' },
];

/* ---------------- Community members ----------------
   Handles used as submitters across the catalogue.
   -------------------------------------------------------- */
export const MEMBERS = [
  { handle: 'kuyaramon', name: 'Ramon D.', country: 'ph', title: 'Bootleg Historian', badges: ['founder', 'opm', 'archivist'], orb: { pattern: 'swirl', emblem: '♪', colors: ['#8b5cf6', '#22d3ee'], frame: 'iris' } },
  { handle: 'circusgirl', name: 'Bea', country: 'ph', title: 'Crate Digger', badges: ['curator', 'opm'], orb: { pattern: 'bubble', emblem: '✦', colors: ['#e879f9', '#8b5cf6'], frame: 'glow' } },
  { handle: 'titasofmanila', name: 'Tita Elsa', country: 'ph', title: 'Karaoke Champion', badges: ['crooner', 'opm'], orb: { pattern: 'starburst', emblem: '❤', colors: ['#fb7185', '#a855f7'], frame: 'chrome' } },
  { handle: 'ridethewave', name: 'Migs', country: 'ph', title: 'Setlist Keeper', badges: ['globetrotter'], orb: { pattern: 'wave', emblem: '☂', colors: ['#22d3ee', '#7c3aed'], frame: 'orbit' } },
  { handle: 'sugbuanon', name: 'Kiko', country: 'ph', title: 'Scene Reporter', badges: ['firstpress', 'opm'], orb: { pattern: 'prism', emblem: '⚡', colors: ['#a855f7', '#fbbf24'], frame: 'glow' } },
  { handle: 'videokeking', name: 'Boy V.', country: 'ph', title: 'Karaoke Champion', badges: ['crooner'], orb: { pattern: 'grid', emblem: '♬', colors: ['#f472b6', '#60a5fa'], frame: 'chrome' } },
  { handle: 'metalpinoy', name: 'Dex', country: 'ph', title: 'Loudest in the Room', badges: ['loudest'], orb: { pattern: 'starburst', emblem: '⚡', colors: ['#7c3aed', '#f43f5e'], frame: 'none' } },
  { handle: 'reverbdiwata', name: 'Anj', country: 'ph', title: 'Radio Ghost', badges: ['archivist', 'nightowl'], orb: { pattern: 'nebula', emblem: '☾', colors: ['#a78bfa', '#5eead4'], frame: 'iris' } },
  { handle: 'nordicpop', name: 'Elin', country: 'se', title: 'Liner-Notes Reader', badges: ['curator', 'globetrotter'], orb: { pattern: 'droplet', emblem: '❄', colors: ['#6366f1', '#22d3ee'], frame: 'chrome' } },
  { handle: 'halmstadhifi', name: 'Petter', country: 'se', title: 'Sleeve Collector', badges: ['archivist'], orb: { pattern: 'grid', emblem: '◈', colors: ['#818cf8', '#a5f3fc'], frame: 'orbit' } },
  { handle: 'vinylnina', name: 'Nina', country: 'se', title: 'First Pressing', badges: ['firstpress'], orb: { pattern: 'swirl', emblem: '★', colors: ['#c084fc', '#f0abfc'], frame: 'iris' } },
  { handle: 'osloarcade', name: 'Sindre', country: 'no', title: 'Night Shift DJ', badges: ['nightowl'], orb: { pattern: 'prism', emblem: '✧', colors: ['#818cf8', '#67e8f9'], frame: 'glow' } },
  { handle: 'reykjavikrain', name: 'Hulda', country: 'is', title: 'Archivist', badges: ['archivist', 'globetrotter'], orb: { pattern: 'wave', emblem: '☁', colors: ['#a78bfa', '#5eead4'], frame: 'bubbleframe' } },
  { handle: 'haagsebeat', name: 'Joost', country: 'nl', title: 'Crate Digger', badges: ['curator'], orb: { pattern: 'bubble', emblem: '⚓', colors: ['#f97316', '#c084fc'], frame: 'chrome' } },
  { handle: 'limerickfm', name: 'Aoife', country: 'ie', title: 'Radio Ghost', badges: ['nightowl'], orb: { pattern: 'droplet', emblem: '☘', colors: ['#34d399', '#a78bfa'], frame: 'glow' } },
  { handle: 'dublinsteel', name: 'Cormac', country: 'ie', title: 'Setlist Keeper', badges: [], orb: { pattern: 'grid', emblem: '♠', colors: ['#94a3b8', '#a78bfa'], frame: 'none' } },
  { handle: 'hannoverhaus', name: 'Ute', country: 'de', title: 'Liner-Notes Reader', badges: ['curator'], orb: { pattern: 'prism', emblem: '⚙', colors: ['#facc15', '#a855f7'], frame: 'chrome' } },
  { handle: 'berlinwelle', name: 'Jonas', country: 'de', title: 'Scene Reporter', badges: [], orb: { pattern: 'starburst', emblem: '✦', colors: ['#f43f5e', '#a855f7'], frame: 'orbit' } },
  { handle: 'aucklandjangle', name: 'Tama', country: 'nz', title: 'Crate Digger', badges: ['globetrotter'], orb: { pattern: 'wave', emblem: '✿', colors: ['#22d3ee', '#86efac'], frame: 'glow' } },
  { handle: 'sydneypub', name: 'Marnie', country: 'au', title: 'Loudest in the Room', badges: ['loudest'], orb: { pattern: 'swirl', emblem: '⚡', colors: ['#fb923c', '#a78bfa'], frame: 'none' } },
  { handle: 'winnipegwax', name: 'Dale', country: 'ca', title: 'Sleeve Collector', badges: ['archivist'], orb: { pattern: 'bubble', emblem: '❋', colors: ['#f87171', '#93c5fd'], frame: 'chrome' } },
  { handle: 'torontoprog', name: 'Priya', country: 'ca', title: 'Liner-Notes Reader', badges: ['curator', 'nightowl'], orb: { pattern: 'nebula', emblem: '✺', colors: ['#a78bfa', '#f0abfc'], frame: 'iris' } },
  { handle: 'osakavolt', name: 'Rei', country: 'jp', title: 'First Pressing', badges: ['firstpress', 'loudest'], orb: { pattern: 'starburst', emblem: '★', colors: ['#f472b6', '#818cf8'], frame: 'orbit' } },
  { handle: 'jakartafuzz', name: 'Sari', country: 'id', title: 'Crate Digger', badges: ['globetrotter', 'archivist'], orb: { pattern: 'prism', emblem: '☀', colors: ['#fb7185', '#5eead4'], frame: 'glow' } },
  { handle: 'kampongsurf', name: 'Wei Lin', country: 'sg', title: 'Archivist', badges: ['firstpress'], orb: { pattern: 'wave', emblem: '✈', colors: ['#f43f5e', '#38bdf8'], frame: 'bubbleframe' } },
  { handle: 'delhistage', name: 'Arjun', country: 'in', title: 'Scene Reporter', badges: [], orb: { pattern: 'grid', emblem: '♫', colors: ['#fb923c', '#4ade80'], frame: 'chrome' } },
  { handle: 'lagosgroove', name: 'Chidi', country: 'ng', title: 'Setlist Keeper', badges: ['curator'], orb: { pattern: 'swirl', emblem: '☀', colors: ['#22c55e', '#facc15'], frame: 'glow' } },
  { handle: 'joburgcrossing', name: 'Thandi', country: 'za', title: 'Archivist', badges: ['globetrotter'], orb: { pattern: 'nebula', emblem: '✦', colors: ['#facc15', '#34d399'], frame: 'iris' } },
  { handle: 'bhpercussao', name: 'Rafa', country: 'br', title: 'Loudest in the Room', badges: ['loudest'], orb: { pattern: 'starburst', emblem: '⚡', colors: ['#4ade80', '#a78bfa'], frame: 'none' } },
  { handle: 'milanoprog', name: 'Giulia', country: 'it', title: 'Liner-Notes Reader', badges: ['archivist'], orb: { pattern: 'prism', emblem: '◈', colors: ['#f43f5e', '#c084fc'], frame: 'chrome' } },
  { handle: 'versaillestape', name: 'Camille', country: 'fr', title: 'Night Shift DJ', badges: ['nightowl', 'curator'], orb: { pattern: 'droplet', emblem: '☾', colors: ['#818cf8', '#f472b6'], frame: 'orbit' } },
  { handle: 'helsinkigloom', name: 'Ville', country: 'fi', title: 'Bootleg Historian', badges: ['archivist'], orb: { pattern: 'nebula', emblem: '❄', colors: ['#60a5fa', '#a78bfa'], frame: 'glow' } },
  { handle: 'kobenhavnkid', name: 'Freja', country: 'dk', title: 'Karaoke Champion', badges: ['crooner'], orb: { pattern: 'bubble', emblem: '♬', colors: ['#f472b6', '#38bdf8'], frame: 'bubbleframe' } },
  { handle: 'athenspsych', name: 'Nikos', country: 'gr', title: 'Crate Digger', badges: ['firstpress'], orb: { pattern: 'swirl', emblem: '✧', colors: ['#38bdf8', '#fef08a'], frame: 'iris' } },
  { handle: 'warszawaprog', name: 'Kasia', country: 'pl', title: 'Liner-Notes Reader', badges: ['curator'], orb: { pattern: 'grid', emblem: '⚙', colors: ['#f87171', '#94a3b8'], frame: 'chrome' } },
  { handle: 'madridgarage', name: 'Álvaro', country: 'es', title: 'Scene Reporter', badges: [], orb: { pattern: 'prism', emblem: '★', colors: ['#fbbf24', '#f43f5e'], frame: 'none' } },
];

export const memberByHandle = (handle) => MEMBERS.find((m) => m.handle === handle);

/* ---------------- The signed-in member's starting state ---------------- */
export const DEFAULT_PROFILE = {
  /* identity */
  handle: 'newlistener',
  name: 'New Listener',
  pronouns: '',
  country: 'ph',
  title: 'Crate Digger',
  bio: 'Just arrived. Filing the classics my parents played in the car — English songs by bands from home.',
  link: '',

  /* avatar orb */
  orb: {
    pattern: 'bubble',
    emblem: '♪',
    colors: ['#8b5cf6', '#22d3ee'],
    frame: 'iris',
    spin: true,
  },

  /* look — a style writes most of this in one go, then any of it
     can be overridden individually from the Studio */
  theme: {
    style: 'amethyst',
    auraColors: ['#8b5cf6', '#e879f9', '#22d3ee', '#a7f3d0'],
    auraAngle: 135,
    auraIntensity: 1,
    scene: ['#2a0f57', '#120632', '#3d1b7a'],
    ink: 'light',
    radiusScale: 1,
    typeface: 'aero',

    /* wallpaper */
    wallpaper: true,
    wallpaperDim: 0.34,
    wallpaperBlur: 0,

    /* glass */
    glass: true,
    glassBlur: 18,
    panelAlpha: 0.42,
    panelTint: '26, 10, 54',

    /* weather */
    particle: 'bubble',
    particleCount: 26,
    flares: true,
    caustics: true,
    scanlines: false,
    aurora: true,

    density: 'cozy',
    motion: 'full',
    cursor: 'sparkle',
  },

  /* audio */
  audio: {
    enabled: true,
    pack: 'aqua',
    uiVolume: 0.55,
    musicVolume: 0.5,
    ambience: false,
    hoverSounds: true,
    navSounds: true,
    bootChime: true,
  },

  /* profile page composition */
  modules: ['anthems', 'nowspinning', 'submissions', 'passport', 'badges', 'stats', 'guestbook'],

  /* collections */
  anthems: ['ph-dawn-enveloped', 'se-abba-dancingqueen', 'ie-cranberries-linger', 'no-aha-takeonme', 'ph-rivermaya-safe'],
  hearted: ['ph-eheads-julie', 'nl-shockingblue-venus', 'fr-phoenix-1901'],
  badges: ['founder'],
  submissions: [],
  guestbook: [
    { by: 'kuyaramon', text: 'Welcome to the atlas. Start with the 1986 shelf.', daysAgo: 3 },
    { by: 'nordicpop', text: 'Filed your first country yet? The Philippine room is the best one.', daysAgo: 1 },
  ],
  visited: ['ph', 'se', 'ie', 'no'],
};
