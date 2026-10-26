# MUSIKA

A community atlas of **classic English-language songs, filed by the country the band came from**.

The premise is one rule: the song is sung in English, and the band is from the room it is filed
under. What that surfaces is a shelf no chart would give you — The Dawn next to Shocking Blue next
to a-ha, all doing the same thing from different corners of the world. It started as a site about
OPM bands, which is still the room the app opens on.

Built as a **Frutiger Aero** revival: generated PNG wallpapers, glossy glass, aurora fields,
particle weather, lens flares, water caustics and skeuomorphic controls, with a retro UI sound
layer synthesised in the browser. Ten selectable styles, from textbook Aqua Sky through Impossible
Meadow to Cathedral Gothic and Cyber Terminal.

Cover art and 30-second previews are the **real recordings**, resolved against the public iTunes
Search API — 52 of 53 entries, with a procedural fallback for anything unmatched. Every band is
independently checked against MusicBrainz, and each country room carries a **live radio dial**.

---

## Status

A complete front end with **no backend yet**. Everything is client-side:

- Your profile, hearts, anthems, passport stamps and submissions persist to `localStorage` in
  your browser only.
- The catalogue, bands and countries are static modules in `src/data/`.
- Every community member other than you is seed data, and submissions are marked
  *pending review* but go nowhere.

[docs/NEXT-STEPS.md](docs/NEXT-STEPS.md) is the plan for turning this into a multi-user
platform — schema, API, auth, moderation and build order.

---

## Running it

Requires **Node 18+** (Vite 5).

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

| Script | What it does |
| --- | --- |
| `npm run dev` | dev server on :5173 |
| `npm run build` | production build to `dist/` |
| `npm run preview` | serve the build |
| `npm run assets` | regenerate the PNG wallpapers and decals from their SVG sources |
| `npm run media` | re-resolve cover art and previews against the iTunes Search API |
| `npm run verify` | re-check every band's country and era against MusicBrainz |

The generated assets, `src/data/media.json` and `src/data/verified.json` are all committed, so a
clean checkout runs without any of these scripts.

---

## What is in the app

| Route | What it is |
| --- | --- |
| `/` | Listening Room — hero, your home country's shelf, the rotation, fresh submissions |
| `/atlas` | Every country room, filterable by region and sortable |
| `/country/:id` | One room: hero, **live radio dial**, decade shelves, the bands, the curators |
| `/artist/:id` | A band, its English-language entries, and its neighbours |
| `/song/:id` | One entry: sleeve, liner note, submitter, stats, related |
| `/catalogue` | The whole catalogue with country / decade / tag / sort filters, grid or list |
| `/community` | Member directory |
| `/member/:handle` | A member's profile and submissions |
| `/submit` | File a song — validated form with a live preview |
| `/profile` | Your profile, composed from the panels you chose |
| `/studio` | **Profile Studio** — style, identity, avatar, theme, type, sound, layout, data |
| `/about` | The premise, the design and the stack |

---

## Profile Studio

Everything visual is a CSS custom property, so the Studio repaints the whole application at
runtime. No save button — changes apply as you make them, and persist in `localStorage`.

- **Identity** — display name, handle, pronouns, home country, member title, bio, link
- **Avatar** — a procedurally drawn glass orb: 8 interior patterns, 24 emblems, two colour wells,
  6 frames, spin toggle, and a randomiser
- **Style** — 10 complete visual languages across three families (Aero, Y2K/Retro, Dark). Each
  sets wallpaper, palette, corner sharpness, ink direction, particle weather, typeface and sound
  pack in one move; plus wallpaper dim/blur, particle type and density, aurora, caustics, flares
  and CRT scanlines
- **Theme** — 10 aura palettes plus four free colour wells, gradient angle, bloom intensity,
  light-on-dark vs dark-on-light glass, blur, panel opacity, corner roundness, density, motion
  mode, and 4 cursor-trail styles
- **Type** — 11 typeface pairings with live previews, from rounded Aero through blackletter and
  cathedral serif to terminal and pixel faces
- **Sound** — 5 sound packs, master switch, interface and preview volumes, per-category switches
  (cursor blips, navigation whoosh, boot chime, ambient pad), and a soundboard for all 17 events
- **Layout** — reorder or remove the panels on your profile; manage your five pinned anthems
- **Data** — export the whole profile as JSON, import it back, or reset to defaults

---

## Music

Playback has three modes, labelled in the player so it never misleads:

- **`30s`** — the real preview Apple publishes for that recording, streamed from their CDN. Their
  audio CDN sends `Access-Control-Allow-Origin: *`, so it routes through the app's own Web Audio
  graph and the visualiser reads the actual waveform.
- **`~`** — for the one entry with no match, an original motif synthesised from the song's seed.
- **`LIVE`** — a real radio station from a country room, streaming now.

Nothing is hosted, proxied or cached: artwork and previews are hotlinked exactly as Apple
publishes them, radio streams connect browser-to-station, and the repo contains no third-party
media. See [docs/ASSETS.md](docs/ASSETS.md).

OS media controls (lock screen, headset buttons, media keys) work in all three modes.

---

## Trusted data

The atlas rests on one claim — this band is from this country — so it is checked rather than
asserted. `npm run verify` matches every band against **MusicBrainz** (keyless, CC0) and records
the result: **48 of 48 matched**, 47 country confirmations, 1 dispute.

A `✓ MusicBrainz` chip appears on an artist page only when the two agree. Where they disagree the
UI stays quiet — MusicBrainz is a second opinion, not an authority — and the disagreement is
reported to the console for a person to judge.

The submit form asks MusicBrainz about the band as you type it and offers a one-click country
correction, catching a miscategorised entry before it enters the atlas instead of after.

---

## Live radio

Every country room has a dial of real stations from that country, via the public-domain directory
at **radio-browser.info**. Stations are filtered to HTTPS only — roughly a quarter still stream
over plain `http`, which a secure page silently refuses to play.

---

## Sound

Interface sound is **generated live with the Web Audio API** — no sample pack ships with the app. The voicing follows the convention retro UI sound libraries established: short
square/triangle blips for cursor movement, a rising major third for confirm, a falling step for
cancel, a bright arpeggio for success, a detuned dyad for errors.

Because it is synthesis rather than playback, switching packs re-voices the entire interface
instantly, and nothing you hear carries a licence.

The same synthesiser covers the one catalogue entry with no published preview, so every song has
something audible. Recorded packs are supported too — drop files into `public/sfx` and they take
over, with synthesis filling any event you leave out. See
[docs/SOUND-PACKS.md](docs/SOUND-PACKS.md).

Browsers block audio until a user gesture, which is what the boot splash's "Enter" button is for.

---

## Artwork

Ten wallpapers and twenty transparent decals live in `public/aero/` as real PNGs — **generated**
from SVG sources by `npm run assets`, not sourced from an archive. That keeps them recolourable,
re-renderable at any resolution, and free of licence questions.

Three things are drawn procedurally at runtime instead:

- **Sleeve art fallback** — derived from a song's seed and its country's palette, so a cover exists
  instantly and offline for every entry
- **Avatars** — the orb generator, from the member's own settings
- **Country markers** — flag emoji render as bare letters on Windows, so a country shows as a small
  enamel badge carrying its ISO code, tinted with that country's palette

Full provenance in [docs/ASSETS.md](docs/ASSETS.md).

---

## Project layout

```
scripts/
├─ build-assets.mjs         SVG -> PNG rasteriser (npm run assets)
├─ fetch-media.mjs          iTunes Search resolver (npm run media)
├─ verify-artists.mjs       MusicBrainz verifier (npm run verify)
└─ lib/
   ├─ svg-scenes.mjs        the 10 wallpaper drawings
   └─ svg-decals.mjs        the 20 sticker drawings

public/
├─ aero/                    generated PNGs + manifest
└─ sfx/                     optional recorded sound pack (gitignored)

src/
├─ main.jsx                 entry; loads the stylesheet layers in order
├─ App.jsx                  providers + boot splash + shell
├─ router.jsx               route table
│
├─ styles/
│  ├─ tokens.css            design tokens — colour, glass, geometry, motion, layout
│  ├─ base.css              reset, typography, scrollbars, focus, utilities
│  ├─ animations.css        the motion library (aurora, bubbles, sheen, iris drift…)
│  ├─ aero.css              component skin — glass, buttons, fields, sliders, switches
│  └─ app.css               shell, navigation, cards, page furniture
│
├─ audio/soundEngine.js     Web Audio synth: packs, event vocabulary, ambience, previews
│
├─ context/
│  ├─ ProfileContext.jsx    profile state, persistence, CSS-variable projection
│  ├─ PlayerContext.jsx     queue, transport, clock, keyboard shortcuts
│  └─ ToastContext.jsx      notifications
│
├─ hooks/
│  ├─ useLocalStorage.js    persisted state with a migration hook
│  ├─ useMusicBrainzCheck.js  live second opinion on the submit form
│  └─ useSound.js           the one entry point components use to make noise
│
├─ data/
│  ├─ countries.js          24 country rooms with palettes
│  ├─ artists.js            48 bands
│  ├─ songs.js              the catalogue, as compact tuples
│  ├─ media.json            resolved artwork + preview URLs (npm run media)
│  ├─ media.js              accessors and coverage stats
│  ├─ verified.json         MusicBrainz check results (npm run verify)
│  ├─ verified.js           accessors for the above
│  ├─ radio.js              radio-browser client (server pool, HTTPS filter)
│  ├─ styles.js             the 10 style presets and particle vocabulary
│  ├─ fonts.js              the 11 typeface pairings
│  └─ profilePresets.js     palettes, emblems, frames, badges, members, defaults
│
├─ components/
│  ├─ aero/                 AeroButton, Controls (Panel/Switch/Slider/…), Scenery, CursorTrail
│  ├─ layout/               AppShell, TopBar, SideRail, BootScreen
│  ├─ music/                CoverArt, Flag, SongRow, Cards, MusicBrainzNote
│  ├─ radio/                RadioDial
│  ├─ player/               NowPlaying, Visualizer
│  └─ profile/              Orb
│
└─ pages/                   one file per route
```

Each component that needs page-specific CSS keeps it next to itself (`nowplaying.css`,
`orb.css`, `studio.css`…). The five files in `styles/` are the shared system.

---

## Keyboard

| Key | Action |
| --- | --- |
| `Space` | Play / pause |
| `Shift` + `→` | Next track |
| `Shift` + `←` | Previous track |
| `/` | Focus search |
| `Esc` | Close search results |

---

## Stack

React 18 · Vite 5 · React Router 6 · plain CSS with custom properties · Web Audio API ·
Media Session API ·
`sharp` (build-time only, for the PNG generator). No UI framework and no icon font — the only
runtime dependencies are React, React DOM and React Router.

---

## Documentation

| File | Covers |
| --- | --- |
| [docs/NEXT-STEPS.md](docs/NEXT-STEPS.md) | **Turning this into a real platform** — database schema, API surface, auth, moderation, media resolution, and the order to build it in |
| [docs/ASSETS.md](docs/ASSETS.md) | Where every asset comes from and its licence |
| [docs/SOUND-PACKS.md](docs/SOUND-PACKS.md) | Installing recorded sound packs, and the licence constraints |

---

## `legacy/`

The original static site — 20 absolute-positioned HTML pages — is kept in `legacy/` for reference.
Nothing in the app reads from it. A 31 MB IDE-plugin zip that shipped with it is gitignored.

---

## Credits

- Cover artwork and 30-second previews © their respective rights holders, linked (not hosted)
  via Apple's iTunes Search API.
- Fonts from Google Fonts under the SIL Open Font License.
- Everything else — wallpapers, decals, sleeves, avatars, interface sound — is original to this
  project. Provenance in [docs/ASSETS.md](docs/ASSETS.md).
