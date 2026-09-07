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
