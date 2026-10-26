import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel, SectionTitle, Chip, Empty, Field } from '@/components/aero/Controls';
import { AeroButton } from '@/components/aero/AeroButton';
import { Orb } from '@/components/profile/Orb';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { SongList } from '@/components/music/SongRow';
import { SongCard } from '@/components/music/Cards';
import { useProfile } from '@/context/ProfileContext';
import { usePlayer } from '@/context/PlayerContext';
import { useToast } from '@/context/ToastContext';
import { COUNTRIES, countryById } from '@/data/countries';
import { songById, SONGS, decadeOf, formatCount } from '@/data/songs';
import { artistById } from '@/data/artists';
import { badgeById, memberByHandle } from '@/data/profilePresets';
import './profile.css';
import { Flag } from '@/components/music/Flag';

export function Profile() {
  const { profile, patch } = useProfile();
  const { current, history } = usePlayer();
  const toast = useToast();
  const [guestText, setGuestText] = useState('');

  const country = countryById(profile.country);
  const anthems = profile.anthems.map(songById).filter(Boolean);
  const hearted = profile.hearted.map(songById).filter(Boolean);
  const recent = history.map(songById).filter(Boolean).slice(0, 5);

  const stats = useMemo(() => {
    const pool = [...anthems, ...hearted];
    const decades = {};
    const genres = {};
    pool.forEach((s) => {
      decades[decadeOf(s.year)] = (decades[decadeOf(s.year)] ?? 0) + 1;
      const g = artistById(s.artist)?.genre;
      if (g) genres[g] = (genres[g] ?? 0) + 1;
    });
    const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
    return {
      hearted: hearted.length,
      anthems: anthems.length,
      countries: profile.visited.length,
      submissions: profile.submissions.length,
      topDecade: top(decades),
      topGenre: top(genres),
    };
  }, [anthems, hearted, profile.visited.length, profile.submissions.length]);

  const signGuestbook = () => {
    if (guestText.trim().length < 3) return;
    patch({
      guestbook: [{ by: profile.handle, text: guestText.trim(), daysAgo: 0 }, ...profile.guestbook],
    });
    setGuestText('');
    toast('Signed your own guestbook', { icon: '✎', detail: 'Bold. Respect.' });
  };

  /* ---- module renderers ---- */
  const MODULES = {
    anthems: () => (
      <Panel key="anthems">
        <SectionTitle
          eyebrow="Pinned"
          title="Top five anthems"
          sub="The permanent rotation."
          action={<AeroButton to="/catalogue" variant="ghost" size="sm">Find more</AeroButton>}
        />
        {anthems.length ? (
          <div className="card-grid card-grid-sm">
            {anthems.map((s) => <SongCard key={s.id} song={s} queue={anthems.map((x) => x.id)} />)}
          </div>
        ) : (
          <Empty icon="★" title="No anthems pinned">
            Open any song and pin it. Five slots, chosen carefully.
          </Empty>
        )}
      </Panel>
    ),

    nowspinning: () => (
      <Panel key="nowspinning">
        <SectionTitle eyebrow="Now spinning" title={current ? current.title : 'Nothing on'} />
        {current ? (
          <div className="row gap-4 wrap">
            <div className="stack grow" style={{ minWidth: 200 }}>
              <span className="small soft">{artistById(current.artist)?.name} · {current.year}</span>
              <span className="tiny muted">{current.album}</span>
              <div className="row gap-2 wrap" style={{ marginTop: 8 }}>
                {current.tags.map((t) => <Chip key={t}>#{t}</Chip>)}
              </div>
            </div>
            <AeroButton to={`/song/${current.id}`} variant="ghost" size="sm">Open entry →</AeroButton>
          </div>
        ) : (
          <p className="small muted">Press play anywhere and it shows up here.</p>
        )}
        {recent.length > 0 && (
          <>
            <div className="rule" style={{ margin: 'var(--sp-4) 0 var(--sp-3)' }}>Recently played</div>
            <SongList songs={recent} numbered={false} />
          </>
        )}
      </Panel>
    ),

    submissions: () => (
      <Panel key="submissions">
        <SectionTitle
          eyebrow="Contributions"
          title="Songs you filed"
          action={<AeroButton to="/submit" variant="ghost" size="sm">✚ File another</AeroButton>}
        />
        {profile.submissions.length ? (
          <div className="stack gap-3">
            {profile.submissions.map((s, i) => (
              <div key={i} className="row between gap-3 wrap sub-row">
                <div className="stack grow" style={{ minWidth: 0 }}>
                  <strong className="small truncate">{s.title}</strong>
                  <span className="tiny muted truncate">
                    {s.artist} · {s.year} · {countryById(s.country)?.name}
                  </span>
                </div>
                <div className="row gap-2">
                  {s.isBandsOwn && <Chip tone="gold">own band</Chip>}
                  <Chip tone="mint">pending review</Chip>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty icon="✚" title="Nothing filed yet">
            Know an English-language classic from your country that is missing? That is the whole
            point of the place.
            <div style={{ marginTop: 'var(--sp-4)' }}>
              <AeroButton to="/submit" variant="primary">Submit a song</AeroButton>
            </div>
          </Empty>
        )}
      </Panel>
    ),

    passport: () => (
      <Panel key="passport">
        <SectionTitle
          eyebrow="Passport"
          title={`${profile.visited.length} of ${COUNTRIES.length} rooms visited`}
          sub="Stamps are collected by opening a country room."
        />
        <div className="meter" style={{ marginBottom: 'var(--sp-4)' }}>
          <div className="meter-fill" style={{ width: `${(profile.visited.length / COUNTRIES.length) * 100}%` }} />
        </div>
        <div className="passport-grid">
          {COUNTRIES.map((c) => {
            const got = profile.visited.includes(c.id);
            return (
              <Link key={c.id} to={`/country/${c.id}`} className={`stamp ${got ? 'is-got' : ''} tip`} data-tip={c.name}>
                <Flag code={c.id} size="md" />
                <span className="tiny truncate">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </Panel>
    ),

    badges: () => (
      <Panel key="badges">
        <SectionTitle eyebrow="Shelf" title="Badges" sub="Earned by using the place." />
        <div className="card-grid card-grid-sm">
          {profile.badges.map((id) => {
            const b = badgeById(id);
            if (!b) return null;
            return (
              <Panel key={id} elevation="flat" className={`badge-tile chip-${b.tone}`}>
                <span className="badge-icon">{b.icon}</span>
                <strong className="small">{b.label}</strong>
                <span className="tiny">{b.blurb}</span>
              </Panel>
            );
          })}
          {profile.badges.length === 0 && <p className="small muted">No badges yet.</p>}
        </div>
      </Panel>
    ),

    stats: () => (
      <Panel key="stats">
        <SectionTitle eyebrow="Numbers" title="Listening stats" />
        <div className="card-grid card-grid-sm">
          <Panel elevation="flat" className="stat-tile"><b>{stats.hearted}</b><span className="tiny muted">hearted</span></Panel>
          <Panel elevation="flat" className="stat-tile"><b>{stats.anthems}</b><span className="tiny muted">anthems</span></Panel>
          <Panel elevation="flat" className="stat-tile"><b>{stats.countries}</b><span className="tiny muted">rooms visited</span></Panel>
          <Panel elevation="flat" className="stat-tile"><b>{stats.submissions}</b><span className="tiny muted">filed</span></Panel>
          <Panel elevation="flat" className="stat-tile"><b>{stats.topDecade}</b><span className="tiny muted">favourite decade</span></Panel>
          <Panel elevation="flat" className="stat-tile"><b className="truncate">{stats.topGenre}</b><span className="tiny muted">favourite genre</span></Panel>
        </div>
      </Panel>
    ),

    guestbook: () => (
      <Panel key="guestbook">
        <SectionTitle eyebrow="Wall" title="Guestbook" sub="The old internet had these. It was better." />
        <div className="row gap-2" style={{ marginBottom: 'var(--sp-4)' }}>
          <div className="grow">
            <Field value={guestText} onChange={setGuestText} placeholder="Leave a note…" maxLength={140} />
          </div>
          <AeroButton variant="aqua" sound="confirm" onClick={signGuestbook}>Sign</AeroButton>
        </div>
        <div className="stack gap-3">
          {profile.guestbook.map((g, i) => {
            const m = memberByHandle(g.by);
            return (
              <div key={i} className="row gap-3 guest-row">
                {m ? <Orb config={m.orb} size={34} spinning={false} /> : <span className="guest-dot">☺</span>}
                <div className="stack grow" style={{ minWidth: 0 }}>
                  <span className="small">{g.text}</span>
                  <span className="tiny muted">@{g.by} · {g.daysAgo === 0 ? 'just now' : `${g.daysAgo}d ago`}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    ),
  };

  return (
    <>
      {/* ---------------- Banner ---------------- */}
      <ProfileCard
        profile={profile}
        owner
        stats={[
          { label: 'hearted', value: stats.hearted },
          { label: 'rooms', value: stats.countries },
          { label: 'filed', value: stats.submissions },
          { label: 'in atlas', value: formatCount(SONGS.length) },
        ]}
      />

      {profile.modules.map((id) => MODULES[id]?.() ?? null)}
    </>
  );
}
