import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Panel, SectionTitle, Chip } from '@/components/aero/Controls';
import { AeroButton } from '@/components/aero/AeroButton';
import { CountryCard, SongCard } from '@/components/music/Cards';
import { SongList } from '@/components/music/SongRow';
import { CoverArt } from '@/components/music/CoverArt';
import { Orb } from '@/components/profile/Orb';
import { useProfile } from '@/context/ProfileContext';
import { usePlayer } from '@/context/PlayerContext';
import { useSound } from '@/hooks/useSound';
import { COUNTRIES, countryById } from '@/data/countries';
import { ARTISTS, artistById } from '@/data/artists';
import { SONGS, songById, formatCount } from '@/data/songs';
import { memberByHandle } from '@/data/profilePresets';

export function Home() {
  const { profile } = useProfile();
  const { playSong } = usePlayer();
  const { play } = useSound();

  const home = countryById(profile.country) ?? COUNTRIES[0];

  const featured = useMemo(
    () => [...SONGS].sort((a, b) => b.hearts - a.hearts).slice(0, 8),
    [],
  );
  const fresh = useMemo(
    () => [...SONGS].sort((a, b) => a.addedDaysAgo - b.addedDaysAgo).slice(0, 6),
    [],
  );
  const homeRoom = useMemo(
    () => SONGS.filter((s) => artistById(s.artist)?.country === home.id).slice(0, 5),
    [home.id],
  );
  const anthems = profile.anthems.map(songById).filter(Boolean);
  const spotlight = featured[0];

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <Panel className="hero" irisEdge elevation="deep">
        <div className="hero-grid">
          <div className="stack gap-4">
            <span className="caps" style={{ color: 'var(--aura-3)' }}>
              {COUNTRIES.length} countries · {ARTISTS.length} bands · {SONGS.length} entries
            </span>
            <h1>
              The classics they wrote<br />
              <span className="iridescent">in English</span>, wherever<br />
              they were from.
            </h1>
            <p className="lede">
              Every country has bands who wrote their standards in English — OPM ballads out of
              Manila, Nederbeat singles out of The Hague, art-pop out of Reykjavík. MUSIKA is the
              atlas where members file them, one room per country.
            </p>
            <div className="row gap-3 wrap">
              <AeroButton
                variant="primary" size="lg" sound="play"
                onClick={() => playSong(spotlight.id, featured.map((s) => s.id))}
              >
                ▶ Start the rotation
              </AeroButton>
              <AeroButton to="/atlas" variant="aqua" size="lg">🌐 Open the atlas</AeroButton>
              <AeroButton to="/submit" variant="ghost" size="lg">✚ File a song</AeroButton>
            </div>
            <div className="hero-stats">
              <span className="hero-stat"><b>{SONGS.length}</b><span className="tiny muted">entries filed</span></span>
              <span className="hero-stat"><b>{COUNTRIES.length}</b><span className="tiny muted">country rooms</span></span>
              <span className="hero-stat"><b>{ARTISTS.length}</b><span className="tiny muted">bands catalogued</span></span>
              <span className="hero-stat"><b>{formatCount(SONGS.reduce((n, s) => n + s.plays, 0))}</b><span className="tiny muted">plays logged</span></span>
            </div>
          </div>

          <div className="stack center gap-4">
            <div className="anim-float">
              <CoverArt song={spotlight} size={230} />
            </div>
            <div className="stack center gap-1 center-text">
              <Chip tone="iris">Most hearted this week</Chip>
              <Link to={`/song/${spotlight.id}`} onPointerEnter={() => play('hover')}>
                <h4>{spotlight.title}</h4>
              </Link>
              <span className="small muted">
                {artistById(spotlight.artist)?.name} · {spotlight.year}
              </span>
            </div>
          </div>
        </div>
      </Panel>

      {/* ---------------- Your home room ---------------- */}
      <Panel>
        <SectionTitle
          eyebrow="Your room"
          title={`${home.name} — ${home.scene}`}
          sub={home.tagline}
          action={<AeroButton to={`/country/${home.id}`} variant="ghost" size="sm">Open room →</AeroButton>}
        />
        <SongList songs={homeRoom} showCountry={false} />
      </Panel>

      {/* ---------------- Rotation ---------------- */}
      <section className="stack gap-4">
        <SectionTitle
          eyebrow="Tonight"
          title="The rotation"
          sub="Most hearted across every room."
          action={<AeroButton to="/catalogue" variant="ghost" size="sm">Whole catalogue →</AeroButton>}
        />
        <div className="card-grid card-grid-sm stagger">
          {featured.map((s) => (
            <SongCard key={s.id} song={s} queue={featured.map((x) => x.id)} />
          ))}
        </div>
      </section>

      {/* ---------------- Rooms ---------------- */}
      <section className="stack gap-4">
        <SectionTitle
          eyebrow="Atlas"
          title="Rooms by country"
          sub="Each room is curated by the members who grew up with it."
          action={<AeroButton to="/atlas" variant="ghost" size="sm">All {COUNTRIES.length} →</AeroButton>}
        />
        <div className="card-grid stagger">
          {COUNTRIES.slice(0, 6).map((c) => <CountryCard key={c.id} country={c} />)}
        </div>
      </section>

      {/* ---------------- Fresh + anthems ---------------- */}
      <div className="card-grid card-grid-lg">
        <Panel>
          <SectionTitle eyebrow="Just filed" title="Fresh submissions" />
          <div className="stack gap-3">
            {fresh.map((s) => {
              const m = memberByHandle(s.submittedBy);
              return (
                <div key={s.id} className="row gap-3">
                  {m && <Orb config={m.orb} size={34} spinning={false} title={m.name} />}
                  <div className="stack grow" style={{ minWidth: 0 }}>
                    <Link to={`/song/${s.id}`} className="truncate small" style={{ fontWeight: 500 }}>
                      {s.title}
                    </Link>
                    <span className="tiny muted truncate">
                      filed by @{s.submittedBy} · {s.addedDaysAgo}d ago
                    </span>
                  </div>
                  <AeroButton
                    icon size="sm" variant="ghost" sound="play"
                    onClick={() => playSong(s.id, fresh.map((x) => x.id))}
                    aria-label={`Play ${s.title}`}
                  >▶</AeroButton>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel>
          <SectionTitle
            eyebrow="Pinned"
            title="Your five anthems"
            sub="Set them in the Profile Studio."
            action={<AeroButton to="/studio" variant="ghost" size="sm">Edit</AeroButton>}
          />
          {anthems.length ? (
            <SongList songs={anthems} numbered={false} />
          ) : (
            <p className="small muted">Nothing pinned yet. Heart a song and promote it to an anthem.</p>
          )}
        </Panel>
      </div>
    </>
  );
}
