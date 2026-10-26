# NEXT STEPS

**Status:** MUSIKA is a complete, working front end with no backend. Everything persists to
`localStorage`, the catalogue is a static module, and every "member" other than you is seed data.

This document is the handover: what has to happen to turn it into a real multi-user platform, in
the order it should happen, with the decisions already made where the current code implies one.

---

## 0. Where the seams already are

The app was built so the backend can slot in without a rewrite. Four files are the entire
integration surface:

| File | Today | Becomes |
| --- | --- | --- |
| `src/data/songs.js` | static array | `GET /api/songs` |
| `src/data/artists.js`, `countries.js` | static arrays | `GET /api/artists`, `/api/countries` |
| `src/data/profilePresets.js` → `MEMBERS` | seed members | `GET /api/members` |
| `src/context/ProfileContext.jsx` | `localStorage` | authenticated `GET/PATCH /api/me` |

Nothing else in the app reads data directly. Pages call the helpers (`songById`,
`artistsByCountry`, `mediaFor`…), so swapping the source means changing those helpers, not the
53 places that use them.

**Do this first, before any server exists:** convert the helpers to async and add a data layer
(TanStack Query is the obvious fit). Point it at the static modules initially. Every component
then already handles loading and error states, and switching to HTTP later is a one-line base-URL
change instead of a refactor.

---

## 1. Data model

The shapes below are what the front end already assumes. Postgres flavour; adjust types to taste.

```sql
-- ---------- reference data ----------
create table countries (
  id          text primary key,          -- 'ph', 'se' — ISO 3166-1 alpha-2
  name        text not null,
  region      text not null,
  scene       text not null,             -- 'OPM', 'Nederbeat'
  tagline     text not null,
  blurb       text not null,
  palette     text[] not null,           -- 3 hex colours, drives country UI tint
  since       int  not null
);

create table artists (
  id          text primary key,          -- slug: 'the-dawn'
  name        text not null,
  country_id  text not null references countries(id),
  formed      int  not null,
  city        text not null,
  genre       text not null,
  blurb       text not null,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);
create index on artists (country_id);

-- ---------- the catalogue ----------
create table songs (
  id           text primary key,         -- slug: 'ph-dawn-enveloped'
  title        text not null,
  artist_id    text not null references artists(id),
  year         int  not null check (year between 1900 and extract(year from now())),
  album        text,
  seconds      int  not null,
  bpm          int,
  tags         text[] not null default '{}',
  note         text not null,            -- the liner note; the whole point
  submitted_by uuid references users(id),
  status       text not null default 'pending',  -- pending | published | rejected
  seed         bigint not null,          -- keeps procedural sleeve art stable
  created_at   timestamptz not null default now(),
  published_at timestamptz
);
create index on songs (artist_id);
create index on songs (status, published_at desc);
create index on songs using gin (tags);

-- ---------- resolved media (see §4) ----------
create table song_media (
  song_id      text primary key references songs(id) on delete cascade,
  provider     text not null default 'itunes',
  provider_id  text,
  preview_url  text,
  artwork_url  text,
  track_url    text,
  matched_name text,                     -- what the provider called it, for auditing
  checked_at   timestamptz not null default now()
);

-- ---------- people ----------
create table users (
  id            uuid primary key default gen_random_uuid(),
  handle        citext unique not null,
  email         citext unique not null,
  name          text not null,
  pronouns      text,
  country_id    text references countries(id),
  title         text,                    -- 'Crate Digger'
  bio           text,
  link          text,
  role          text not null default 'member',  -- member | curator | admin
  created_at    timestamptz not null default now()
);

-- Profile preferences: the exact JSON the Studio already exports.
-- Keep it as a document — it is per-user, never queried across users,
-- and its shape changes every time a style or option is added.
create table user_prefs (
  user_id     uuid primary key references users(id) on delete cascade,
  theme       jsonb not null default '{}',   -- private: how the APP looks to them
  skin        jsonb not null default '{}',   -- public:  how their PROFILE looks to everyone
  audio       jsonb not null default '{}',
  orb         jsonb not null default '{}',
  modules     text[] not null default '{}',
  updated_at  timestamptz not null default now()
);

-- ---------- interactions ----------
create table hearts (
  user_id  uuid references users(id) on delete cascade,
  song_id  text references songs(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, song_id)
);

create table anthems (
  user_id  uuid references users(id) on delete cascade,
  song_id  text references songs(id) on delete cascade,
  rank     int not null check (rank between 1 and 5),
  primary key (user_id, song_id),
  unique (user_id, rank)
);

create table plays (
  id        bigserial primary key,
  user_id   uuid references users(id) on delete set null,
  song_id   text not null references songs(id) on delete cascade,
  played_at timestamptz not null default now()
);
create index on plays (song_id, played_at desc);

create table visits (                    -- the passport
  user_id    uuid references users(id) on delete cascade,
  country_id text references countries(id) on delete cascade,
  first_seen timestamptz not null default now(),
  primary key (user_id, country_id)
);

create table guestbook (
  id         bigserial primary key,
  profile_id uuid not null references users(id) on delete cascade,
  author_id  uuid not null references users(id) on delete cascade,
  body       text not null check (length(body) between 1 and 140),
  created_at timestamptz not null default now(),
  hidden_at  timestamptz
);
create index on guestbook (profile_id, created_at desc);

create table badges_awarded (
  user_id    uuid references users(id) on delete cascade,
  badge_id   text not null,              -- matches BADGES in profilePresets.js
  awarded_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);
```

### Decisions worth keeping

- **Slug primary keys on songs/artists/countries.** The URLs are already `/song/ph-dawn-enveloped`
  and people will link to them. Do not switch to integer ids and break every link.
- **`seed` is stored, not derived.** The procedural sleeve art is generated from it, so if it
  changes, every cover that has no real artwork silently changes too.
- **Preferences stay JSON.** They are read as a blob and written as a blob. Normalising them into
  40 columns buys nothing and costs a migration every time a style is added.
- **`skin` and `theme` are separate on purpose, and have different visibility.** `theme` is private
  to its owner and never leaves their browser. `skin` is part of the public profile and must be
  served with it — `GET /api/members/:handle` returns it so a visitor sees the owner's skin inside
  their own app theme. The front end is already built this way: `ProfileCard` takes a profile
  object and projects `skin` onto a wrapper element rather than `:root`, so two skins can coexist
  on one page. Nothing needs reshaping; return `user_prefs.skin` verbatim.
- **`plays` is an append-only log.** Do not increment a counter on `songs` — you lose the ability
  to compute "most played this week", which the Listening Room wants.

### Denormalise later, not now

`songs.plays` and `songs.hearts` are currently faked deterministically from the seed. When real,
compute them in a materialised view refreshed every few minutes:

```sql
create materialized view song_stats as
select s.id,
       count(distinct h.user_id) as hearts,
       count(p.id)               as plays,
       count(p.id) filter (where p.played_at > now() - interval '7 days') as plays_week
from songs s
left join hearts h on h.song_id = s.id
left join plays  p on p.song_id = s.id
group by s.id;
```

---

## 2. API surface

REST is enough; there is no graph-shaped problem here.

```
GET    /api/countries                     cached hard, changes almost never
GET    /api/countries/:id
GET    /api/artists?country=ph
GET    /api/artists/:id
GET    /api/songs?country=&decade=&tag=&sort=&cursor=
GET    /api/songs/:id
POST   /api/songs                         submit — creates status='pending'
GET    /api/members?cursor=
GET    /api/members/:handle               includes their public `skin`

GET    /api/me                            profile + prefs + hearts + anthems
PATCH  /api/me                            partial profile / prefs update
PUT    /api/me/hearts/:songId
DELETE /api/me/hearts/:songId
PUT    /api/me/anthems                    whole ordered array of ≤5
POST   /api/me/visits/:countryId
POST   /api/plays                         { songId } — fire and forget

POST   /api/guestbook/:handle
DELETE /api/guestbook/:id                 author or profile owner or moderator

# moderation
GET    /api/admin/queue                   curator+
POST   /api/admin/songs/:id/publish
POST   /api/admin/songs/:id/reject        { reason }
```

**Pagination:** cursor-based, not offset. The catalogue is sorted by `hearts` or `published_at`;
offset pagination duplicates rows as things get hearted mid-scroll.

**Rate limits that actually matter:** `POST /api/songs` (5/hour/user), `POST /api/guestbook`
(10/hour/user), `POST /api/plays` (debounce client-side to one per song per play, and ignore
anything under 5 seconds of playback).

---

## 3. Auth

Requirements this app actually has: a stable handle, an owner for submissions, and the ability to
moderate. That is all. Do not build a full identity system.

**Recommended:** email magic link + one OAuth provider (Google). No passwords means no password
reset flow, no credential storage, and no breach surface.

- Session in an `httpOnly`, `SameSite=Lax`, `Secure` cookie. Not `localStorage` — the guestbook
  makes XSS a real concern and a JS-readable token turns any XSS into full account takeover.
- CSRF: double-submit token on all mutating routes, or `SameSite=Strict` with a separate
  same-site check.
- Roles: `member` → submit and heart; `curator` → publish/reject submissions; `admin` → everything
  plus hiding guestbook entries.

**Migrating the current local profile.** Existing visitors have a full profile in
`localStorage` under `musika.profile.v3`. On first sign-in, offer to import it — the JSON shape
already matches `user_prefs` exactly, which is why the Studio's export button exists. Do this once,
flag it, and never silently overwrite server state with local state afterwards.

---

## 4. Media resolution

`scripts/fetch-media.mjs` currently runs on a laptop and commits `src/data/media.json`. That
does not survive user-submitted songs, which arrive after build time.

Move it server-side:

1. On `POST /api/songs`, enqueue a resolve job.
2. Worker queries the iTunes Search API, scores candidates (the scoring in `fetch-media.mjs` is
   already tuned — reuse it, especially the karaoke/tribute penalty), writes `song_media`.
3. Re-resolve everything on a monthly cron. Preview URLs do rotate; artwork URLs are stable.
4. If nothing matches, leave `song_media` empty. The app already degrades to the procedural sleeve
   and the synthesised motif, so a miss is invisible rather than broken.

**Do not proxy or cache the audio.** Apple publishes those preview URLs for direct use; copying
them onto your own CDN is a different thing legally. Hotlink the artwork and the preview, exactly
as the client does now.

**If you later want more than 30 seconds:** that requires a licensed music provider (Apple
MusicKit or Spotify Web Playback SDK), which means each listener needs their own paid subscription
and an OAuth flow. It is a large piece of work and it changes the product. The 30-second preview
plus an outbound link is the right default and should stay the fallback regardless.

---

## 5. Moderation

Submissions are the product, so this cannot be an afterthought.

- Everything lands as `pending`. Nothing appears in the atlas until a curator publishes it.
- The queue needs: the liner note (reject "good song" — that is the house rule), the country/band
  match, and a duplicate check against `(lower(title), artist_id)`.
- Guestbook entries are visible immediately but soft-deletable (`hidden_at`), with a report button.
- Keep a `rejected` reason and show it to the submitter. Silent rejection kills contribution.

Auto-award badges from real events rather than by hand — `BADGES` in `profilePresets.js` already
describes the criteria ("ten submissions accepted", "songs from five countries"). A nightly job
over `songs`, `visits` and `plays` can grant all of them.

---

## 6. Performance

The static build is ~420KB JS / ~56KB CSS gzipped, plus ~3MB of wallpapers. Before real traffic:

- **Route-split.** `Studio.jsx` is the largest page and most visitors never open it.
  `React.lazy` + `Suspense` on `/studio`, `/submit` and `/community`.
- **Serve wallpapers as WebP/AVIF** with the PNG as fallback. `scripts/build-assets.mjs` already
  has `sharp` — adding `.webp()` output is three lines and cuts ~70%.
- **Preload only the active style's wallpaper.** All ten are currently reachable; only one is
  shown. The `-thumb.png` files exist for the Studio gallery and should be used there.
- Cache-bust assets by content hash and serve `/aero/**` with a one-year immutable cache header.

---

## 7. Accessibility debt

Known and not yet done:

- The Studio's style/type galleries are `<button>` grids without roving tabindex. Arrow-key
  navigation should work.
- The seek bar has `role="slider"` and ARIA values but no keyboard handler. Left/right arrows
  should seek when it has focus.
- Colour contrast is not enforced when a member picks custom aura colours. Either check contrast
  on save and warn, or force text colours to derive from the chosen background rather than the
  palette.
- `prefers-reduced-motion` is respected, but the "Calm" toggle should be surfaced on first run for
  visitors who did not set the OS preference.

---

## 8. Suggested order

1. Async data layer against the static modules (no server yet).
2. Postgres + the schema above, seeded from the current `src/data/*.js`.
3. Read-only API; front end switches to it. Ship here — it is a real deployment.
4. Auth + `/api/me`, with local-profile import.
5. Hearts, anthems, visits, plays.
6. Submissions + moderation queue.
7. Server-side media resolution.
8. Badges, guestbook, stats views.
9. Performance and a11y passes.

Steps 1–3 are worth doing even if the project stops there: it becomes a real site with a real
catalogue that anyone can browse, and only contribution is missing.

---

## 9. Things deliberately not built

- **Comments on songs.** The liner note is one considered paragraph by the person who filed it.
  A comment thread turns that into a chat log. If discussion is wanted, make it per-country, not
  per-song.
- **Follower graphs / feeds.** This is an atlas, not a social network. The guestbook is the whole
  social surface on purpose.
- **Full-catalogue playback.** See §4 — it changes the product and the licensing.
- **Uploads.** No user audio, no user images. Avatars are procedural and covers are hotlinked,
  which means no storage bill, no moderation of image content, and no CSAM exposure.
