import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AeroButton } from '@/components/aero/AeroButton';
import { Orb } from '@/components/profile/Orb';
import { useProfile } from '@/context/ProfileContext';
import { useSound } from '@/hooks/useSound';
import { SONGS } from '@/data/songs';
import { ARTISTS } from '@/data/artists';
import { COUNTRIES } from '@/data/countries';

/** Global search across songs, artists and countries. */
function search(q) {
  const t = q.trim().toLowerCase();
  if (t.length < 2) return [];
  const hits = [];
  COUNTRIES.forEach((c) => {
    if (c.name.toLowerCase().includes(t) || c.scene.toLowerCase().includes(t)) {
      hits.push({ kind: 'country', id: c.id, label: c.name, sub: `${c.scene} · ${c.region}`, icon: c.id.toUpperCase() });
    }
  });
  ARTISTS.forEach((a) => {
    if (a.name.toLowerCase().includes(t) || a.genre.toLowerCase().includes(t)) {
      hits.push({ kind: 'artist', id: a.id, label: a.name, sub: `${a.genre} · ${a.city}`, icon: '♫' });
    }
  });
  SONGS.forEach((s) => {
    if (s.title.toLowerCase().includes(t) || s.album.toLowerCase().includes(t)
      || s.tags.some((g) => g.includes(t))) {
      hits.push({ kind: 'song', id: s.id, label: s.title, sub: `${s.year} · ${s.album}`, icon: '♪' });
    }
  });
  return hits.slice(0, 8);
}

export function TopBar({ onMenu }) {
  const { profile } = useProfile();
  const { play } = useSound();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const results = search(q);

  useEffect(() => {
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        boxRef.current?.querySelector('input')?.focus();
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const go = (hit) => {
    play('confirm');
    setOpen(false);
    setQ('');
    const path = hit.kind === 'country' ? `/country/${hit.id}`
      : hit.kind === 'artist' ? `/artist/${hit.id}`
        : `/song/${hit.id}`;
    nav(path);
  };

  return (
    <header className="topbar glass">
      <AeroButton icon variant="ghost" className="only-mobile" onClick={onMenu} aria-label="Menu">☰</AeroButton>

      <Link to="/" className="brand" onPointerEnter={() => play('hover')} onClick={() => play('nav')}>
        <span className="brand-mark">
          <span className="brand-mark-inner" />
        </span>
        <span className="stack">
          <span className="brand-word iridescent">MUSIKA</span>
          <span className="brand-sub tiny">Classic English songs of the world</span>
        </span>
      </Link>

      <div className="searchbox" ref={boxRef}>
        <span className="searchbox-icon">⌕</span>
        <input
          className="input"
          placeholder="Search songs, bands, countries…   /"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); play('type'); }}
          onFocus={() => setOpen(true)}
          aria-label="Search the catalogue"
        />
        {open && results.length > 0 && (
          <div className="search-results glass anim-rise">
            {results.map((r) => (
              <button
                key={`${r.kind}-${r.id}`}
                className="search-hit"
                onPointerEnter={() => play('hover')}
                onClick={() => go(r)}
              >
                <span className="search-hit-icon">{r.icon}</span>
                <span className="stack grow">
                  <span className="truncate">{r.label}</span>
                  <span className="tiny muted truncate">{r.sub}</span>
                </span>
                <span className="chip">{r.kind}</span>
              </button>
            ))}
          </div>
        )}
        {open && q.trim().length >= 2 && results.length === 0 && (
          <div className="search-results glass anim-rise">
            <div className="search-hit muted small">Nothing filed under “{q}” yet.</div>
          </div>
        )}
      </div>

      <div className="row gap-2 topbar-right">
        <AeroButton to="/submit" variant="aqua" size="sm" className="hide-sm">✚ Submit a song</AeroButton>
        <AeroButton to="/studio" icon variant="ghost" className="tip" data-tip="Profile Studio">⚙</AeroButton>
        <Link to="/profile" className="topbar-orb" onPointerEnter={() => play('hover')} onClick={() => play('nav')}>
          <Orb config={profile.orb} size={40} title={profile.name} />
        </Link>
      </div>
    </header>
  );
}
