import { NavLink } from 'react-router-dom';
import { useSound } from '@/hooks/useSound';
import { useProfile } from '@/context/ProfileContext';
import { COUNTRIES } from '@/data/countries';
import { SONGS } from '@/data/songs';
import { Flag } from '@/components/music/Flag';

const NAV = [
  { to: '/', label: 'Listening Room', icon: '◈', end: true },
  { to: '/atlas', label: 'Country Atlas', icon: '🌐' },
  { to: '/catalogue', label: 'The Catalogue', icon: '♫' },
  { to: '/community', label: 'Community', icon: '☺' },
  { to: '/submit', label: 'Submit a Song', icon: '✚' },
];

const ME = [
  { to: '/profile', label: 'My Profile', icon: '☻' },
  { to: '/studio', label: 'Profile Studio', icon: '⚙' },
  { to: '/about', label: 'About MUSIKA', icon: '?' },
];

export function SideRail({ open, onClose }) {
  const { play } = useSound();
  const { profile } = useProfile();

  const item = (n) => (
    <NavLink
      key={n.to}
      to={n.to}
      end={n.end}
      className={({ isActive }) => `rail-link ${isActive ? 'is-active' : ''}`}
      onPointerEnter={() => play('hover')}
      onClick={() => { play('nav'); onClose?.(); }}
    >
      <span className="rail-icon">{n.icon}</span>
      <span className="grow truncate">{n.label}</span>
      <span className="rail-marker" />
    </NavLink>
  );

  return (
    <>
      <div className={`rail-scrim ${open ? 'is-open' : ''}`} onClick={onClose} />
      <nav className={`rail glass ${open ? 'is-open' : ''}`} aria-label="Main">
        <div className="stack gap-1 anim-rail">{NAV.map(item)}</div>

        <div className="rule" style={{ margin: 'var(--sp-4) 0 var(--sp-3)' }}>You</div>
        <div className="stack gap-1">{ME.map(item)}</div>

        <div className="rule" style={{ margin: 'var(--sp-4) 0 var(--sp-3)' }}>Passport</div>
        <div className="rail-passport">
          {profile.visited.slice(0, 12).map((id) => {
            const c = COUNTRIES.find((x) => x.id === id);
            if (!c) return null;
            return (
              <NavLink
                key={id}
                to={`/country/${id}`}
                className="rail-flag tip"
                data-tip={c.name}
                onPointerEnter={() => play('hover')}
                onClick={() => { play('nav'); onClose?.(); }}
              >
                <Flag code={c.id} size="sm" />
              </NavLink>
            );
          })}
        </div>

        <div className="rail-foot">
          <div className="tiny muted">
            {SONGS.length} songs · {COUNTRIES.length} countries
          </div>
          <div className="tiny muted">Built on air and glass.</div>
        </div>
      </nav>
    </>
  );
}
