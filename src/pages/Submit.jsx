import { useMemo, useState } from 'react';
import { Panel, SectionTitle, Field, Chip, Switch } from '@/components/aero/Controls';
import { AeroButton } from '@/components/aero/AeroButton';
import { CoverArt } from '@/components/music/CoverArt';
import { Orb } from '@/components/profile/Orb';
import { useProfile } from '@/context/ProfileContext';
import { useToast } from '@/context/ToastContext';
import { useSound } from '@/hooks/useSound';
import { COUNTRIES } from '@/data/countries';
import { ARTISTS } from '@/data/artists';
import { ALL_TAGS } from '@/data/songs';

const BLANK = {
  title: '',
  artist: '',
  country: 'ph',
  year: '',
  album: '',
  note: '',
  link: '',
  tags: [],
  isBandsOwn: false,
};

export function Submit() {
  const { profile, addSubmission } = useProfile();
  const toast = useToast();
  const { play } = useSound();
  const [form, setForm] = useState({ ...BLANK, country: profile.country });
  const [touched, setTouched] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const errors = useMemo(() => {
    const e = {};
    if (!form.title.trim()) e.title = 'A title is required.';
    if (!form.artist.trim()) e.artist = 'Which band or artist?';
    const y = Number(form.year);
    if (!form.year) e.year = 'Release year required.';
    else if (!Number.isInteger(y) || y < 1950 || y > new Date().getFullYear()) {
      e.year = `Give a year between 1950 and ${new Date().getFullYear()}.`;
    }
    if (form.note.trim().length < 20) e.note = 'Say why it is a classic — at least a sentence.';
    return e;
  }, [form]);

  const valid = Object.keys(errors).length === 0;

  const preview = useMemo(() => ({
    seed: [...form.title, ...form.artist].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7),
    year: Number(form.year) || new Date().getFullYear(),
    artist: ARTISTS.find((a) => a.name.toLowerCase() === form.artist.trim().toLowerCase())?.id
      ?? ARTISTS.find((a) => a.country === form.country)?.id
      ?? 'eraserheads',
  }), [form.title, form.artist, form.year, form.country]);

  const submit = () => {
    setTouched(true);
    if (!valid) {
      play('error');
      toast('Some fields still need work', { tone: 'bad', icon: '!', detail: 'Check the highlighted rows.' });
      return;
    }
    addSubmission({ ...form, year: Number(form.year) });
    play('success');
    toast('Filed into the atlas', {
      icon: '✦',
      tone: 'good',
      detail: `${form.title} — ${form.artist} is now in your submissions.`,
      sound: 'success',
    });
    setForm({ ...BLANK, country: form.country });
    setTouched(false);
  };

  const toggleTag = (t) => setForm((f) => ({
    ...f,
    tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t].slice(0, 5),
  }));

  const err = (k) => (touched && errors[k] ? errors[k] : undefined);

  return (
    <>
      <div className="page-head">
        <span className="caps" style={{ color: 'var(--aura-3)' }}>Contribute</span>
        <h1>File an <span className="iridescent">English-language classic</span>.</h1>
        <p className="lede">
          One rule: the song is in English, and the band is from the country you file it under.
          A Manila band’s English ballad belongs here exactly as much as a Swedish one.
        </p>
      </div>

      <div className="card-grid card-grid-lg" style={{ alignItems: 'start' }}>
        <Panel className="stack gap-4">
          <SectionTitle eyebrow="The entry" title="What are you filing?" />

          <Field
            label="Song title" value={form.title} onChange={set('title')}
            placeholder="Enveloped Ideas" maxLength={80} hint={err('title')}
          />
          <Field
            label="Band or artist" value={form.artist} onChange={set('artist')}
            placeholder="The Dawn" maxLength={80} hint={err('artist')}
          />

          <div className="row gap-3 wrap">
            <div className="grow" style={{ minWidth: 180 }}>
              <Field
                label="Country of the band" as="select" value={form.country} onChange={set('country')}
                options={COUNTRIES.map((c) => ({ value: c.id, label: `${c.id.toUpperCase()} — ${c.name}` }))}
              />
            </div>
            <div style={{ width: 130 }}>
              <Field
                label="Year" value={form.year} onChange={set('year')}
                placeholder="1986" inputMode="numeric" maxLength={4} hint={err('year')}
              />
            </div>
          </div>

          <Field
            label="Album or single" value={form.album} onChange={set('album')}
            placeholder="The Dawn" maxLength={80}
          />

          <Field
            label="Liner note — why is it a classic?" as="textarea"
            value={form.note} onChange={set('note')} maxLength={400}
            placeholder="What it meant where you are from. Who played it. Where you heard it first."
            hint={err('note')}
          />

          <Field
            label="Link to the recording (optional)" value={form.link} onChange={set('link')}
            placeholder="https://…"
            hint="MUSIKA never hosts audio. A link is enough."
          />

          <div className="field">
            <span className="field-label">Tags — up to five</span>
            <div className="row wrap gap-2">
              {ALL_TAGS.map((t) => (
                <Chip key={t} active={form.tags.includes(t)} onClick={() => toggleTag(t)}>#{t}</Chip>
              ))}
            </div>
          </div>

          <Switch
            checked={form.isBandsOwn}
            onChange={set('isBandsOwn')}
            label="This is my own band"
            hint="Members can file their own group’s English-language material."
          />

          <div className="row gap-3 wrap" style={{ marginTop: 'var(--sp-2)' }}>
            <AeroButton variant="primary" size="lg" sound={null} onClick={submit}>
              ✦ File it
            </AeroButton>
            <AeroButton
              variant="ghost" size="lg" sound="back"
              onClick={() => { setForm({ ...BLANK, country: profile.country }); setTouched(false); }}
            >
              Reset
            </AeroButton>
          </div>
        </Panel>

        <div className="stack gap-4">
          <Panel>
            <SectionTitle eyebrow="Live preview" title="How it will look" />
            <div className="row gap-4 wrap">
              <CoverArt song={preview} size={150} />
              <div className="stack gap-2 grow" style={{ minWidth: 180 }}>
                <h4>{form.title || 'Untitled entry'}</h4>
                <span className="small soft">{form.artist || 'Unknown band'} · {form.year || '—'}</span>
                <span className="tiny muted">
                  {COUNTRIES.find((c) => c.id === form.country)?.name}
                  {form.album ? ` · ${form.album}` : ''}
                </span>
                <div className="row gap-2 wrap">
                  {form.tags.map((t) => <Chip key={t}>#{t}</Chip>)}
                </div>
              </div>
            </div>
            {form.note && (
              <p className="small" style={{ marginTop: 'var(--sp-4)' }}>“{form.note}”</p>
            )}
            <div className="row gap-3" style={{ marginTop: 'var(--sp-3)' }}>
              <Orb config={profile.orb} size={34} spinning={false} />
              <span className="tiny muted">filed by @{profile.handle}</span>
            </div>
          </Panel>

          <Panel>
            <SectionTitle eyebrow="House rules" title="What belongs here" />
            <ul className="stack gap-3 small soft">
              <li>▸ The song has to be sung in English.</li>
              <li>▸ The band has to be from the country you file it under — not the label, the band.</li>
              <li>▸ Covers count if the version became the local standard.</li>
              <li>▸ Write a real liner note. “Good song” gets rejected.</li>
              <li>▸ No uploads. Link out to the recording.</li>
            </ul>
          </Panel>

          {profile.submissions.length > 0 && (
            <Panel>
              <SectionTitle eyebrow="Yours" title={`${profile.submissions.length} filed this session`} />
              <div className="stack gap-2">
                {profile.submissions.slice(0, 6).map((s, i) => (
                  <div key={i} className="row between gap-3">
                    <span className="small truncate">{s.title}</span>
                    <span className="tiny muted">{s.artist} · {s.year}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
