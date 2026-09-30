import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Live second opinion while somebody files a song.
 *
 * The atlas rests on the band actually being from the country it is
 * filed under, and the submit form has until now taken that on trust.
 * This asks MusicBrainz as the name is typed, so a miscategorised
 * entry gets caught at the point of entry rather than after it is in.
 *
 * Deliberately advisory. MusicBrainz is frequently incomplete for the
 * exact scenes this site cares about — small Southeast Asian and
 * Scandinavian bands — so a miss means nothing and must never block a
 * submission. It only ever adds information.
 *
 * Browser-direct is fine here: one request per submission, and
 * MusicBrainz sends `Access-Control-Allow-Origin: *`. We cannot set a
 * User-Agent from JS (browsers forbid it); the build-time verifier in
 * scripts/verify-artists.mjs does that properly for bulk work.
 */
export function useMusicBrainzCheck() {
  const [result, setResult] = useState(null); // null | {state, ...}
  const abortRef = useRef(null);
  const cacheRef = useRef(new Map());

  useEffect(() => () => abortRef.current?.abort(), []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setResult(null);
  }, []);

  const check = useCallback(async (name) => {
    const term = (name || '').trim();
    if (term.length < 2) { setResult(null); return; }

    if (cacheRef.current.has(term)) {
      setResult(cacheRef.current.get(term));
      return;
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setResult({ state: 'checking' });

    try {
      const url = `https://musicbrainz.org/ws/2/artist?query=${
        encodeURIComponent(`artist:"${term}"`)}&fmt=json&limit=3`;
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));

      const artists = (await res.json()).artists ?? [];
      const hit = artists[0];

      const out = hit && (hit.score ?? 0) >= 80
        ? {
          state: 'found',
          name: hit.name,
          country: (hit.country || hit.area?.['iso-3166-1-codes']?.[0] || '').toLowerCase() || null,
          area: hit['begin-area']?.name ?? hit.area?.name ?? null,
          formed: hit['life-span']?.begin
            ? Number(String(hit['life-span'].begin).slice(0, 4))
            : null,
          disambiguation: hit.disambiguation || null,
          mbid: hit.id,
        }
        : { state: 'none' };

      cacheRef.current.set(term, out);
      if (!ctrl.signal.aborted) setResult(out);
    } catch (err) {
      if (err.name === 'AbortError') return;
      // Offline or rate-limited. Silence is correct — this is a bonus,
      // not a requirement, and a red error here would be misleading.
      setResult({ state: 'error' });
    }
  }, []);

  return { result, check, clear };
}
