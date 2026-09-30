/* ============================================================
   MUSIKA — independent verification
   ------------------------------------------------------------
   verified.json is produced by `npm run verify`, which checks
   every band in artists.js against MusicBrainz.

   The atlas rests on one claim: this band is from this country.
   Until now that was whatever a member typed. This gives each
   entry a second opinion from a source that is not us.

   MusicBrainz core data is CC0, so unlike the Apple media these
   results are cached in the repository rather than fetched.

   Important: MusicBrainz is a second opinion, NOT an authority.
   Where the two disagree, both may be defensible — Crowded House
   formed in Melbourne but is a New Zealand band by any reasonable
   reading. The UI never contradicts our own data; it only shows a
   confirmation when the two agree.
   ============================================================ */

import raw from './verified.json';

const VERIFIED = raw ?? {};

export const verifiedFor = (artistId) => {
  const v = VERIFIED[artistId];
  return v && v.found ? v : null;
};

/** True only when MusicBrainz independently confirms the country. */
export const countryConfirmed = (artistId) => verifiedFor(artistId)?.agrees?.country === true;

/** The MusicBrainz page for this band, for anyone who wants to check. */
export function musicBrainzUrl(artistId) {
  const mbid = verifiedFor(artistId)?.mbid;
  return mbid ? `https://musicbrainz.org/artist/${mbid}` : null;
}

/** Where MusicBrainz says the band began — often more precise than ours. */
export const beginAreaFor = (artistId) => verifiedFor(artistId)?.beginArea ?? null;

/** Community tags from MusicBrainz, useful as scene evidence. */
export const mbTagsFor = (artistId) => verifiedFor(artistId)?.tags ?? [];

/** Shown on the About page. */
export function verifyCoverage() {
  const all = Object.values(VERIFIED);
  const found = all.filter((v) => v.found);
  return {
    total: all.length,
    matched: found.length,
    countryConfirmed: found.filter((v) => v.agrees?.country === true).length,
    countryDisputed: found.filter((v) => v.agrees?.country === false).length,
  };
}
