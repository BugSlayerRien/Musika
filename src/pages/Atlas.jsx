import { useMemo, useState } from 'react';
import { Panel, Segmented, Field, Chip, Empty } from '@/components/aero/Controls';
import { CountryCard } from '@/components/music/Cards';
import { COUNTRIES, REGIONS } from '@/data/countries';
import { ARTISTS } from '@/data/artists';
import { SONGS } from '@/data/songs';
import { artistById } from '@/data/artists';

export function Atlas() {
  const [region, setRegion] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('entries');

  const counts = useMemo(() => {
    const m = {};
    SONGS.forEach((s) => {
      const c = artistById(s.artist)?.country;
      if (c) m[c] = (m[c] ?? 0) + 1;
    });
    return m;
  }, []);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    let out = COUNTRIES.filter((c) => {
      if (region !== 'all' && c.region !== region) return false;
      if (!t) return true;
      return c.name.toLowerCase().includes(t)
        || c.scene.toLowerCase().includes(t)
        || c.region.toLowerCase().includes(t);
    });
    out = [...out].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'oldest') return a.since - b.since;
      return (counts[b.id] ?? 0) - (counts[a.id] ?? 0);
    });
    return out;
  }, [region, q, sort, counts]);

  return (
    <>
      <div className="page-head">
        <span className="caps" style={{ color: 'var(--aura-3)' }}>The atlas</span>
        <h1>Every room, <span className="iridescent">every scene</span>.</h1>
        <p className="lede">
          {COUNTRIES.length} countries, {ARTISTS.length} bands, {SONGS.length} entries. Pick a room
          and listen to what a place decided its English-language standards were.
        </p>
      </div>

      <Panel pad="sm">
        <div className="row between wrap gap-3">
          <div className="row wrap gap-2">
            <Chip
              tone={region === 'all' ? undefined : undefined}
              active={region === 'all'}
              onClick={() => setRegion('all')}
            >
              All regions
            </Chip>
            {REGIONS.map((r) => (
              <Chip key={r} active={region === r} onClick={() => setRegion(r)}>{r}</Chip>
            ))}
          </div>
          <div className="row gap-3">
            <Segmented
              value={sort}
              onChange={setSort}
              ariaLabel="Sort countries"
              options={[
                { id: 'entries', label: 'Most filed' },
                { id: 'name', label: 'A–Z' },
                { id: 'oldest', label: 'Oldest scene' },
              ]}
            />
            <div style={{ width: 200 }}>
              <Field value={q} onChange={setQ} placeholder="Filter…" />
            </div>
          </div>
        </div>
      </Panel>

      {list.length ? (
        <div className="card-grid stagger">
          {list.map((c) => <CountryCard key={c.id} country={c} />)}
        </div>
      ) : (
        <Panel>
          <Empty icon="🌐" title="No rooms match that">
            Try a different region, or clear the filter.
          </Empty>
        </Panel>
      )}
    </>
  );
}
