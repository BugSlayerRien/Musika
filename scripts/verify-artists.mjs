/* ============================================================
   MUSIKA — artist verifier
   ------------------------------------------------------------
   Checks every band in src/data/artists.js against MusicBrainz
   and writes src/data/verified.json.

   Why this exists: the whole premise of the atlas is that a band
   belongs to the country it is filed under. Until now that was
   asserted by whoever typed it in. MusicBrainz gives us an
   independent second opinion on country, city and formation year.

   Why at build time rather than in the browser:
     · MusicBrainz requires a meaningful User-Agent, and browsers
       forbid JS from setting that header. Node can set it.
     · The limit is 1 request/second. ~48 artists is under a
       minute in a script and unacceptable in a page.

   MusicBrainz core data is CC0, so unlike the Apple media we are
   free to cache the results and commit them.

   Run:  npm run verify           (skips artists already checked)
         npm run verify -- --force  (re-checks everything)
   ============================================================ */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const OUT = join(ROOT, 'src', 'data', 'verified.json');

const UA = 'MUSIKA/1.0 (https://github.com/rienmiro/musika)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function loadCatalogue() {
  const artists = await import(`file://${join(ROOT, 'src', 'data', 'artists.js')}`);
  const countries = await import(`file://${join(ROOT, 'src', 'data', 'countries.js')}`);
  return { ARTISTS: artists.ARTISTS, countryById: countries.countryById };
}

/* Same normaliser as the media resolver: "Björk" must match "Bjork". */
const norm = (s) => s
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/^the\s+/, '')
  .replace(/[^a-z0-9]/g, '');

function scoreMatch(candidate, wantName, wantCountry) {
  const a = norm(candidate.name || '');
  const wa = norm(wantName);
  let score = 0;

  if (a === wa) score += 8;
  else if (a.includes(wa) || wa.includes(a)) score += 3;
  else return -1; // not the same band at all

  // Country agreement is strong evidence we found the right act —
  // there are several bands called "The Dawn".
  if ((candidate.country || '').toLowerCase() === wantCountry) score += 6;

  // MusicBrainz's own relevance score, damped.
  score += Math.round((candidate.score ?? 0) / 25);

  // Prefer groups over individual people when we asked for a band.
  if (candidate.type === 'Group') score += 1;

  return score;
}

async function search(name, countryCode, attempt = 0, byAlias = false) {
  // Bias the query with the country we believe in, but do not hard-filter:
  // if we are wrong, we still want to see what MusicBrainz says.
  const q = byAlias
    ? `alias:"${name}"`
    : `artist:"${name}" OR (artist:"${name}" AND country:${countryCode.toUpperCase()})`;
  const url = `https://musicbrainz.org/ws/2/artist?query=${encodeURIComponent(q)}&fmt=json&limit=8`;

  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });

    if (res.status === 503 || res.status === 429) {
      if (attempt > 4) return [];
      const wait = 3000 * (attempt + 1);
      process.stdout.write(` [throttled ${wait / 1000}s]`);
      await sleep(wait);
      return search(name, countryCode, attempt + 1, byAlias);
    }
    if (!res.ok) return [];
    return (await res.json()).artists ?? [];
  } catch {
    if (attempt > 3) return [];
    await sleep(2500);
    return search(name, countryCode, attempt + 1, byAlias);
  }
}

async function main() {
  const { ARTISTS, countryById } = await loadCatalogue();

  let out = {};
  try {
    out = JSON.parse(await readFile(OUT, 'utf8'));
  } catch {
    /* first run */
  }

  const force = process.argv.includes('--force');
  const disagreements = [];
  let matched = 0;
  let missed = 0;

  for (const artist of ARTISTS) {
    if (!force && out[artist.id]?.checked) continue;

    process.stdout.write(`· ${artist.name.padEnd(34)}`);
    let results = await search(artist.name, artist.country);

    // Compound billings — "Fela Kuti & Africa 70", "Johnny Clegg & Savuka" —
    // are catalogued under the lead name, so retry on the part before the "&".
    const lead = artist.name.split(/\s*[&+]\s*/)[0].trim();
    if (!results.length && lead !== artist.name) {
      await sleep(1100);
      results = await search(lead, artist.country);
    }

    // Bands catalogued under a non-Latin primary name — 少年ナイフ for
    // Shonen Knife — are only reachable through their alias.
    let viaAlias = false;
    if (!results.length) {
      await sleep(1100);
      results = await search(artist.name, artist.country, 0, true);
      viaAlias = results.length > 0;
    }

    const ranked = results
      .map((r) => ({
        r,
        score: viaAlias
          ? 8 + ((r.country || '').toLowerCase() === artist.country ? 6 : 0)
          : Math.max(
            scoreMatch(r, artist.name, artist.country),
            lead !== artist.name ? scoreMatch(r, lead, artist.country) : -1,
          ),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);

    const best = ranked[0];

    if (best && best.score >= 8) {
      const r = best.r;
      const mbCountry = (r.country || r.area?.['iso-3166-1-codes']?.[0] || '').toLowerCase();
      const mbFormed = r['life-span']?.begin
        ? Number(String(r['life-span'].begin).slice(0, 4))
        : null;

      const isPerson = r.type === 'Person';
      const agrees = {
        country: mbCountry ? mbCountry === artist.country : null,
        // For a solo artist MusicBrainz stores a birth date, which is not
        // comparable to the year we file as "formed".
        formed: isPerson || !mbFormed ? null : mbFormed === artist.formed,
      };

      out[artist.id] = {
        checked: true,
        found: true,
        score: best.score,
        mbid: r.id,
        mbName: r.name,
        country: mbCountry || null,
        beginArea: r['begin-area']?.name ?? null,
        formed: mbFormed,
        type: r.type ?? null,
        disambiguation: r.disambiguation ?? null,
        tags: (r.tags ?? []).map((t) => t.name).slice(0, 6),
        agrees,
      };

      matched++;
      const flags = [];
      if (agrees.country === false) {
        flags.push(`country ${artist.country}→${mbCountry}`);
      }
      if (agrees.formed === false) flags.push(`formed ${artist.formed}→${mbFormed}`);
      if (flags.length) {
        disagreements.push({ artist, mb: out[artist.id], flags });
        process.stdout.write(`  ⚠ ${flags.join(', ')}\n`);
      } else {
        process.stdout.write('  ✓\n');
      }
    } else {
      out[artist.id] = { checked: true, found: false };
      missed++;
      process.stdout.write('  ✗ no confident match\n');
    }

    await sleep(1100); // MusicBrainz allows 1 req/sec; stay just under
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(out, null, 2)}\n`, 'utf8');

  const all = Object.values(out);
  console.log(`\nwrote ${OUT}`);
  console.log(`matched ${all.filter((v) => v.found).length}/${all.length}, missed this run ${missed}, new matches ${matched}`);

  if (disagreements.length) {
    console.log(`\n${'='.repeat(64)}`);
    console.log(`${disagreements.length} DISAGREEMENT(S) — review by hand, do not auto-apply.`);
    console.log('MusicBrainz is a second opinion, not an authority. Our data may be right.');
    console.log('='.repeat(64));
    for (const d of disagreements) {
      const c = countryById(d.artist.country);
      console.log(`\n  ${d.artist.name}  (we say ${c?.name ?? d.artist.country}, ${d.artist.formed})`);
      console.log(`    MusicBrainz: ${d.mb.mbName} — ${d.mb.country ?? '??'} — ${d.mb.formed ?? '??'}`
        + `${d.mb.disambiguation ? ` — "${d.mb.disambiguation}"` : ''}`);
      console.log(`    differs on: ${d.flags.join(', ')}`);
      console.log(`    https://musicbrainz.org/artist/${d.mb.mbid}`);
    }
    console.log('');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
