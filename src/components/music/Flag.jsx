import { countryById } from '@/data/countries';
import './flag.css';

/**
 * Country marker.
 *
 * Flag emoji are unreliable — Windows renders regional-indicator
 * pairs as bare letters — so a country is shown as a small enamel
 * badge carrying its ISO code, tinted with that country's own
 * palette. Same look on every platform, and it fits the glass.
 */
export function Flag({ code, size = 'md', className = '', style, ...rest }) {
  const c = countryById(code);
  if (!c) return null;
  const [c1, c2] = c.palette;
  return (
    <span
      className={`flag flag-${size} ${className}`}
      style={{ '--f1': c1, '--f2': c2, ...style }}
      title={c.name}
      aria-label={c.name}
      {...rest}
    >
      {c.id.toUpperCase()}
    </span>
  );
}
