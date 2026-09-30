/* ============================================================
   MUSIKA — live radio
   ------------------------------------------------------------
   radio-browser.info is a community directory of ~50,000 live
   stations. Keyless, CORS-open, and the station data is public
   domain. Filtering by country code gives every room in the atlas
   a live dial to sit beside its shelf of classics.

   Three things their docs ask for, all handled here:

   1. Do not hardcode a server. Resolve the pool first and pick
      one, then remember it for the session.
   2. Be gentle — a few requests per second at most, and cache.
   3. Count a click when someone actually tunes in. That is how
      their popularity ordering stays meaningful, and we benefit
      from it when we sort by clickcount.

   The fourth thing, which their docs do NOT warn about but which
   breaks the feature in production: a large share of stations
   still stream over plain http. On an https deployment those are
   mixed content and the browser blocks them silently. Everything
   below is filtered to https before it reaches the UI.
   ============================================================ */

const SERVER_POOL = 'https://all.api.radio-browser.info/json/servers';
const FALLBACK = 'https://de1.api.radio-browser.info';
const SESSION_KEY = 'musika.radio.server';

/* No custom headers, deliberately.
   radio-browser's docs suggest identifying via X-User-Agent, but that
   turns the request into a preflighted one and their
   Access-Control-Allow-Headers does not list it — the browser then
   blocks every call. (curl does not preflight, so this only shows up
   in a real browser.) A plain header-free GET is a CORS "simple
   request", needs no preflight, and their Access-Control-Allow-Origin:*
   covers it. Identification is a nicety; working at all is not. */

let serverPromise = null;

/** Resolve a mirror once per session. */
export function radioServer() {
  if (serverPromise) return serverPromise;

  try {
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) {
      serverPromise = Promise.resolve(cached);
      return serverPromise;
    }
  } catch {
    /* private mode — just resolve fresh */
  }

  serverPromise = fetch(SERVER_POOL)
    .then((r) => (r.ok ? r.json() : []))
    .then((list) => {
      const names = (list ?? []).map((s) => s.name).filter(Boolean);
      const pick = names.length
        ? `https://${names[Math.floor(Math.random() * names.length)]}`
        : FALLBACK;
      try {
        sessionStorage.setItem(SESSION_KEY, pick);
      } catch {
        /* ignore */
      }
      return pick;
    })
    .catch(() => FALLBACK);

  return serverPromise;
}

/**
 * Only https streams can play on an https page. This is the single
 * most important line in the file: without it the dial looks fine,
 * lists stations, and plays nothing once deployed.
 */
const isPlayable = (station) => {
  const url = station.url_resolved || station.url || '';
  return url.startsWith('https:');
};

const shape = (s) => ({
  id: s.stationuuid,
  name: (s.name || '').trim() || 'Unnamed station',
  url: s.url_resolved || s.url,
  homepage: s.homepage || null,
  favicon: s.favicon || null,
  codec: s.codec || null,
  bitrate: s.bitrate || 0,
  tags: (s.tags || '').split(',').map((t) => t.trim()).filter(Boolean).slice(0, 4),
  language: (s.language || '').split(',')[0].trim() || null,
  votes: s.votes ?? 0,
  clicks: s.clickcount ?? 0,
});

const cache = new Map();

/**
 * Stations for one country, most-listened first.
 * Returns [] rather than throwing — a dead directory should
 * degrade to an empty shelf, not a broken page.
 */
export async function stationsForCountry(countryId, limit = 12) {
  const key = `${countryId}:${limit}`;
  if (cache.has(key)) return cache.get(key);

  try {
    const base = await radioServer();
    const url = `${base}/json/stations/search`
      + `?countrycode=${countryId.toUpperCase()}`
      + '&hidebroken=true&order=clickcount&reverse=true'
      // Over-fetch, because the https filter below discards a lot.
      + `&limit=${Math.max(limit * 4, 40)}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`radio-browser ${res.status}`);

    const raw = await res.json();
    const out = (raw ?? [])
      .filter(isPlayable)
      .map(shape)
      // Drop near-duplicate relays of the same station.
      .filter((s, i, arr) => arr.findIndex((x) => x.name === s.name) === i)
      .slice(0, limit);

    cache.set(key, out);
    return out;
  } catch {
    cache.set(key, []);
    return [];
  }
}

/**
 * Tell radio-browser a station was actually played. Fire and forget —
 * this is a courtesy to the directory we are reading for free, and
 * it must never affect playback.
 */
export function countStationClick(stationId) {
  if (!stationId) return;
  radioServer()
    .then((base) => fetch(`${base}/json/url/${stationId}`))
    .catch(() => {});
}

/** Exported for tests: proves the https filter is doing its job. */
export const __testables = { isPlayable, shape };
