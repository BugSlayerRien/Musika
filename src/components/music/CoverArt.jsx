import { useId, useMemo, useState } from 'react';
import { artistById } from '@/data/artists';
import { countryById } from '@/data/countries';
import { artworkFor } from '@/data/media';
import './coverart.css';

/**
 * Sleeve art, in two layers.
 *
 * The base is procedural — derived from the song's seed and its
 * country's palette — so a cover exists instantly, offline, for
 * every entry including ones nothing has been resolved for.
 *
 * On top of that, when `npm run media` has matched the track, the
 * real cover fades in from Apple's image CDN. If the network is
 * down or the entry never matched, the drawing simply stays.
 */
export function CoverArt({ song, size = 160, spinning = false, className = '', art = true }) {
  const uid = useId().replace(/[:]/g, '');
  const [loaded, setLoaded] = useState(false);
  const real = art && song.id
    ? artworkFor(song.id, typeof size === 'number' && size <= 120 ? 'sm' : 'md')
    : null;
  const sleeve = useMemo(() => {
    let s = song.seed || 1;
    const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    const country = countryById(artistById(song.artist)?.country);
    const pal = country?.palette ?? ['#8b5cf6', '#e879f9', '#22d3ee'];
    return {
      pal,
      layout: Math.floor(rnd() * 5),
      angle: Math.floor(rnd() * 360),
      r1: 20 + rnd() * 30,
      r2: 30 + rnd() * 40,
      cx: 20 + rnd() * 60,
      cy: 20 + rnd() * 60,
      bands: 3 + Math.floor(rnd() * 5),
      flag: country?.id.toUpperCase() ?? '♪',
    };
  }, [song.seed, song.artist]);

  const g = (n) => `${uid}-${n}`;
  const [p1, p2, p3] = sleeve.pal;

  return (
    <div
      className={`cover ${spinning ? 'cover-spin' : ''} ${typeof size === 'number' && size < 90 ? 'cover-mini' : ''} ${className}`}
      style={{ width: size, aspectRatio: '1 / 1' }}
    >
      <svg viewBox="0 0 100 100" className="cover-svg">
        <defs>
          <linearGradient id={g('bg')} gradientTransform={`rotate(${sleeve.angle} .5 .5)`}>
            <stop offset="0%" stopColor={p1} />
            <stop offset="55%" stopColor={p2} />
            <stop offset="100%" stopColor={p3} />
          </linearGradient>
          <radialGradient id={g('gloss')} cx="30%" cy="18%" r="70%">
            <stop offset="0%" stopColor="#fff" stopOpacity=".55" />
            <stop offset="60%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100" height="100" fill={`url(#${g('bg')})`} />

        {sleeve.layout === 0 && (
          <>
            <circle cx={sleeve.cx} cy={sleeve.cy} r={sleeve.r1} fill="#fff" opacity=".22" />
            <circle cx={100 - sleeve.cx} cy={100 - sleeve.cy} r={sleeve.r2} fill="#000" opacity=".16" />
          </>
        )}
        {sleeve.layout === 1 && (
          <g opacity=".3">
            {Array.from({ length: sleeve.bands }, (_, i) => (
              <rect key={i} x="0" y={i * (100 / sleeve.bands)} width="100" height={100 / sleeve.bands / 2} fill="#fff" />
            ))}
          </g>
        )}
        {sleeve.layout === 2 && (
          <>
            <polygon points={`50,${sleeve.r1} ${100 - sleeve.r1},${100 - sleeve.r1} ${sleeve.r1},${100 - sleeve.r1}`} fill="#fff" opacity=".28" />
            <circle cx="50" cy="50" r="14" fill="#000" opacity=".22" />
          </>
        )}
        {sleeve.layout === 3 && (
          <g opacity=".26" stroke="#fff" strokeWidth="2" fill="none">
            {Array.from({ length: 6 }, (_, i) => (
              <circle key={i} cx={sleeve.cx} cy={sleeve.cy} r={8 + i * 9} />
            ))}
          </g>
        )}
        {sleeve.layout === 4 && (
          <>
            <path d={`M0 ${60 + sleeve.r1 / 3} Q 25 ${30 + sleeve.r1 / 2} 50 ${60 + sleeve.r1 / 3} T 100 ${60 + sleeve.r1 / 3} V100 H0Z`} fill="#000" opacity=".2" />
            <path d={`M0 ${72 + sleeve.r1 / 4} Q 28 ${42 + sleeve.r1 / 3} 55 ${72 + sleeve.r1 / 4} T 100 ${72 + sleeve.r1 / 4} V100 H0Z`} fill="#fff" opacity=".24" />
          </>
        )}

        <rect width="100" height="100" fill={`url(#${g('gloss')})`} />
        <rect x=".5" y=".5" width="99" height="99" fill="none" stroke="rgba(255,255,255,.4)" />
      </svg>

      {real && (
        <img
          className={`cover-photo ${loaded ? 'is-loaded' : ''}`}
          src={real}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      )}

      <span className="cover-year">{song.year}</span>
      <span className="cover-flag">{sleeve.flag}</span>
      <span className="cover-shine" />
    </div>
  );
}
