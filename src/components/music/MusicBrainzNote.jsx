import { Chip } from '@/components/aero/Controls';
import { Flag } from '@/components/music/Flag';
import { countryById, COUNTRIES } from '@/data/countries';
import { useSound } from '@/hooks/useSound';

/**
 * The second-opinion note under the band field on the submit form.
 *
 * Three states worth showing, and one worth hiding:
 *  · agrees      — quiet confirmation, builds confidence
 *  · disagrees   — the useful case: offers a one-click correction
 *  · not a room  — MusicBrainz knows the band but we have no room yet
 *  · no match / error — show nothing. MusicBrainz is patchy for exactly
 *    the scenes this site exists to document, so absence is not evidence
 *    and a warning would train people to ignore the thing.
 */
export function MusicBrainzNote({ result, pickedCountry, onAccept }) {
  const { play } = useSound();
  if (!result) return null;

  if (result.state === 'checking') {
    return <span className="tiny muted">checking MusicBrainz…</span>;
  }
  if (result.state !== 'found' || !result.country) return null;

  const mbCountry = countryById(result.country);
  const known = COUNTRIES.some((c) => c.id === result.country);
  const agrees = result.country === pickedCountry;

  if (agrees) {
    return (
      <div className="row gap-2 tiny" style={{ color: 'var(--ok)' }}>
        <Chip tone="mint">✓ MusicBrainz agrees</Chip>
        <span className="muted">
          {result.name}
          {result.formed ? ` · formed ${result.formed}` : ''}
          {result.area ? ` · ${result.area}` : ''}
        </span>
      </div>
    );
  }

  return (
    <div className="mb-note">
      <span className="tiny">
        MusicBrainz lists <strong>{result.name}</strong> as
        {' '}
        <strong>{known ? mbCountry.name : result.country.toUpperCase()}</strong>
        {result.formed ? `, formed ${result.formed}` : ''}
        {result.disambiguation ? ` — “${result.disambiguation}”` : ''}.
      </span>

      <div className="row gap-2 wrap" style={{ marginTop: 6 }}>
        {known ? (
          <button
            type="button"
            className="chip"
            style={{ cursor: 'pointer' }}
            onPointerEnter={() => play('hover')}
            onClick={() => { play('confirm'); onAccept(result.country); }}
          >
            <Flag code={result.country} size="sm" /> Use {mbCountry.name} instead
          </button>
        ) : (
          <Chip tone="gold">No room for that country yet</Chip>
        )}
        <a
          className="tiny muted"
          href={`https://musicbrainz.org/artist/${result.mbid}`}
          target="_blank"
          rel="noreferrer"
        >
          check on MusicBrainz ↗
        </a>
      </div>

      <span className="tiny muted" style={{ display: 'block', marginTop: 4 }}>
        Only a second opinion — if you know better, keep your answer.
      </span>
    </div>
  );
}
