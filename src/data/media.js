/* ============================================================
   MUSIKA — resolved media
   ------------------------------------------------------------
   media.json is produced by `npm run media`, which matches every
   catalogue entry against the public iTunes Search API and keeps
   the URLs it returns.

   We store links, never files: cover art is hotlinked from
   Apple's image CDN and previews stream from Apple's audio CDN,
   which is what those endpoints are published for. Nothing
   copyrighted lives in this repository.

   Any entry Apple cannot match simply falls back to the
   procedural sleeve and the synthesised motif, so the app never
   depends on the network to be usable.
   ============================================================ */

import raw from './media.json';

const MEDIA = raw ?? {};

export const mediaFor = (songId) => {
  const m = MEDIA[songId];
  return m && m.found ? m : null;
};

/** Real cover artwork at a sensible size, or null. */
export function artworkFor(songId, size = 'md') {
  const m = mediaFor(songId);
  return m?.artwork?.[size] ?? null;
}

/** Streaming 30-second preview, or null when Apple has none. */
export function previewFor(songId) {
  return mediaFor(songId)?.preview ?? null;
}

/** Link out to the track on Apple Music. */
export function trackLinkFor(songId) {
  return mediaFor(songId)?.link ?? null;
}

export const hasRealAudio = (songId) => Boolean(previewFor(songId));

/** How much of the catalogue actually resolved — shown on the About page. */
export function mediaCoverage() {
  const all = Object.values(MEDIA);
  return {
    total: all.length,
    matched: all.filter((m) => m.found).length,
    withPreview: all.filter((m) => m.preview).length,
  };
}
