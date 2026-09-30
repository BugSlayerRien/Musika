import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Panel, SectionTitle, Chip, Empty } from '@/components/aero/Controls';
import { AeroButton } from '@/components/aero/AeroButton';
import { SongList } from '@/components/music/SongRow';
import { ArtistCard } from '@/components/music/Cards';
import { usePlayer } from '@/context/PlayerContext';
import { artistById, artistsByCountry } from '@/data/artists';
import { countryById } from '@/data/countries';
import { songsByArtist, formatCount } from '@/data/songs';
import { Flag } from '@/components/music/Flag';
import { countryConfirmed, musicBrainzUrl } from '@/data/verified';

export function ArtistPage() {
  const { id } = useParams();
  const artist = artistById(id);
  const { playSong } = usePlayer();

  const songs = useMemo(
    () => (artist ? songsByArtist(artist.id).sort((a, b) => a.year - b.year) : []),
    [artist],
  );
  const siblings = useMemo(
    () => (artist ? artistsByCountry(artist.country).filter((a) => a.id !== artist.id).slice(0, 4) : []),
    [artist],
  );

  if (!artist) return <Navigate to="/catalogue" replace />;
  const country = countryById(artist.country);
  const [c1, c2] = country?.palette ?? ['#8b5cf6', '#22d3ee'];
  const initials = artist.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <>
      <Panel className="hero" irisEdge elevation="deep">
        <div className="row gap-5 wrap" style={{ alignItems: 'flex-start' }}>
          <span
            className="artist-avatar anim-float"
            style={{ '--c1': c1, '--c2': c2, width: 110, height: 110, fontSize: 36 }}
          >
            {initials}
          </span>
          <div className="stack gap-3 grow" style={{ minWidth: 260 }}>
            <div className="row gap-2 wrap">
              <Link to={`/country/${country?.id}`}>
                <Chip tone="violet"><Flag code={artist.country} size="sm" /> {country?.name}</Chip>
              </Link>
              <Chip tone="aqua">{artist.genre}</Chip>
              <Chip>formed {artist.formed}</Chip>
              <Chip>{artist.city}</Chip>
              {countryConfirmed(artist.id) && (
                <a href={musicBrainzUrl(artist.id)} target="_blank" rel="noreferrer"
                   className="tip" data-tip="Country independently confirmed by MusicBrainz">
                  <Chip tone="mint">✓ MusicBrainz</Chip>
                </a>
              )}
            </div>
            <h1><span className="iridescent">{artist.name}</span></h1>
            <p className="lede">{artist.blurb}</p>
            <div className="row gap-2 wrap">
              {artist.tags.map((t) => <Chip key={t}>#{t}</Chip>)}
            </div>
            <div className="row gap-3 wrap" style={{ marginTop: 8 }}>
              <AeroButton
                variant="primary" sound="play"
                disabled={!songs.length}
                onClick={() => songs[0] && playSong(songs[0].id, songs.map((s) => s.id))}
              >
                ▶ Play {songs.length || 'no'} {songs.length === 1 ? 'entry' : 'entries'}
              </AeroButton>
              <AeroButton to="/submit" variant="ghost">✚ File another of theirs</AeroButton>
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <SectionTitle
          eyebrow="Filed under English"
          title="Entries in the atlas"
          sub="Only the English-language songs are catalogued here — that is the whole premise."
          action={songs.length ? (
            <span className="tiny muted">{formatCount(songs.reduce((n, s) => n + s.plays, 0))} plays</span>
          ) : null}
        />
        {songs.length ? (
          <SongList songs={songs} queue={songs.map((s) => s.id)} showCountry={false} />
        ) : (
          <Empty icon="◌" title="Nothing filed yet">
            No member has submitted an English-language {artist.name} song. If you know one, file it.
            <div style={{ marginTop: 'var(--sp-4)' }}>
              <AeroButton to="/submit" variant="primary">✚ Submit a song</AeroButton>
            </div>
          </Empty>
        )}
      </Panel>

      {siblings.length > 0 && (
        <section className="stack gap-4">
          <SectionTitle eyebrow="Same room" title={`Also from ${country?.name}`} />
          <div className="card-grid stagger">
            {siblings.map((a) => <ArtistCard key={a.id} artist={a} />)}
          </div>
        </section>
      )}
    </>
  );
}
