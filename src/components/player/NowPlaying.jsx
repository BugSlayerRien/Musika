import { Link } from 'react-router-dom';
import { AeroButton } from '@/components/aero/AeroButton';
import { Visualizer } from '@/components/player/Visualizer';
import { CoverArt } from '@/components/music/CoverArt';
import { usePlayer } from '@/context/PlayerContext';
import { useProfile } from '@/context/ProfileContext';
import { useSound } from '@/hooks/useSound';
import { artistById } from '@/data/artists';
import { countryById } from '@/data/countries';
import { formatDuration } from '@/data/songs';
import './nowplaying.css';
import { Flag } from '@/components/music/Flag';

export function NowPlaying() {
  const {
    current, playing, toggle, next, prev, position, progress, seek,
    shuffle, setShuffle, repeat, setRepeat, mode, buffering, duration,
  } = usePlayer();
  const { isHearted, toggleHeart } = useProfile();
  const { play } = useSound();

  if (!current) return null;
  const artist = artistById(current.artist);
  const country = countryById(artist?.country);
  const hearted = isHearted(current.id);

  const cycleRepeat = () => {
    const order = ['off', 'all', 'one'];
    const nextMode = order[(order.indexOf(repeat) + 1) % 3];
    play(nextMode === 'off' ? 'off' : 'on');
    setRepeat(nextMode);
  };

  return (
    <footer className="nowplaying glass">
      <div
        className="np-seek"
        role="slider"
        aria-label="Seek"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onClick={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          seek(((e.clientX - box.left) / box.width) * duration);
          play('click');
        }}
      >
        <div className="np-seek-fill" style={{ width: `${progress * 100}%` }}>
          <span className="np-seek-head" />
        </div>
      </div>

      <div className="np-body">
        <div className="np-track">
          <CoverArt song={current} size={56} spinning={playing} />
          <div className="stack grow" style={{ minWidth: 0 }}>
            <Link to={`/song/${current.id}`} className="np-title truncate" onPointerEnter={() => play('hover')}>
              {current.title}
            </Link>
            <div className="row gap-2" style={{ minWidth: 0 }}>
              <Link to={`/artist/${artist?.id}`} className="tiny soft truncate" onPointerEnter={() => play('hover')}>
                {artist?.name}
              </Link>
              {country && (
                <Link to={`/country/${country.id}`} className="tiny muted" onPointerEnter={() => play('hover')}>
                  <Flag code={country.id} size="sm" /> {country.name}
                </Link>
              )}
            </div>
          </div>
          <span className={`np-mode tip ${mode === 'stream' ? 'is-real' : ''}`}
                data-tip={mode === 'stream'
                  ? '30-second preview of the real recording'
                  : 'Synthesised motif — no preview published for this entry'}>
            {buffering ? '···' : mode === 'stream' ? '30s' : '~'}
          </span>
          <AeroButton
            icon size="sm" variant="ghost"
            className={`np-heart ${hearted ? 'is-on' : ''}`}
            sound={null}
            onClick={() => { play(hearted ? 'off' : 'heart'); toggleHeart(current.id); }}
            aria-label={hearted ? 'Remove from hearted' : 'Add to hearted'}
          >
            {hearted ? '♥' : '♡'}
          </AeroButton>
        </div>

        <div className="np-transport">
          <AeroButton
            icon size="sm" variant="ghost"
            active={shuffle}
            sound={null}
            onClick={() => { play(shuffle ? 'off' : 'on'); setShuffle(!shuffle); }}
            className="tip hide-sm" data-tip="Shuffle"
          >⤨</AeroButton>
          <AeroButton icon variant="ghost" sound="back" onClick={prev} aria-label="Previous">⏮</AeroButton>
          <AeroButton
            icon size="lg" variant="primary"
            sound={null}
            onClick={() => { play(playing ? 'pause' : 'play'); toggle(); }}
            aria-label={playing ? 'Pause' : 'Play'}
            className="np-play"
          >
            {playing ? '❚❚' : '▶'}
          </AeroButton>
          <AeroButton icon variant="ghost" sound="click" onClick={next} aria-label="Next">⏭</AeroButton>
          <AeroButton
            icon size="sm" variant="ghost"
            active={repeat !== 'off'}
            sound={null}
            onClick={cycleRepeat}
            className="tip hide-sm" data-tip={`Repeat: ${repeat}`}
          >{repeat === 'one' ? '↻¹' : '↻'}</AeroButton>
        </div>

        <div className="np-meta">
          <Visualizer playing={playing} bars={28} height={34} />
          <span className="tiny muted np-time">
            {formatDuration(position)} / {formatDuration(duration)}
          </span>
        </div>
      </div>
    </footer>
  );
}
