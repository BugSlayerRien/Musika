# Assets

Where everything visual and audible in MUSIKA comes from, and why.

---

## Summary

| Asset | Source | Ships in repo | Licence |
| --- | --- | --- | --- |
| Wallpapers (10 PNG) | drawn here, `scripts/lib/svg-scenes.mjs` | yes | ours |
| Decals (20 PNG) | drawn here, `scripts/lib/svg-decals.mjs` | yes | ours |
| Sleeve art fallback | procedural SVG from song seed | n/a | ours |
| Avatars | procedural SVG from member settings | n/a | ours |
| Country markers | procedural SVG + ISO code | n/a | ours |
| **Real cover art** | iTunes Search API, hotlinked | URLs only | Apple's, linked not copied |
| **Real 30s previews** | iTunes Search API, hotlinked | URLs only | Apple's, linked not copied |
| **Band verification** | MusicBrainz, `npm run verify` | yes, `verified.json` | **CC0** — free to cache and ship |
| **Live radio directory** | radio-browser.info, at runtime | no | station data is **public domain** |
| Interface sounds | synthesised, Web Audio | n/a (code) | ours |
| Optional recorded SFX | you download them | **no**, gitignored | varies — see SOUND-PACKS.md |
| Fonts | Google Fonts, linked | no | OFL |

The repository contains no third-party media files. That is deliberate and it is what makes the
project safe to publish.

---

## The PNGs

Ten wallpapers and twenty transparent decals live in `public/aero/`. They are **real PNG files**,
generated from SVG sources by:

```bash
npm run assets
```

- Sources: `scripts/lib/svg-scenes.mjs` (backgrounds), `scripts/lib/svg-decals.mjs` (stickers)
- Rasteriser: `sharp` (devDependency)
- Output: `public/aero/bg/*.png`, `public/aero/png/*.png`, plus `manifest.json`
- Total: ~3MB at 1600×900

Editing a scene means editing its SVG function and re-running the script. Because they are
generated, they can be re-rendered at any resolution — bump `W`/`H` in `svg-scenes.mjs` for
retina wallpapers, or add a `.webp()` output for production (see NEXT-STEPS §6).

### Why drawn rather than sourced

The Frutiger Aero look is well documented and there are large archives of it. Almost all of that
material is copyrighted by whoever originally made it — Microsoft, HP, Sony, stock photographers,
game publishers. Two sources were considered and not used:

- **noclip.website** is a viewer for assets extracted from commercial games. Those assets belong to
  Nintendo, Sega and others. Downloading them into a project and shipping them is straightforward
  infringement, regardless of how the files are obtained.
- **Frutiger Aero archives** aggregate wallpapers and UI screenshots without holding rights to
  redistribute them. Grabbing files from an archive does not launder the original copyright.

Drawing the set instead means the project can be published, forked and used commercially without a
single licence question — and the assets recolour with the theme, which downloaded JPEGs could
never do.

**If you want to use archive material anyway:** drop files into `public/aero/bg/` with the same
names and they will be picked up, since `src/data/styles.js` only stores paths. That is your call
to make, and the licence exposure is yours.

---

## Song artwork and previews

Resolved by:

```bash
npm run media          # add --force to re-resolve everything
```

`scripts/fetch-media.mjs` queries the **public iTunes Search API** — no key, no OAuth — scores the
candidates, and writes `src/data/media.json`. Current coverage: **52 of 53 entries** matched, all
52 with a playable 30-second preview. The Quests' "Shanty" (Singapore, 1964) is not on Apple Music.

What gets stored is **URLs only**:

```json
{
  "preview": "https://audio-ssl.itunes.apple.com/.../mzaf_....m4a",
  "artwork": { "sm": "...200x200bb.jpg", "md": "...600x600bb.jpg" },
  "link":    "https://music.apple.com/us/album/..."
}
```

Apple publishes these endpoints for linking to their store, and the audio CDN returns
`Access-Control-Allow-Origin: *`, which is why the player can route the real recording through the
Web Audio analyser — the visualiser reacts to the actual waveform, not an animation.

### Why not Spotify or Genius

- **Spotify** removed `preview_url` for new applications in late 2024, and everything else needs
  OAuth plus a server to hold the client secret. Its images also carry attribution and
  no-modification requirements.
- **Genius** serves lyrics and metadata, no audio, and lyrics are licensed content that cannot be
  displayed without an agreement.

iTunes needs none of that and gives both artwork and audio.

### Graceful degradation

Every entry works with no network and no match:

- no artwork → procedural sleeve, generated from the song's seed and its country's palette
- no preview → synthesised motif, also from the seed
- The player labels which one you are hearing (`30s` badge vs `~`), so it never implies you are
  listening to the real record when you are not.

---

## Band verification — MusicBrainz

`npm run verify` checks every band in `artists.js` against the MusicBrainz API and writes
`src/data/verified.json`. Current state: **48 of 48 matched**, 47 country confirmations, 1 dispute.

MusicBrainz core data is **CC0**, so unlike the Apple media these results are cached in the
repository rather than fetched at runtime.

Two things forced this to be a build-time script rather than a browser call:

- MusicBrainz asks for a meaningful `User-Agent`, and browsers forbid JS from setting that header.
  Node can, so the script identifies itself properly.
- The rate limit is 1 request/second. Forty-eight artists is under a minute in a script and
  unacceptable in a page.

Three matching problems worth knowing about, since they will recur as the catalogue grows:

- **Compound billings.** "Fela Kuti & Africa 70" and "Johnny Clegg & Savuka" are catalogued under
  the lead name. The script retries on the part before the `&`.
- **Non-Latin primary names.** Shonen Knife is filed as 少年ナイフ and is only reachable through
  an `alias:` query.
- **Solo artists.** MusicBrainz stores a *birth* date in `life-span.begin` for a `Person`, so
  comparing it to a band's formation year is meaningless — it was reporting Björk as "formed
  1965". Formation years are no longer compared for people.

### The dispute, and why the data still reads as it does

MusicBrainz files **Crowded House** under `au`; we file them under New Zealand. Both are
defensible — the band formed in Melbourne, which our own `city` field already says, but the act is
a New Zealand one by any ordinary reading.

The UI never contradicts our data. It shows a `✓ MusicBrainz` chip when the two agree and stays
silent when they do not; disagreements surface only in the script's console report, for a person
to judge. Thirteen formation years differ by a year or two, which is normal — band formation dates
are genuinely contested, and MusicBrainz is not automatically right.

### At submission time

The submit form queries MusicBrainz **directly from the browser** — one request per submission,
well inside the rate limit, and their `Access-Control-Allow-Origin: *` permits it. If the band's
country disagrees with the one picked, it offers a one-click correction.

It is advisory and never blocks a submission. MusicBrainz is patchy for exactly the scenes this
site exists to document, so a miss means nothing: no match, a 503, or an offline browser all
render nothing at all rather than an error.

### Cover Art Archive — evaluated, not used

CAA is the obvious companion to MusicBrainz: keyless, CORS-open, addressable by MBID
(`coverartarchive.org/release-group/{mbid}/front-500`). It was investigated to fill the one
catalogue entry iTunes cannot match — The Quests, "Shanty", Singapore 1964.

It does not help, and the reason is worth recording so this is not re-attempted:

- MusicBrainz has **no release group for "Shanty"** at all.
- CAA *does* hold art for two other Quests releases ("Puppet on a String", "Sakura Goes Boom
  Boom"), and it would be trivial to attach one of those to the entry.

That would be a regression. The procedural sleeve is honestly generative and claims nothing; a
real cover from a *different record* claims to be this song's sleeve and is simply false. The
point of the real-artwork layer is that it is real **and** correct.

If CAA is wired up later, it must match through recording → release → release group, never
artist → any release group.

---

## Live radio — radio-browser.info

Each country room carries a live dial, fetched at runtime from the community directory at
radio-browser.info. Keyless, CORS-open, station data is public domain, and nothing is proxied —
the browser connects to each station directly.

Three implementation notes that cost real debugging time:

1. **No custom headers.** Their docs suggest identifying via `X-User-Agent`, but that turns the
   request into a preflighted one and their `Access-Control-Allow-Headers` does not list it, so
   the browser blocks every call. `curl` does not preflight, which is why this only shows up in a
   real browser. A plain header-free GET is a CORS "simple request" and works.
2. **HTTPS only.** Roughly a quarter of stations still stream over plain `http` — 13 of 48 in the
   Philippine list. On an HTTPS deployment those are mixed content and fail silently. `radio.js`
   filters them out before the UI ever sees them.
3. **No hardcoded mirror.** The server pool is resolved from `all.api.radio-browser.info` and the
   choice cached for the session, as their docs ask. We also ping their click counter when a
   station is actually tuned, which is how their popularity ordering stays meaningful.

Radio uses a **separate audio element with no `crossOrigin`**. Apple's CDN sends CORS headers, so
previews can be routed through the Web Audio analyser; the vast majority of radio streams send
none, and setting `crossOrigin` on those makes them fail to load entirely. Playing the station
matters more than driving the visualiser from it, so **radio plays straight to the output and the
visualiser idles during radio**.

---

## Sounds

Synthesised at runtime. See **[SOUND-PACKS.md](./SOUND-PACKS.md)** for the full story, including
how to install recorded files and why soundeffect-lab.info files cannot be fetched automatically
(their terms prohibit direct linking, and their server enforces it).

---

## Fonts

Twelve families from Google Fonts, requested in one call in `index.html`, all under the SIL Open
Font License. Listed in `src/data/fonts.js` as eleven pairings.

If you would rather self-host — for offline use or to drop the third-party request — download the
families, put the woff2 files in `public/fonts/`, and replace the `<link>` with `@font-face` rules.
Nothing else changes; `fonts.js` only holds family names.
