import { useMemo, useState } from 'react';
import { Panel, Segmented, Field, Chip, Empty } from '@/components/aero/Controls';
import { AeroButton } from '@/components/aero/AeroButton';
import { SongCard } from '@/components/music/Cards';
import { SongList } from '@/components/music/SongRow';
import { usePlayer } from '@/context/PlayerContext';
import { SONGS, DECADES, ALL_TAGS, decadeOf } from '@/data/songs';
import { artistById } from '@/data/artists';
import { COUNTRIES } from '@/data/countries';

export function Catalogue() {
  const { playSong } = usePlayer();
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('all');
  const [decade, setDecade] = useState('all');
  const [tag, setTag] = useState('all');
  const [sort, setSort] = useState('hearts');
  const [view, setView] = useState('grid');
  const [allTags, setAllTags] = useState(false);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    let out = SONGS.filter((s) => {
      const a = artistById(s.artist);
      if (country !== 'all' && a?.country !== country) return false;
      if (decade !== 'all' && decadeOf(s.year) !== decade) return false;
      if (tag !== 'all' && !s.tags.includes(tag)) return false;
      if (!t) return true;
      return s.title.toLowerCase().includes(t)
        || a?.name.toLowerCase().includes(t)
        || s.album.toLowerCase().includes(t)
        || s.tags.some((g) => g.includes(t));
    });
    out = [...out].sort((a, b) => {
      if (sort === 'year') return a.year - b.year;
      if (sort === 'yearDesc') return b.year - a.year;
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'plays') return b.plays - a.plays;
      return b.hearts - a.hearts;
    });
    return out;
  }, [q, country, decade, tag, sort]);

  const ids = results.map((s) => s.id);
  const active = country !== 'all' || decade !== 'all' || tag !== 'all' || q.trim();

  return (
    <>
      <div className="page-head">
        <span className="caps" style={{ color: 'var(--aura-3)' }}>The catalogue</span>
        <h1>Every entry, <span className="iridescent">filterable</span>.</h1>
        <p className="lede">
          {SONGS.length} English-language classics filed by members from {COUNTRIES.length} countries.
        </p>
      </div>

      <Panel pad="sm" className="stack gap-4">
        <div className="row wrap gap-3 between">
          <div className="row gap-3 wrap grow">
            <div style={{ minWidth: 220, flex: '1 1 220px' }}>
              <Field value={q} onChange={setQ} placeholder="Search titles, bands, albums, tags…" />
            </div>
            <div style={{ minWidth: 170 }}>
              <Field
                as="select" value={country} onChange={setCountry}
                options={[{ value: 'all', label: 'All countries' },
                  ...COUNTRIES.map((c) => ({ value: c.id, label: `${c.id.toUpperCase()} — ${c.name}` }))]}
              />
            </div>
            <div style={{ minWidth: 150 }}>
              <Field
                as="select" value={sort} onChange={setSort}
                options={[
                  { value: 'hearts', label: 'Most hearted' },
                  { value: 'plays', label: 'Most played' },
                  { value: 'year', label: 'Oldest first' },
                  { value: 'yearDesc', label: 'Newest first' },
                  { value: 'title', label: 'A–Z' },
                ]}
              />
            </div>
          </div>
          <Segmented
            value={view}
            onChange={setView}
            ariaLabel="View mode"
            options={[{ id: 'grid', label: '▦ Grid' }, { id: 'list', label: '☰ List' }]}
          />
        </div>

        <div className="row wrap gap-2">
          <Chip active={decade === 'all'} onClick={() => setDecade('all')}>All decades</Chip>
          {DECADES.map((d) => (
            <Chip key={d.id} active={decade === d.id} onClick={() => setDecade(d.id)}>{d.label}</Chip>
          ))}
        </div>

        <div className="row wrap gap-2">
          <Chip active={tag === 'all'} onClick={() => setTag('all')}>All tags</Chip>
          {(allTags ? ALL_TAGS : ALL_TAGS.slice(0, 14)).map((t) => (
            <Chip key={t} active={tag === t} onClick={() => setTag(t)}>#{t}</Chip>
          ))}
          {ALL_TAGS.length > 14 && (
            <Chip onClick={() => setAllTags((v) => !v)}>
              {allTags ? '− fewer tags' : `+ ${ALL_TAGS.length - 14} more tags`}
            </Chip>
          )}
        </div>

        <div className="row between wrap gap-3">
          <span className="small muted">
            {results.length} {results.length === 1 ? 'entry' : 'entries'}
            {active ? ' matching' : ' in the atlas'}
          </span>
          <div className="row gap-2">
            {active && (
              <AeroButton
                variant="ghost" size="sm" sound="back"
                onClick={() => { setQ(''); setCountry('all'); setDecade('all'); setTag('all'); }}
              >
                Clear filters
              </AeroButton>
            )}
            <AeroButton
              variant="primary" size="sm" sound="play"
              disabled={!results.length}
              onClick={() => playSong(ids[0], ids)}
            >
              ▶ Play these
            </AeroButton>
          </div>
        </div>
      </Panel>

      {results.length === 0 ? (
        <Panel>
          <Empty icon="🔎" title="No entries match">
            Nothing filed under that combination yet — which might mean you should file it.
            <div style={{ marginTop: 'var(--sp-4)' }}>
              <AeroButton to="/submit" variant="primary">✚ Submit a song</AeroButton>
            </div>
          </Empty>
        </Panel>
      ) : view === 'grid' ? (
        <div className="card-grid card-grid-sm stagger">
          {results.map((s) => <SongCard key={s.id} song={s} queue={ids} />)}
        </div>
      ) : (
        <Panel><SongList songs={results} queue={ids} /></Panel>
      )}
    </>
  );
}
