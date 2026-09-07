import { useId } from 'react';
import './orb.css';

/**
 * The avatar. A procedurally drawn glass marble — pattern, two
 * colours, an emblem and a frame — so a member gets a distinctive
 * picture without ever uploading a file.
 */
export function Orb({ config, size = 96, spinning, className = '', title }) {
  const uid = useId().replace(/[:]/g, '');
  const { pattern = 'bubble', emblem = '♪', colors = ['#8b5cf6', '#22d3ee'], frame = 'iris' } = config || {};
  const [c1, c2] = colors;
  const spin = spinning ?? config?.spin;

  const g = (n) => `${uid}-${n}`;

  return (
    <div
      className={`orb frame-${frame} ${className}`}
      style={{ '--orb-size': `${size}px`, '--c1': c1, '--c2': c2 }}
      title={title}
    >
      <svg viewBox="0 0 100 100" className={`orb-svg ${spin ? 'orb-spin' : ''}`} role="img" aria-label={title || 'avatar'}>
        <defs>
          <radialGradient id={g('body')} cx="34%" cy="28%" r="82%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity=".95" />
            <stop offset="26%" stopColor={c1} stopOpacity=".9" />
            <stop offset="72%" stopColor={c2} />
            <stop offset="100%" stopColor="#150534" />
          </radialGradient>
          <radialGradient id={g('shine')} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity=".95" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={g('sweep')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c1} stopOpacity=".9" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity=".5" />
            <stop offset="100%" stopColor={c2} stopOpacity=".9" />
          </linearGradient>
          <clipPath id={g('clip')}>
            <circle cx="50" cy="50" r="47" />
          </clipPath>
        </defs>

        <circle cx="50" cy="50" r="47" fill={`url(#${g('body')})`} />

        <g clipPath={`url(#${g('clip')})`} opacity=".85">
          {pattern === 'swirl' && (
            <path
              d="M50 6 C78 18 84 48 62 62 C46 72 28 64 30 48 C32 34 48 30 54 40"
              fill="none" stroke={`url(#${g('sweep')})`} strokeWidth="7" strokeLinecap="round"
            />
          )}
          {pattern === 'prism' && (
            <>
              <polygon points="50,10 88,72 12,72" fill={`url(#${g('sweep')})`} opacity=".55" />
              <polygon points="50,26 74,66 26,66" fill="#fff" opacity=".22" />
            </>
          )}
          {pattern === 'wave' && (
            <>
              <path d="M-5 62 Q 20 46 45 62 T 105 62 V110 H-5Z" fill={c2} opacity=".55" />
              <path d="M-5 72 Q 22 56 48 72 T 105 72 V110 H-5Z" fill="#fff" opacity=".22" />
            </>
          )}
          {pattern === 'starburst' && (
            <g stroke={`url(#${g('sweep')})`} strokeWidth="4" strokeLinecap="round">
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return (
                  <line
                    key={i}
                    x1={50 + Math.cos(a) * 14} y1={50 + Math.sin(a) * 14}
                    x2={50 + Math.cos(a) * 44} y2={50 + Math.sin(a) * 44}
                  />
                );
              })}
            </g>
          )}
          {pattern === 'grid' && (
            <g stroke="#fff" strokeWidth="1.6" opacity=".4">
              {Array.from({ length: 7 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 16 + 4} x2="100" y2={i * 16 + 4} />
              ))}
              {Array.from({ length: 7 }, (_, i) => (
                <line key={`v${i}`} x1={i * 16 + 4} y1="0" x2={i * 16 + 4} y2="100" />
              ))}
            </g>
          )}
          {pattern === 'droplet' && (
            <>
              <circle cx="38" cy="40" r="17" fill="#fff" opacity=".2" />
              <circle cx="63" cy="58" r="24" fill={c2} opacity=".45" />
              <circle cx="63" cy="58" r="24" fill="none" stroke="#fff" strokeOpacity=".4" />
            </>
          )}
          {pattern === 'nebula' && (
            <>
              <ellipse cx="42" cy="46" rx="40" ry="18" fill={c1} opacity=".5" transform="rotate(-24 42 46)" />
              <ellipse cx="58" cy="58" rx="34" ry="13" fill={c2} opacity=".55" transform="rotate(18 58 58)" />
              {Array.from({ length: 9 }, (_, i) => (
                <circle key={i} cx={12 + i * 9.5} cy={26 + ((i * 37) % 50)} r="1.4" fill="#fff" opacity=".8" />
              ))}
            </>
          )}
          {pattern === 'bubble' && (
            <>
              <circle cx="32" cy="64" r="13" fill="#fff" opacity=".16" stroke="#fff" strokeOpacity=".4" />
              <circle cx="66" cy="72" r="9" fill="#fff" opacity=".14" stroke="#fff" strokeOpacity=".35" />
              <circle cx="72" cy="36" r="6" fill="#fff" opacity=".2" stroke="#fff" strokeOpacity=".4" />
            </>
          )}
        </g>

        {/* glass dome highlight */}
        <ellipse cx="36" cy="27" rx="24" ry="14" fill={`url(#${g('shine')})`} opacity=".85" />
        <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,.65)" strokeWidth="1.5" />
      </svg>

      {emblem && <span className="orb-emblem">{emblem}</span>}
      {frame === 'orbit' && <span className="orb-orbit" />}
      {frame === 'bubbleframe' && (
        <>
          <span className="orb-mini orb-mini-1" />
          <span className="orb-mini orb-mini-2" />
          <span className="orb-mini orb-mini-3" />
        </>
      )}
    </div>
  );
}
