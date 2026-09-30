import { useEffect, useState } from 'react';
import { Panel, SectionTitle, Chip, Empty } from '@/components/aero/Controls';
import { AeroButton } from '@/components/aero/AeroButton';
import { usePlayer } from '@/context/PlayerContext';
import { useSound } from '@/hooks/useSound';
import { stationsForCountry } from '@/data/radio';
import './radio.css';

/**
 * The live dial for a country room.
 *
 * The shelf above it is history — what a place decided its
 * English-language standards were. This is the same place, right
 * now, whatever it happens to be playing.
 */
export function RadioDial({ country }) {
  const { station, tuneRadio, stopRadio, playing, buffering, toggle } = usePlayer();
  const { play } = useSound();
  const [stations, setStations] = useState(null); // null = loading
  const [error, setError] = useState(false);

  useEffect(() => {
    let live = true;
    setStations(null);
    setError(false);

    stationsForCountry(country.id)
      .then((list) => {
        if (!live) return;
        setStations(list);
        setError(list.length === 0);
      })
      .catch(() => live && setError(true));

    return () => { live = false; };
  }, [country.id]);

  const tuned = (s) => station?.id === s.id;

  return (
    <Panel className="stack gap-4">
      <SectionTitle
        eyebrow="Live right now"
        title={`On the air in ${country.name}`}
        sub="Real stations, streaming live. The shelf above is the past; this is the present."
        action={station && (
          <AeroButton
            variant="ghost" size="sm" sound="back"
            onClick={() => { stopRadio(); }}
          >
            ■ Stop radio
          </AeroButton>
        )}
      />

      {stations === null && (
        <div className="radio-list">
          {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton radio-skeleton" />)}
        </div>
      )}

      {stations && stations.length > 0 && (
        <div className="radio-list">
          {stations.map((s) => (
            <button
              key={s.id}
              className={`radio-station ${tuned(s) ? 'is-tuned' : ''}`}
              onPointerEnter={() => play('hover')}
              onClick={() => {
                if (tuned(s)) { play(playing ? 'pause' : 'play'); toggle(); }
                else { play('play'); tuneRadio(s); }
              }}
            >
              <span className="radio-led" aria-hidden="true">
                {tuned(s) && playing
                  ? <span className="eq-badge"><span /><span /><span /></span>
                  : tuned(s) ? '❚❚' : '▶'}
              </span>

              <span className="stack grow" style={{ minWidth: 0 }}>
                <strong className="small truncate">{s.name}</strong>
                <span className="tiny muted truncate">
                  {[s.codec, s.bitrate ? `${s.bitrate}kbps` : null, s.language]
                    .filter(Boolean).join(' · ') || 'live stream'}
                </span>
              </span>

              {tuned(s) && buffering && <span className="tiny muted">tuning…</span>}
              {s.tags.length > 0 && (
                <span className="radio-tags hide-sm">
                  {s.tags.slice(0, 2).map((t) => <Chip key={t}>{t}</Chip>)}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {error && (
        <Empty icon="📻" title="No stations reachable">
          Either the directory is unreachable, or no station from {country.name} streams over
          HTTPS — browsers refuse to play insecure audio on a secure page.
        </Empty>
      )}

      {stations && stations.length > 0 && (
        <p className="tiny muted" style={{ margin: 0 }}>
          Stations from the community directory at radio-browser.info. MUSIKA does not host or
          relay any of them — your browser connects to the station directly.
        </p>
      )}
    </Panel>
  );
}
