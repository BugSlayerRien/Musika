# Sound packs

MUSIKA ships with **synthesised** interface sound. Every blip, chime and whoosh is generated live
with the Web Audio API in `src/audio/soundEngine.js`. Nothing is downloaded, nothing is licensed,
and switching packs re-voices the whole interface instantly.

If you want **real recorded** blips instead, the app will use them. This is how.

---

## Installing a recorded pack

1. Download the sound files you want (see sources below).
2. Copy `public/sfx/manifest.example.json` to `public/sfx/manifest.json`.
3. Put the `.mp3` files in `public/sfx/` named to match the manifest.
4. Reload. The engine detects the pack at boot and uses it in place of synthesis.

Any event you leave out falls back to the synthesiser, so a partial pack is fine — you can
override just `click` and `confirm` and leave the rest generated.

To force synthesis even with a pack installed, set `samples: 'off'` in the engine settings.

### Events the app fires

| Event | When |
| --- | --- |
| `hover` | cursor enters anything interactive (rate-limited to 1 per 45ms) |
| `click` | generic press |
| `confirm` | affirmative action — apply, save, select |
| `back` | cancel, dismiss, go back |
| `success` | a submission was accepted |
| `error` | validation failed |
| `on` / `off` | toggle flipped |
| `play` / `pause` | transport |
| `nav` | route change |
| `heart` | song hearted |
| `coin` | anthem pinned, badge earned |
| `notify` | toast appeared |
| `bubble` | ambient background pop |
| `open` / `close` | panel or modal |
| `boot` | the splash chime, once per session |

---

## Where to get files

### 効果音ラボ / soundeffect-lab.info — recommended

The Japanese library this app's synthesis was voiced after. Free for personal **and** commercial
use, no credit required, no registration. The `ボタン・システム音` (button / system sounds)
category is exactly the right vocabulary — `decision`, `cancel`, `select`, `warning`.

**You have to download these yourself, through their site, in a browser.** Two reasons:

- Their terms prohibit **direct linking** to the audio files (`効果音ファイルへの直リンク禁止`),
  and the server returns `403` to requests that are not coming from their own pages. There is no
  automated download step in this repo because writing one would mean deliberately working around
  that block.
- Their terms treat downloading as the point at which you accept the agreement. That is your
  decision to make, not a script's.

Their terms also prohibit **redistribution**, and explicitly extend that to "content where the
sound effects play an important role". That is why `public/sfx/` is gitignored — the files stay on
your machine and never enter the repository.

Suggested mapping from their button category:

| MUSIKA event | Good match |
| --- | --- |
| `click` | `select` / `カーソル移動` |
| `hover` | a very short `select` variant |
| `confirm` | `decision` |
| `back` | `cancel` |
| `success` | `success` / ファンファーレ |
| `error` | `warning` / `buzzer` |
| `on` / `off` | `switch` |
| `coin` | `coin` |
| `notify` | `notification` |

### Other libraries that permit redistribution

If you want the pack committed to the repo rather than gitignored, pick a source whose licence
allows it:

- **Kenney UI Audio** (kenney.nl) — CC0, redistribution fine, bundle it freely.
- **freesound.org** — filter to CC0; per-file licences vary, so check each one.
- **OpenGameArt** — filter to CC0 / CC-BY.

For a CC0 pack, remove the `public/sfx/*` lines from `.gitignore` and commit the files.

---

## Why synthesis is still the default

- No network weight and no load delay.
- No licence to track, so the repo stays clean.
- Sound packs are a *voice*, not a file list — changing `pack` re-tunes wave shape, brightness,
  decay and transposition across all 17 events at once. A recorded pack can only swap files.
- It works offline and on the first paint.

The five synthesised packs are `aqua`, `chiptune`, `arcade`, `softbox` and `crystal`, defined at
the top of `src/audio/soundEngine.js`. Adding a sixth is about ten lines.
