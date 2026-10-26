import { Link } from 'react-router-dom';
import { Chip } from '@/components/aero/Controls';
import { AeroButton } from '@/components/aero/AeroButton';
import { Orb } from '@/components/profile/Orb';
import { Flag } from '@/components/music/Flag';
import { countryById } from '@/data/countries';
import { skinVars, skinClasses, DEFAULT_SKIN } from '@/data/profileSkins';
import './profilecard.css';

/**
 * The profile header, rendered from a profile OBJECT rather than
 * from the signed-in member.
 *
 * That signature is the point. Today the only profile available is
 * your own; once there is a backend, `GET /api/members/:handle`
 * returns the same shape and this renders a stranger's page with
 * THEIR skin, inside YOUR app theme, with no changes here.
 *
 * `owner` only controls whether the edit buttons appear.
 */
export function ProfileCard({ profile, owner = false, stats, actions }) {
  const country = countryById(profile.country);
  const skin = { ...DEFAULT_SKIN, ...(profile.skin ?? {}) };

  return (
    <section
      className={`profile-card glass ${skinClasses(skin)}`}
      style={skinVars(skin)}
    >
      <div className="profile-card-banner">
        <span className="profile-card-banner-art" />
        <span className="profile-card-banner-veil" />
      </div>

      <div className="profile-card-body">
        <Orb config={profile.orb} size={120} className="profile-card-orb" />

        <div className="stack gap-2 grow" style={{ minWidth: 220 }}>
          <div className="row gap-2 wrap">
            {profile.title && <Chip tone="iris">{profile.title}</Chip>}
            {country && (
              <Link to={`/country/${country.id}`}>
                <Chip tone="aqua"><Flag code={country.id} size="sm" /> {country.name}</Chip>
              </Link>
            )}
            {profile.pronouns && <Chip>{profile.pronouns}</Chip>}
          </div>

          <h1 className="profile-card-name">{profile.name}</h1>
          <span className="small profile-card-handle">@{profile.handle}</span>

          {profile.bio && (
            <p className="small profile-card-bio">{profile.bio}</p>
          )}

          {profile.link && (
            <a
              className="tiny profile-card-link"
              href={profile.link}
              target="_blank"
              rel="noreferrer"
            >
              ↗ {profile.link.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>

        <div className="stack gap-2">
          {owner ? (
            <>
              <AeroButton to="/studio?tab=skin" variant="primary">⚙ Customise</AeroButton>
              <AeroButton to="/submit" variant="ghost">✚ File a song</AeroButton>
            </>
          ) : actions}
        </div>
      </div>

      {stats?.length > 0 && (
        <div className="profile-card-stats">
          {stats.map((s) => (
            <span key={s.label}><b>{s.value}</b> {s.label}</span>
          ))}
        </div>
      )}
    </section>
  );
}
