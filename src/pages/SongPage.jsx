import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Panel, SectionTitle, Chip } from '@/components/aero/Controls';
import { AeroButton } from '@/components/aero/AeroButton';
import { CoverArt } from '@/components/music/CoverArt';
import { SongList } from '@/components/music/SongRow';
import { Orb } from '@/components/profile/Orb';
import { Visualizer } from '@/components/player/Visualizer';
import { usePlayer } from '@/context/PlayerContext';
import { useProfile } from '@/context/ProfileContext';
import { useToast } from '@/context/ToastContext';
import { useSound } from '@/hooks/useSound';
import { songById, SONGS, formatDuration, formatCount, decadeOf } from '@/data/songs';
import { artistById } from '@/data/artists';
import { countryById } from '@/data/countries';
import { memberByHandle } from '@/data/profilePresets';
import { previewFor, trackLinkFor, mediaFor } from '@/data/media';
import { Flag } from '@/components/music/Flag';

export function SongPage() {
  const { id } = useParams();
  const song = songById(id);
  const { playSong, current, playing, toggle } = usePlayer();
  const { isHearted, toggleHeart, isAnthem, toggleAnthem } = useProfile();
  const { play } = useSound();
  const toast = useToast();

  const artist = artistById(song?.artist);
  const country = countryById(artist?.country);

  const related = useMemo(() => {
    if (!song) return [];
    return SONGS
      .filter((s) => s.id !== song.id)
      .map((s) => {
        const a = artistById(s.artist);
        let score = 0;
        if (a?.country === artist?.country) score += 3;
        if (decadeOf(s.year) === decadeOf(song.year)) score += 2;
        score += s.tags.filter((t) => song.tags.includes(t)).length * 2;
        return { s, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.s);
  }, [song, artist]);

  if (!song) return <Navigate to="/catalogue" replace />;

  const isCurrent = current?.id === song.id;
  const hearted = isHearted(song.id);
  const anthem = isAnthem(song.id);
  const member = memberByHandle(song.submittedBy);

  const media = mediaFor(song.id);
  const hasPreview = Boolean(previewFor(song.id));
  const appleUrl = trackLinkFor(song.id);
  const searchUrl = appleUrl
    ?? `https://www.youtube.com/results?search_query=${encodeURIComponent(`${artist?.name} ${song.title}`)}`;

  return (
    <>
      <Panel className="hero" irisEdge elevation="deep">
        <div className="row gap-6 wrap" style={{ alignItems: 'flex-start' }}>
          <div className="stack center gap-3">
            <CoverArt song={song} size={240} spinning={isCurrent && playing} />
            <Visualizer playing={isCurrent && playing} bars={22} height={26} />
          </div>

          <div className="stack gap-4 grow" style={{ minWidth: 280 }}>
            <div className="row gap-2 wrap">
              <Link to={`/country/${country?.id}`}><Chip tone="violet"><Flag code={country?.id} size="sm" /> {country?.name}</Chip></Link>
              <Chip tone="aqua">{decadeOf(song.year)}</Chip>
              <Chip>{song.album}</Chip>
              <Chip>{song.bpm} bpm</Chip>
              {hasPreview
                ? <Chip tone="mint">♪ 30s preview</Chip>
                : <Chip tone="gold">synth motif only</Chip>}
            </div>

            <h1><span className="iridescent">{song.title}</span></h1>
            <p className="lede" style={{ margin: 0 }}>
              <Link to={`/artist/${artist?.id}`} style={{ fontWeight: 600 }}>{artist?.name}</Link>
              {' · '}{song.year}{' · '}{formatDuration(song.seconds)}
            </p>

            <div className="row gap-2 wrap">
              {song.tags.map((t) => <Chip key={t}>#{t}</Chip>)}
            </div>

            <div className="row gap-3 wrap">
              <AeroButton
                variant="primary" size="lg" sound={null}
                onClick={() => {
                  if (isCurrent) { play(playing ? 'pause' : 'play'); toggle(); }
                  else { play('play'); playSong(song.id); }
                }}
              >
                {isCurrent && playing ? '❚❚ Pause' : hasPreview ? '▶ Play 30s preview' : '▶ Play motif'}
              </AeroButton>
              <AeroButton
                variant={hearted ? 'aqua' : 'ghost'} size="lg" sound={null}
                onClick={() => {
                  const added = toggleHeart(song.id);
                  play(added ? 'heart' : 'off');
                  toast(added ? 'Hearted' : 'Removed', { icon: added ? '♥' : '♡', tone: added ? 'good' : 'default' });
                }}
              >
                {hearted ? '♥ Hearted' : '♡ Heart'}
              </AeroButton>
              <AeroButton
                variant="ghost" size="lg" sound={null}
                onClick={() => {
                  toggleAnthem(song.id);
                  play(anthem ? 'off' : 'coin');
                  toast(anthem ? 'Removed from anthems' : 'Pinned to your five anthems', {
                    icon: '★',
                    tone: anthem ? 'default' : 'good',
                    detail: anthem ? undefined : 'Shows on your profile',
                  });
                }}
              >
                {anthem ? '★ Anthem' : '☆ Pin as anthem'}
              </AeroButton>
              <AeroButton href={searchUrl} variant="ghost" size="lg">
                {appleUrl ? '↗ Open on Apple Music' : '↗ Find the recording'}
              </AeroButton>
            </div>

            <p className="tiny muted" style={{ margin: 0, maxWidth: '62ch' }}>
              {hasPreview ? (
                <>
                  MUSIKA hosts no audio. This plays the 30-second preview Apple publishes for the
                  recording, streamed straight from their CDN
                  {media?.appleArtist ? ` (matched to ${media.appleArtist} — ${media.appleTitle})` : ''}.
                  The full track is one click away.
                </>
              ) : (
                <>
                  Nothing matched this entry in the catalogue lookup, so what plays is an original
                  motif the app synthesises from its seed — a signature, not the song.
                </>
              )}
            </p>
          </div>
        </div>
      </Panel>

      <div className="card-grid card-grid-lg">
        <Panel>
          <SectionTitle eyebrow="Liner note" title="Why it was filed" />
          <p style={{ fontSize: 'var(--t-lg)', lineHeight: 1.6 }}>“{song.note}”</p>
          {member && (
            <div className="row gap-3" style={{ marginTop: 'var(--sp-4)' }}>
              <Orb config={member.orb} size={44} spinning={false} />
              <div className="stack">
                <Link to={`/member/${member.handle}`} style={{ fontWeight: 600 }}>{member.name}</Link>
                <span className="tiny muted">
                  @{member.handle} · {member.title} · filed {song.addedDaysAgo} days ago
                </span>
              </div>
            </div>
          )}
        </Panel>

        <Panel>
          <SectionTitle eyebrow="Numbers" title="How it is doing" />
          <div className="card-grid card-grid-sm">
            <Panel elevation="flat" className="stat-tile">
              <b>{formatCount(song.plays)}</b><span className="tiny muted">plays</span>
            </Panel>
            <Panel elevation="flat" className="stat-tile">
              <b>{formatCount(song.hearts)}</b><span className="tiny muted">hearts</span>
            </Panel>
            <Panel elevation="flat" className="stat-tile">
              <b>{song.year}</b><span className="tiny muted">released</span>
            </Panel>
            <Panel elevation="flat" className="stat-tile">
              <b>{formatDuration(song.seconds)}</b><span className="tiny muted">runtime</span>
            </Panel>
          </div>
        </Panel>
      </div>

      {related.length > 0 && (
        <Panel>
          <SectionTitle
            eyebrow="Next"
            title="Filed nearby"
            sub="Same room, same decade, or same tags."
          />
          <SongList songs={related} queue={related.map((s) => s.id)} />
        </Panel>
      )}
    </>
  );
}
