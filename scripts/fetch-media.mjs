/* ============================================================
   MUSIKA — media resolver
   ------------------------------------------------------------
   Resolves every catalogue entry against the public iTunes
   Search API and writes src/data/media.json.

   Why iTunes and not Spotify or Genius:
     · no OAuth, no client key, no server component
     · returns real cover artwork AND a real 30-second preview
       stream that Apple publishes for exactly this purpose
     · Spotify deprecated preview_url for new apps in late 2024
       and Genius serves no audio at all

   We store URLs, never files. Nothing copyrighted is bundled.

   Run:  npm run media
   ============================================================ */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const OUT = join(ROOT, 'src', 'data', 'media.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---- pull the catalogue straight out of the source module ---- */
async function loadCatalogue() {
  const songs = await import(`file://${join(ROOT, 'src', 'data', 'songs.js')}`);
  const artists = await import(`file://${join(ROOT, 'src', 'data', 'artists.js')}`);
  return { SONGS: songs.SONGS, artistById: artists.artistById };
}

/* ---- fuzzy-ish comparison so "Björk" matches "Bjork" ---- */
const norm = (s) => s
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]/g, '');

function scoreMatch(result, wantArtist, wantTitle) {
  const a = norm(result.artistName || '');
  const t = norm(result.trackName || '');
  const wa = norm(wantArtist);
  const wt = norm(wantTitle);
  let score = 0;
  if (a === wa) score += 6;
  else if (a.includes(wa) || wa.includes(a)) score += 3;
  if (t === wt) score += 6;
  else if (t.includes(wt) || wt.includes(t)) score += 3;
  // prefer entries that actually carry a preview
  if (result.previewUrl) score += 2;
  // de-prioritise karaoke / tribute / live re-records
  if (/karaoke|tribute|made popular|cover version/i.test(result.collectionName || '')) score -= 8;
  if (/karaoke|tribute/i.test(result.artistName || '')) score -= 10;
  return score;
}

async function search(term, attempt = 0) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=12`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'musika-media-resolver/1.0' } });
    if (res.status === 403 || res.status === 429) {
      if (attempt > 4) return [];
      const wait = 4000 * (attempt + 1);
      process.stdout.write(` [throttled, waiting ${wait / 1000}s]`);
      await sleep(wait);
      return search(term, attempt + 1);
    }
    if (!res.ok) return [];
    const json = await res.json();
    return json.results ?? [];
  } catch (err) {
    if (attempt > 3) return [];
    await sleep(2500);
    return search(term, attempt + 1);
  }
}

/** iTunes serves 100px by default; the URL pattern resizes freely. */
const artAt = (url, px) => (url ? url.replace(/\/\d+x\d+bb\.jpg$/, `/${px}x${px}bb.jpg`) : null);

async function main() {
  const { SONGS, artistById } = await loadCatalogue();

  let existing = {};
  try {
    existing = JSON.parse(await readFile(OUT, 'utf8'));
  } catch {
    /* first run */
  }

  const force = process.argv.includes('--force');
  const out = { ...existing };
  let hits = 0;
  let misses = 0;

  for (const song of SONGS) {
    if (!force && out[song.id]?.checked) continue;

    const artist = artistById(song.artist);
    const artistName = artist?.name ?? '';
    process.stdout.write(`· ${artistName} — ${song.title}`);

    // two passes: tight query first, then title-only for obscure entries
    let results = await search(`${artistName} ${song.title}`);
    if (!results.length) {
      await sleep(700);
      results = await search(song.title);
    }

    const ranked = results
      .map((r) => ({ r, score: scoreMatch(r, artistName, song.title) }))
      .sort((a, b) => b.score - a.score);

    const best = ranked[0];

    if (best && best.score >= 6) {
      const r = best.r;
      out[song.id] = {
        checked: true,
        found: true,
        score: best.score,
        trackId: r.trackId,
        appleArtist: r.artistName,
        appleTitle: r.trackName,
        album: r.collectionName,
        releaseYear: r.releaseDate ? Number(r.releaseDate.slice(0, 4)) : null,
        durationMs: r.trackTimeMillis ?? null,
        preview: r.previewUrl ?? null,
        artwork: {
          sm: artAt(r.artworkUrl100, 200),
          md: artAt(r.artworkUrl100, 600),
          lg: artAt(r.artworkUrl100, 1000),
        },
        link: r.trackViewUrl ?? null,
      };
      hits++;
      process.stdout.write(`  ✓ ${r.previewUrl ? 'art+preview' : 'art only'}\n`);
    } else {
      out[song.id] = { checked: true, found: false };
      misses++;
      process.stdout.write('  ✗ no confident match\n');
    }

    await sleep(900); // stay well under the public rate limit
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(out, null, 2)}\n`, 'utf8');

  const withPreview = Object.values(out).filter((m) => m.preview).length;
  console.log(`\nwrote ${OUT}`);
  console.log(`matched ${hits}, missed ${misses}, ${withPreview} with playable previews`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
