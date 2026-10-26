import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Panel, SectionTitle, Chip, Field, Empty } from '@/components/aero/Controls';
import { AeroButton } from '@/components/aero/AeroButton';
import { Orb } from '@/components/profile/Orb';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { SongList } from '@/components/music/SongRow';
import { useSound } from '@/hooks/useSound';
import { MEMBERS, memberByHandle, badgeById } from '@/data/profilePresets';
import { countryById } from '@/data/countries';
import { SONGS } from '@/data/songs';
import { Flag } from '@/components/music/Flag';

const submissionsOf = (handle) => SONGS.filter((s) => s.submittedBy === handle);

/* ---------------- Directory ---------------- */
export function Community() {
  const { play } = useSound();
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return MEMBERS
      .map((m) => ({ ...m, count: submissionsOf(m.handle).length }))
      .filter((m) => !t
        || m.name.toLowerCase().includes(t)
        || m.handle.includes(t)
        || m.title.toLowerCase().includes(t)
        || countryById(m.country)?.name.toLowerCase().includes(t))
      .sort((a, b) => b.count - a.count);
  }, [q]);

  return (
    <>
      <div className="page-head">
        <span className="caps" style={{ color: 'var(--aura-3)' }}>Community</span>
        <h1>The people <span className="iridescent">filing the songs</span>.</h1>
        <p className="lede">
          Every entry in the atlas was put there by somebody who grew up with it. This is them.
        </p>
      </div>

      <Panel pad="sm">
        <div className="row between wrap gap-3">
          <span className="small muted">{list.length} members</span>
          <div style={{ width: 260 }}>
            <Field value={q} onChange={setQ} placeholder="Search members…" />
          </div>
        </div>
      </Panel>

      <div className="card-grid stagger">
        {list.map((m) => {
          const c = countryById(m.country);
          return (
            <Link
              key={m.handle}
              to={`/member/${m.handle}`}
              onPointerEnter={() => play('hover')}
              onClick={() => play('confirm')}
            >
              <Panel className="glass-interactive stack gap-3">
                <div className="row gap-3">
                  <Orb config={m.orb} size={54} spinning={false} />
                  <div className="stack grow" style={{ minWidth: 0 }}>
                    <strong className="truncate">{m.name}</strong>
                    <span className="tiny muted truncate">@{m.handle}</span>
                    <span className="tiny soft row gap-2"><Flag code={m.country} size="sm" /> {c?.name}</span>
                  </div>
                </div>
                <div className="row between wrap gap-2">
                  <Chip tone="violet">{m.title}</Chip>
                  <span className="tiny muted">{m.count} filed</span>
                </div>
                {m.badges.length > 0 && (
                  <div className="row gap-1 wrap">
                    {m.badges.map((b) => {
                      const badge = badgeById(b);
                      return badge ? (
                        <span key={b} className="tip" data-tip={badge.label} style={{ fontSize: 16 }}>
                          {badge.icon}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </Panel>
            </Link>
          );
        })}
      </div>
    </>
  );
}

/* ---------------- Single member ---------------- */
export function MemberPage() {
  const { handle } = useParams();
  const member = memberByHandle(handle);
  const songs = useMemo(() => submissionsOf(handle), [handle]);

  if (!member) return <Navigate to="/community" replace />;
  const country = countryById(member.country);

  return (
    <>
      {/* Same component as your own profile, rendered from a different
          profile object — which is exactly how it will work once a
          backend serves other members. Their skin, your app theme. */}
      <ProfileCard
        profile={member}
        stats={[
          { label: 'entries filed', value: songs.length },
          { label: 'badges', value: member.badges.length },
        ]}
      />

      {member.badges.length > 0 && (
        <Panel>
          <SectionTitle eyebrow="Shelf" title="Badges earned" />
          <div className="card-grid card-grid-sm">
            {member.badges.map((id) => {
              const b = badgeById(id);
              if (!b) return null;
              return (
                <Panel key={id} elevation="flat" className="row gap-3">
                  <span style={{ fontSize: 26 }}>{b.icon}</span>
                  <div className="stack">
                    <strong className="small">{b.label}</strong>
                    <span className="tiny muted">{b.blurb}</span>
                  </div>
                </Panel>
              );
            })}
          </div>
        </Panel>
      )}

      <Panel>
        <SectionTitle
          eyebrow="Submissions"
          title={`Filed by @${member.handle}`}
          sub="Songs this member put into the atlas."
        />
        {songs.length ? (
          <SongList songs={songs} queue={songs.map((s) => s.id)} />
        ) : (
          <Empty icon="◌" title="Nothing filed yet" />
        )}
      </Panel>

      <div className="row center">
        <AeroButton to="/community" variant="ghost" sound="back">← Back to community</AeroButton>
      </div>
    </>
  );
}
