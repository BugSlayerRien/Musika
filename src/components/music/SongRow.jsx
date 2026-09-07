import { Link, useNavigate } from 'react-router-dom';
import { CoverArt } from '@/components/music/CoverArt';
import { AeroButton } from '@/components/aero/AeroButton';
import { usePlayer } from '@/context/PlayerContext';
import { useProfile } from '@/context/ProfileContext';
import { useSound } from '@/hooks/useSound';
import { artistById } from '@/data/artists';
import { countryById } from '@/data/countries';
import { formatDuration, formatCount } from '@/data/songs';
import { Flag } from '@/components/music/Flag';

export function SongRow({ song, index, queue, showCountry = true }) {
  const { current, playing, playSong, toggle } = usePlayer();
  const { isHearted, toggleHeart } = useProfile();
  const { play } = useSound();
  const nav = useNavigate();

  const artist = artistById(song.artist);
  const country = countryById(artist?.country);
  const isCurrent = current?.id === song.id;
  const hearted = isHearted(song.id);

  const onPlay = () => {
    if (isCurrent) {
      play(playing ? 'pause' : 'play');
      toggle();
    } else {
      play('play');
      playSong(song.id, queue);
    }
  };

  return (
    <div
      className={`song-row ${isCurrent ? 'is-current' : ''}`}
      onPointerEnter={() => play('hover')}
      onDoubleClick={() => nav(`/song/${song.id}`)}
    >
      <button className="song-index" onClick={onPlay} aria-label={`Play ${song.title}`}>
        {isCurrent && playing
          ? <span className="eq-badge"><span /><span /><span /></span>
          : (index != null ? index + 1 : '▶')}
      </button>

      <button onClick={onPlay} aria-label={`Play ${song.title}`} style={{ display: 'block' }}>
        <CoverArt song={song} size={44} />
      </button>

      <div className="stack" style={{ minWidth: 0 }}>
        <Link to={`/song/${song.id}`} className="truncate" style={{ fontWeight: 500 }}>
          {song.title}
        </Link>
        <div className="row gap-2 tiny muted" style={{ minWidth: 0 }}>
          <Link to={`/artist/${artist?.id}`} className="truncate">{artist?.name}</Link>
          <span>·</span>
          <span>{song.year}</span>
          {showCountry && country && (
            <>
              <span>·</span>
              <Link to={`/country/${country.id}`} className="row gap-1"><Flag code={country.id} size="sm" /> {country.name}</Link>
            </>
          )}
        </div>
      </div>

      <div className="song-actions">
        <span className="tiny muted hide-sm">{formatCount(song.plays)} plays</span>
        <AeroButton
          icon size="sm" variant="ghost"
          className={`song-heart ${hearted ? 'is-on' : ''}`}
          sound={null}
          onClick={() => { play(hearted ? 'off' : 'heart'); toggleHeart(song.id); }}
          aria-label={hearted ? 'Unheart' : 'Heart'}
        >
          {hearted ? '♥' : '♡'}
        </AeroButton>
        <span className="tiny muted" style={{ fontVariantNumeric: 'tabular-nums', minWidth: 38, textAlign: 'right' }}>
          {formatDuration(song.seconds)}
        </span>
      </div>
    </div>
  );
}

export function SongList({ songs, queue, showCountry, numbered = true }) {
  const ids = queue ?? songs.map((s) => s.id);
  return (
    <div className="stack gap-1">
      {songs.map((s, i) => (
        <SongRow key={s.id} song={s} index={numbered ? i : null} queue={ids} showCountry={showCountry} />
      ))}
    </div>
  );
}
