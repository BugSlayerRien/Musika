import { Link } from 'react-router-dom';
import { CoverArt } from '@/components/music/CoverArt';
import { AeroButton } from '@/components/aero/AeroButton';
import { Panel, Chip } from '@/components/aero/Controls';
import { usePlayer } from '@/context/PlayerContext';
import { useSound } from '@/hooks/useSound';
import { artistById, artistsByCountry } from '@/data/artists';
import { countryById } from '@/data/countries';
import { songsByArtist, formatCount, SONGS } from '@/data/songs';
import { Flag } from '@/components/music/Flag';

/* ---------------- Country ---------------- */
export function CountryCard({ country }) {
  const { play } = useSound();
  const bands = artistsByCountry(country.id).length;
  const songs = SONGS.filter((s) => artistById(s.artist)?.country === country.id).length;
  const [c1, c2, c3] = country.palette;

  return (
    <Link
      to={`/country/${country.id}`}
      onPointerEnter={() => play('hover')}
      onClick={() => play('confirm')}
    >
      <Panel pad={false} className="country-card glass-interactive" style={{ '--c1': c1, '--c2': c2, '--c3': c3 }}>
        <div className="country-banner">
          <Flag code={country.id} size="xl" className="country-flag" />
        </div>
        <div className="country-body">
          <div className="row between gap-2">
            <h4 className="truncate">{country.name}</h4>
            <Chip tone="violet">{country.scene}</Chip>
          </div>
          <p className="small muted clamp-2" style={{ margin: 0 }}>{country.tagline}</p>
          <div className="row gap-3 tiny muted" style={{ marginTop: 4 }}>
            <span>{bands} bands</span>
            <span>·</span>
            <span>{songs} songs</span>
            <span>·</span>
            <span>since {country.since}</span>
          </div>
        </div>
      </Panel>
    </Link>
  );
}

/* ---------------- Artist ---------------- */
export function ArtistCard({ artist }) {
  const { play } = useSound();
  const country = countryById(artist.country);
  const count = songsByArtist(artist.id).length;
  const initials = artist.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const [c1, c2] = country?.palette ?? ['#8b5cf6', '#22d3ee'];

  return (
    <Link to={`/artist/${artist.id}`} onPointerEnter={() => play('hover')} onClick={() => play('confirm')}>
      <Panel pad={false} className="artist-card glass-interactive">
        <span className="artist-avatar" style={{ '--c1': c1, '--c2': c2 }}>{initials}</span>
        <div className="stack grow" style={{ minWidth: 0 }}>
          <strong className="truncate">{artist.name}</strong>
          <span className="tiny muted truncate">{artist.genre} · {artist.city}</span>
          <span className="tiny soft row gap-2"><Flag code={artist.country} size="sm" /> {country?.name} · formed {artist.formed}</span>
        </div>
        <Chip>{count} {count === 1 ? 'entry' : 'entries'}</Chip>
      </Panel>
    </Link>
  );
}

/* ---------------- Song tile ---------------- */
export function SongCard({ song, queue }) {
  const { playSong } = usePlayer();
  const { play } = useSound();
  const artist = artistById(song.artist);
  const country = countryById(artist?.country);

  return (
    <Panel pad={false} className="song-card glass-interactive" onPointerEnter={() => play('hover')}>
      <div className="song-card-art">
        <Link to={`/song/${song.id}`}>
          <CoverArt song={song} size="100%" className="song-card-cover" />
        </Link>
        <AeroButton
          icon variant="primary"
          className="song-card-play"
          sound={null}
          onClick={() => { play('play'); playSong(song.id, queue); }}
          aria-label={`Play ${song.title}`}
        >▶</AeroButton>
      </div>
      <div className="stack" style={{ minWidth: 0 }}>
        <Link to={`/song/${song.id}`} className="truncate" style={{ fontWeight: 600 }}>{song.title}</Link>
        <Link to={`/artist/${artist?.id}`} className="tiny soft truncate">{artist?.name}</Link>
        <div className="row between tiny muted" style={{ marginTop: 4 }}>
          <span className="row gap-2"><Flag code={artist?.country} size="sm" /> {song.year}</span>
          <span>♥ {formatCount(song.hearts)}</span>
        </div>
      </div>
    </Panel>
  );
}
