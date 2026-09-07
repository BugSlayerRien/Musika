import { useEffect, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Panel, SectionTitle, Chip, Empty } from '@/components/aero/Controls';
import { AeroButton } from '@/components/aero/AeroButton';
import { ArtistCard } from '@/components/music/Cards';
import { SongList } from '@/components/music/SongRow';
import { Orb } from '@/components/profile/Orb';
import { usePlayer } from '@/context/PlayerContext';
import { useProfile } from '@/context/ProfileContext';
import { countryById } from '@/data/countries';
import { artistsByCountry, artistById } from '@/data/artists';
import { SONGS, formatCount, decadeOf } from '@/data/songs';
import { memberByHandle } from '@/data/profilePresets';
import { Flag } from '@/components/music/Flag';

export function CountryPage() {
  const { id } = useParams();
  const country = countryById(id);
  const { playSong } = usePlayer();
  const { visitCountry } = useProfile();

  useEffect(() => { if (country) visitCountry(country.id); }, [country, visitCountry]);

  const bands = useMemo(() => (country ? artistsByCountry(country.id) : []), [country]);
  const songs = useMemo(
    () => SONGS.filter((s) => artistById(s.artist)?.country === id)
      .sort((a, b) => a.year - b.year),
    [id],
  );

  const byDecade = useMemo(() => {
    const m = new Map();
    songs.forEach((s) => {
      const d = decadeOf(s.year);
      m.set(d, [...(m.get(d) ?? []), s]);
    });
    return [...m.entries()];
  }, [songs]);

  const curators = useMemo(() => {
    const handles = [...new Set(songs.map((s) => s.submittedBy))];
    return handles.map(memberByHandle).filter(Boolean).slice(0, 8);
  }, [songs]);

  if (!country) return <Navigate to="/atlas" replace />;
  const [c1, c2, c3] = country.palette;

  return (
    <>
      <Panel
        className="hero"
        irisEdge
        elevation="deep"
        style={{ '--c1': c1, '--c2': c2, '--c3': c3 }}
      >
        <div className="hero-grid">
          <div className="stack gap-4">
            <div className="row gap-3 wrap">
              <Chip tone="violet">{country.region}</Chip>
              <Chip tone="aqua">{country.scene}</Chip>
              <Chip>scene since {country.since}</Chip>
            </div>
            <h1>
              <Flag code={country.id} size="xl" style={{ marginRight: 12 }} />
              <span className="iridescent">{country.name}</span>
            </h1>
            <p className="lede">{country.blurb}</p>
            <div className="row gap-3 wrap">
              <AeroButton
                variant="primary" size="lg" sound="play"
                onClick={() => songs[0] && playSong(songs[0].id, songs.map((s) => s.id))}
                disabled={!songs.length}
              >
                ▶ Play the room
              </AeroButton>
              <AeroButton to="/submit" variant="ghost" size="lg">✚ Add to this room</AeroButton>
            </div>
            <div className="hero-stats">
              <span className="hero-stat"><b>{songs.length}</b><span className="tiny muted">entries</span></span>
              <span className="hero-stat"><b>{bands.length}</b><span className="tiny muted">bands</span></span>
              <span className="hero-stat">
                <b>{songs.length ? Math.min(...songs.map((s) => s.year)) : '—'}</b>
                <span className="tiny muted">earliest</span>
              </span>
              <span className="hero-stat">
                <b>{formatCount(songs.reduce((n, s) => n + s.plays, 0))}</b>
                <span className="tiny muted">plays</span>
              </span>
            </div>
          </div>

          <Panel elevation="flat" className="stack gap-3">
            <span className="caps" style={{ color: 'var(--aura-3)' }}>Curators of this room</span>
            {curators.length ? curators.map((m) => (
              <div key={m.handle} className="row gap-3">
                <Orb config={m.orb} size={36} spinning={false} />
                <div className="stack grow" style={{ minWidth: 0 }}>
                  <span className="small truncate" style={{ fontWeight: 500 }}>{m.name}</span>
                  <span className="tiny muted truncate">@{m.handle} · {m.title}</span>
                </div>
              </div>
            )) : <p className="small muted">Nobody has filed here yet.</p>}
          </Panel>
        </div>
      </Panel>

      {songs.length === 0 ? (
        <Panel>
          <Empty icon="📻" title="This room is empty">
            No English-language classics filed under {country.name} yet. If you know one, you can be
            the first pressing.
            <div style={{ marginTop: 'var(--sp-4)' }}>
              <AeroButton to="/submit" variant="primary">✚ File the first song</AeroButton>
            </div>
          </Empty>
        </Panel>
      ) : (
        <>
          {byDecade.map(([decade, list]) => (
            <Panel key={decade}>
              <SectionTitle
                eyebrow={decade}
                title={`The ${decade.replace('19', "'").replace('20', "'")} shelf`}
                sub={`${list.length} ${list.length === 1 ? 'entry' : 'entries'} filed from this decade.`}
                action={(
                  <AeroButton
                    variant="ghost" size="sm" sound="play"
                    onClick={() => playSong(list[0].id, list.map((s) => s.id))}
                  >▶ Play shelf</AeroButton>
                )}
              />
              <SongList songs={list} queue={list.map((s) => s.id)} showCountry={false} />
            </Panel>
          ))}

          <section className="stack gap-4">
            <SectionTitle eyebrow="Who made them" title={`Bands of ${country.name}`} />
            <div className="card-grid stagger">
              {bands.map((a) => <ArtistCard key={a.id} artist={a} />)}
            </div>
          </section>
        </>
      )}
    </>
  );
}
