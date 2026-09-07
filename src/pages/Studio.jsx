import { useRef, useState } from 'react';
import { Panel, SectionTitle, Field, Switch, Slider, Segmented, Chip, ColorWell } from '@/components/aero/Controls';
import { AeroButton } from '@/components/aero/AeroButton';
import { Orb } from '@/components/profile/Orb';
import { useProfile } from '@/context/ProfileContext';
import { useToast } from '@/context/ToastContext';
import { useSound } from '@/hooks/useSound';
import { SOUND_PACKS } from '@/audio/soundEngine';
import { COUNTRIES } from '@/data/countries';
import { songById } from '@/data/songs';
import { STYLES, STYLE_FAMILIES, PARTICLE_OPTIONS } from '@/data/styles';
import { TYPEFACES } from '@/data/fonts';
import {
  AURA_PRESETS, ORB_PATTERNS, EMBLEMS, FRAMES, CURSORS,
  TITLES, PROFILE_MODULES, DEFAULT_PROFILE,
} from '@/data/profilePresets';
import './studio.css';

const TABS = [
  { id: 'style', label: '◈ Style' },
  { id: 'identity', label: '☻ Identity' },
  { id: 'avatar', label: '◍ Avatar' },
  { id: 'theme', label: '✦ Theme' },
  { id: 'type', label: 'Aa Type' },
  { id: 'sound', label: '♪ Sound' },
  { id: 'layout', label: '▦ Layout' },
  { id: 'data', label: '⛁ Data' },
];

const SFX_BOARD = [
  'click', 'confirm', 'back', 'success', 'error', 'on', 'off',
  'play', 'pause', 'nav', 'heart', 'coin', 'notify', 'bubble', 'open', 'close', 'boot',
];

export function Studio() {
  const {
    profile, patch, patchTheme, patchAudio, patchOrb,
    setModules, applyStyle, applyAuraPreset, resetProfile, setProfile, toggleAnthem,
  } = useProfile();
  const { play } = useSound();
  const toast = useToast();
  const [tab, setTab] = useState('style');
  const [packSound, setPackSound] = useState(true);
  const fileRef = useRef(null);

  const t = profile.theme;
  const a = profile.audio;

  /* ---------------- Style ---------------- */
  const Style = (
    <div className="stack gap-4">
      <Panel className="stack gap-4">
        <SectionTitle
          eyebrow="Pick a world"
          title="Style"
          sub="A style sets the wallpaper, palette, corner sharpness, weather, typeface and sound pack in one move. Everything stays editable afterwards."
          action={(
            <Switch checked={packSound} onChange={setPackSound} label="Switch sound pack too" />
          )}
        />

        {STYLE_FAMILIES.map((family) => (
          <div key={family} className="stack gap-3">
            <div className="rule">{family}</div>
            <div className="style-grid">
              {STYLES.filter((s) => s.family === family).map((s) => (
                <button
                  key={s.id}
                  className={`style-card ${t.style === s.id ? 'is-on' : ''}`}
                  onPointerEnter={() => play('hover')}
                  onClick={() => {
                    applyStyle(s.id, { withSound: packSound });
                    setTimeout(() => play('confirm'), 60);
                    toast(`${s.label} applied`, { icon: '◈', tone: 'good', detail: s.blurb });
                  }}
                >
                  <span className="style-shot" style={{ backgroundImage: `url(${s.bg})` }}>
                    <span className="style-swatches">
                      {s.palette.map((c) => <i key={c} style={{ background: c }} />)}
                    </span>
                  </span>
                  <span className="style-meta">
                    <strong className="small">{s.label}</strong>
                    <span className="tiny muted clamp-2">{s.blurb}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </Panel>

      <div className="studio-cols">
        <Panel className="stack gap-4">
          <SectionTitle eyebrow="Wallpaper" title="The photograph behind everything" />
          <Switch
            checked={t.wallpaper}
            onChange={(v) => patchTheme({ wallpaper: v })}
            label="Show wallpaper"
            hint="Off falls back to a pure gradient ground."
          />
          <Slider
            label="Dim" value={t.wallpaperDim} min={0} max={1} step={0.01}
            display={`${Math.round(t.wallpaperDim * 100)}%`}
            onChange={(v) => patchTheme({ wallpaperDim: v })}
          />
          <Slider
            label="Depth of field" value={t.wallpaperBlur} min={0} max={20}
            display={`${t.wallpaperBlur}px`}
            onChange={(v) => patchTheme({ wallpaperBlur: v })}
          />
        </Panel>

        <Panel className="stack gap-4">
          <SectionTitle eyebrow="Weather" title="What floats past" />
          <div className="field">
            <span className="field-label">Particle</span>
            <div className="row wrap gap-2">
              {PARTICLE_OPTIONS.map((o) => (
                <Chip
                  key={o.id}
                  active={t.particle === o.id}
                  onClick={() => patchTheme({ particle: o.id })}
                >
                  {o.label}
                </Chip>
              ))}
            </div>
          </div>
          <Slider
            label="Density" value={t.particleCount} min={0} max={80}
            display={`${t.particleCount}`}
            onChange={(v) => patchTheme({ particleCount: v })}
          />
          <Switch checked={t.aurora} onChange={(v) => patchTheme({ aurora: v })} label="Aurora fields" />
          <Switch checked={t.caustics} onChange={(v) => patchTheme({ caustics: v })} label="Water caustics" />
          <Switch checked={t.flares} onChange={(v) => patchTheme({ flares: v })} label="Lens flares" />
          <Switch checked={t.scanlines} onChange={(v) => patchTheme({ scanlines: v })} label="CRT scanlines" />
        </Panel>
      </div>
    </div>
  );

  /* ---------------- Identity ---------------- */
  const Identity = (
    <div className="studio-cols">
      <Panel className="stack gap-4">
        <SectionTitle eyebrow="Who you are" title="Name and handle" />
        <Field label="Display name" value={profile.name} onChange={(v) => patch({ name: v })} maxLength={32} />
        <Field
          label="Handle" value={profile.handle} maxLength={20}
          onChange={(v) => patch({ handle: v.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
          hint="Lowercase, letters and numbers. This is your address."
        />
        <Field label="Pronouns" value={profile.pronouns} onChange={(v) => patch({ pronouns: v })} maxLength={20} placeholder="they/them" />
        <Field
          label="Home country" as="select" value={profile.country}
          onChange={(v) => patch({ country: v })}
          options={COUNTRIES.map((c) => ({ value: c.id, label: `${c.id.toUpperCase()} — ${c.name}` }))}
          hint="Sets which room greets you on the listening page."
        />
      </Panel>

      <Panel className="stack gap-4">
        <SectionTitle eyebrow="How you present" title="Flair and bio" />
        <div className="field">
          <span className="field-label">Member title</span>
          <div className="row wrap gap-2">
            {TITLES.map((title) => (
              <Chip key={title} active={profile.title === title} onClick={() => patch({ title })}>
                {title}
              </Chip>
            ))}
          </div>
        </div>
        <Field
          label="Bio" as="textarea" value={profile.bio}
          onChange={(v) => patch({ bio: v })} maxLength={280}
          hint="What you listen for. Where you are from. Why you are here."
        />
        <Field
          label="Link" value={profile.link} onChange={(v) => patch({ link: v })}
          placeholder="https://your-band.example" maxLength={120}
        />
      </Panel>
    </div>
  );

  /* ---------------- Avatar ---------------- */
  const Avatar = (
    <div className="studio-cols">
      <Panel className="stack gap-5 center studio-sticky">
        <SectionTitle eyebrow="Preview" title="Your orb" />
        <Orb config={profile.orb} size={200} />
        <div className="row gap-2 wrap center">
          <AeroButton
            variant="ghost" size="sm" sound="coin"
            onClick={() => {
              const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
              const hue = () => `hsl(${Math.floor(Math.random() * 360)} 85% ${55 + Math.random() * 20}%)`;
              patchOrb({
                pattern: pick(ORB_PATTERNS).id,
                emblem: pick(EMBLEMS),
                frame: pick(FRAMES).id,
                colors: [hue(), hue()],
              });
            }}
          >
            ⚄ Randomise
          </AeroButton>
          <Switch checked={profile.orb.spin} onChange={(v) => patchOrb({ spin: v })} label="Spin" />
        </div>
      </Panel>

      <div className="stack gap-4">
        <Panel className="stack gap-4">
          <SectionTitle eyebrow="Interior" title="Pattern" />
          <div className="swatch-grid">
            {ORB_PATTERNS.map((p) => (
              <button
                key={p.id}
                className={`swatch ${profile.orb.pattern === p.id ? 'is-on' : ''}`}
                onPointerEnter={() => play('hover')}
                onClick={() => { play('click'); patchOrb({ pattern: p.id }); }}
              >
                <Orb config={{ ...profile.orb, pattern: p.id, spin: false }} size={52} />
                <span className="tiny">{p.label}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="stack gap-4">
          <SectionTitle eyebrow="Mark" title="Emblem" />
          <div className="emblem-grid">
            {EMBLEMS.map((e) => (
              <button
                key={e}
                className={`emblem ${profile.orb.emblem === e ? 'is-on' : ''}`}
                onPointerEnter={() => play('hover')}
                onClick={() => { play('click'); patchOrb({ emblem: e }); }}
              >
                {e}
              </button>
            ))}
            <button
              className={`emblem ${!profile.orb.emblem ? 'is-on' : ''}`}
              onClick={() => { play('off'); patchOrb({ emblem: '' }); }}
            >
              ∅
            </button>
          </div>
        </Panel>

        <Panel className="stack gap-4">
          <SectionTitle eyebrow="Glass" title="Colours and frame" />
          <div className="row gap-4 wrap">
            <ColorWell
              label="Inner" value={profile.orb.colors[0]}
              onChange={(v) => patchOrb({ colors: [v, profile.orb.colors[1]] })}
            />
            <ColorWell
              label="Outer" value={profile.orb.colors[1]}
              onChange={(v) => patchOrb({ colors: [profile.orb.colors[0], v] })}
            />
            <div className="grow">
              <span className="field-label">Frame</span>
              <div className="row wrap gap-2" style={{ marginTop: 6 }}>
                {FRAMES.map((f) => (
                  <Chip key={f.id} active={profile.orb.frame === f.id} onClick={() => patchOrb({ frame: f.id })}>
                    {f.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );

  /* ---------------- Theme ---------------- */
  const Theme = (
    <div className="stack gap-4">
      <Panel className="stack gap-4">
        <SectionTitle
          eyebrow="Aura"
          title="Palette"
          sub="Four colours drive every gradient, glow and highlight in the interface."
        />
        <div className="preset-grid">
          {AURA_PRESETS.map((p) => (
            <button
              key={p.id}
              className={`preset ${t.auraColors.join() === p.colors.join() ? 'is-on' : ''}`}
              onPointerEnter={() => play('hover')}
              onClick={() => { play('confirm'); applyAuraPreset(p.id); }}
            >
              <span className="preset-strip">
                {p.colors.map((c) => <span key={c} style={{ background: c }} />)}
              </span>
              <span className="tiny">{p.label}</span>
            </button>
          ))}
        </div>

        <div className="rule">Fine tune</div>
        <div className="row gap-4 wrap">
          {t.auraColors.map((c, i) => (
            <ColorWell
              key={i}
              label={['Primary', 'Bloom', 'Counter', 'Highlight'][i]}
              value={c}
              onChange={(v) => {
                const next = [...t.auraColors];
                next[i] = v;
                patchTheme({ auraColors: next });
              }}
            />
          ))}
          <div className="grow stack gap-3" style={{ minWidth: 220 }}>
            <Slider
              label="Gradient angle" value={t.auraAngle} min={0} max={360}
              display={`${t.auraAngle}°`}
              onChange={(v) => patchTheme({ auraAngle: v })}
            />
            <Slider
              label="Bloom intensity" value={t.auraIntensity} min={0} max={2} step={0.05}
              display={`${Math.round(t.auraIntensity * 100)}%`}
              onChange={(v) => patchTheme({ auraIntensity: v })}
            />
          </div>
        </div>
      </Panel>

      <div className="studio-cols">
        <Panel className="stack gap-4">
          <SectionTitle eyebrow="Material" title="Glass and geometry" />
          <div className="field">
            <span className="field-label">Panel ink</span>
            <Segmented
              value={t.ink} onChange={(v) => patchTheme({ ink: v })}
              ariaLabel="Ink mode"
              options={[{ id: 'light', label: 'Light on dark' }, { id: 'dark', label: 'Dark on light' }]}
            />
            <span className="tiny muted">
              Bright wallpapers want dark type on white glass — the original Aero arrangement.
            </span>
          </div>
          <Switch checked={t.glass} onChange={(v) => patchTheme({ glass: v })} label="Frosted glass" hint="Turn off if the blur costs you frames." />
          <Slider label="Blur" value={t.glassBlur} min={0} max={40} display={`${t.glassBlur}px`} onChange={(v) => patchTheme({ glassBlur: v })} />
          <Slider label="Panel opacity" value={t.panelAlpha} min={0.08} max={0.92} step={0.01} display={t.panelAlpha.toFixed(2)} onChange={(v) => patchTheme({ panelAlpha: v })} />
          <Slider
            label="Corner roundness" value={t.radiusScale} min={0} max={1.4} step={0.02}
            display={t.radiusScale < 0.3 ? 'sharp' : t.radiusScale > 1 ? 'pillowy' : 'soft'}
            onChange={(v) => patchTheme({ radiusScale: v })}
          />
        </Panel>

        <Panel className="stack gap-4">
          <SectionTitle eyebrow="Comfort" title="Density, motion, pointer" />
          <div className="field">
            <span className="field-label">Density</span>
            <Segmented
              value={t.density} onChange={(v) => patchTheme({ density: v })}
              ariaLabel="Density"
              options={[{ id: 'compact', label: 'Compact' }, { id: 'cozy', label: 'Cozy' }, { id: 'roomy', label: 'Roomy' }]}
            />
          </div>
          <div className="field">
            <span className="field-label">Motion</span>
            <Segmented
              value={t.motion} onChange={(v) => patchTheme({ motion: v })}
              ariaLabel="Motion"
              options={[{ id: 'full', label: 'Full weather' }, { id: 'calm', label: 'Calm' }]}
            />
            <span className="tiny muted">Calm stops the drifting, spinning and rising. Everything still works.</span>
          </div>
          <div className="field">
            <span className="field-label">Cursor trail</span>
            <div className="stack gap-2">
              {CURSORS.map((c) => (
                <button
                  key={c.id}
                  className={`scenery-opt ${t.cursor === c.id ? 'is-on' : ''}`}
                  onPointerEnter={() => play('hover')}
                  onClick={() => { play('confirm'); patchTheme({ cursor: c.id }); }}
                >
                  <span className="cursor-dot" />
                  <span className="stack grow">
                    <strong className="small">{c.label}</strong>
                    <span className="tiny muted">{c.blurb}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );

  /* ---------------- Type ---------------- */
  const Type = (
    <Panel className="stack gap-4">
      <SectionTitle
        eyebrow="Lettering"
        title="Typeface"
        sub="The first face sets headings, buttons and numerals; body copy follows in its partner."
      />
      <div className="type-grid">
        {TYPEFACES.map((f) => (
          <button
            key={f.id}
            className={`type-card ${t.typeface === f.id ? 'is-on' : ''}`}
            onPointerEnter={() => play('hover')}
            onClick={() => { play('confirm'); patchTheme({ typeface: f.id }); }}
          >
            <span className="type-sample" style={{ fontFamily: f.display, letterSpacing: f.letter }}>
              MUSIKA
            </span>
            <span className="stack gap-1">
              <strong className="small">{f.label}</strong>
              <span className="tiny muted">{f.blurb}</span>
              <span className="tiny" style={{ fontFamily: f.ui, color: 'var(--ink-soft)' }}>
                Classic English songs of the world
              </span>
            </span>
          </button>
        ))}
      </div>
    </Panel>
  );

  /* ---------------- Sound ---------------- */
  const Sound = (
    <div className="stack gap-4">
      <Panel className="stack gap-4">
        <SectionTitle
          eyebrow="Retro UI"
          title="Sound pack"
          sub="Interface blips are synthesised in the browser, so switching packs re-voices everything instantly."
        />
        <div className="preset-grid">
          {Object.entries(SOUND_PACKS).map(([id, p]) => (
            <button
              key={id}
              className={`preset ${a.pack === id ? 'is-on' : ''}`}
              onPointerEnter={() => play('hover')}
              onClick={() => {
                patchAudio({ pack: id });
                setTimeout(() => play('confirm'), 40);
              }}
            >
              <span className="pack-icon">♪</span>
              <strong className="small">{p.label}</strong>
              <span className="tiny muted">{p.blurb}</span>
            </button>
          ))}
        </div>
        <p className="tiny muted" style={{ margin: 0 }}>
          Prefer real recorded blips? Drop a pack into <code>public/sfx</code> with a
          manifest and the app uses those instead, falling back to synthesis for any event you
          leave out. <code>docs/SOUND-PACKS.md</code> covers where to get files and what the
          licences allow.
        </p>
      </Panel>

      <div className="studio-cols">
        <Panel className="stack gap-4">
          <SectionTitle eyebrow="Levels" title="Volume and switches" />
          <Switch checked={a.enabled} onChange={(v) => patchAudio({ enabled: v })} label="Sound enabled" hint="Master switch for everything audible." />
          <Slider label="Interface volume" value={a.uiVolume} min={0} max={1} step={0.01} display={`${Math.round(a.uiVolume * 100)}%`} onChange={(v) => patchAudio({ uiVolume: v })} />
          <Slider label="Music volume" value={a.musicVolume} min={0} max={1} step={0.01} display={`${Math.round(a.musicVolume * 100)}%`} onChange={(v) => patchAudio({ musicVolume: v })} />
          <div className="rule">Categories</div>
          <Switch checked={a.hoverSounds} onChange={(v) => patchAudio({ hoverSounds: v })} label="Cursor blips" hint="The little tick when you move over something." />
          <Switch checked={a.navSounds} onChange={(v) => patchAudio({ navSounds: v })} label="Navigation whoosh" />
          <Switch checked={a.bootChime} onChange={(v) => patchAudio({ bootChime: v })} label="Boot chime" hint="Plays once when the app opens." />
          <Switch checked={a.ambience} onChange={(v) => patchAudio({ ambience: v })} label="Ambient pad" hint="A slow drifting chord under everything, with occasional bubbles." />
        </Panel>

        <Panel className="stack gap-4">
          <SectionTitle eyebrow="Try them" title="Soundboard" sub="Tap to audition every event in the current pack." />
          <div className="row wrap gap-2">
            {SFX_BOARD.map((e) => (
              <AeroButton key={e} size="sm" variant="ghost" sound={null} onClick={() => play(e)}>
                {e}
              </AeroButton>
            ))}
          </div>
          <p className="tiny muted" style={{ margin: 0 }}>
            Browsers only allow audio after you interact with the page, so the first blip may arrive
            a moment late. Everything after that is immediate.
          </p>
        </Panel>
      </div>
    </div>
  );

  /* ---------------- Layout ---------------- */
  const move = (id, dir) => {
    const order = [...profile.modules];
    const i = order.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    play('click');
    setModules(order);
  };

  const Layout = (
    <div className="studio-cols">
      <Panel className="stack gap-4">
        <SectionTitle
          eyebrow="Composition"
          title="Panels on your profile"
          sub="Reorder them, or switch them off entirely."
        />
        <div className="stack gap-2">
          {profile.modules.map((id, i) => {
            const m = PROFILE_MODULES.find((x) => x.id === id);
            if (!m) return null;
            return (
              <div key={id} className="module-row">
                <span className="module-index">{i + 1}</span>
                <div className="stack grow" style={{ minWidth: 0 }}>
                  <strong className="small">{m.label}</strong>
                  <span className="tiny muted">{m.blurb}</span>
                </div>
                <div className="row gap-1">
                  <AeroButton icon size="sm" variant="ghost" sound={null} onClick={() => move(id, -1)} aria-label="Move up">↑</AeroButton>
                  <AeroButton icon size="sm" variant="ghost" sound={null} onClick={() => move(id, 1)} aria-label="Move down">↓</AeroButton>
                  <AeroButton
                    icon size="sm" variant="ghost" sound="off"
                    onClick={() => setModules(profile.modules.filter((x) => x !== id))}
                    aria-label="Remove"
                  >✕</AeroButton>
                </div>
              </div>
            );
          })}
        </div>

        {PROFILE_MODULES.some((m) => !profile.modules.includes(m.id)) && (
          <>
            <div className="rule">Hidden</div>
            <div className="row wrap gap-2">
              {PROFILE_MODULES.filter((m) => !profile.modules.includes(m.id)).map((m) => (
                <Chip key={m.id} onClick={() => { play('on'); setModules([...profile.modules, m.id]); }}>
                  ✚ {m.label}
                </Chip>
              ))}
            </div>
          </>
        )}
      </Panel>

      <Panel className="stack gap-4">
        <SectionTitle
          eyebrow="Pinned"
          title="Your five anthems"
          sub="Heart songs anywhere in the atlas, then promote them here."
        />
        <div className="stack gap-2">
          {profile.anthems.map((id) => {
            const s = songById(id);
            if (!s) return null;
            return (
              <div key={id} className="module-row">
                <span className="module-index">★</span>
                <div className="stack grow" style={{ minWidth: 0 }}>
                  <strong className="small truncate">{s.title}</strong>
                  <span className="tiny muted">{s.year}</span>
                </div>
                <AeroButton icon size="sm" variant="ghost" sound="off" onClick={() => toggleAnthem(id)} aria-label="Unpin">✕</AeroButton>
              </div>
            );
          })}
          {profile.anthems.length === 0 && <p className="small muted">No anthems pinned yet.</p>}
        </div>

        <div className="rule">Hearted — promote to anthem</div>
        <div className="stack gap-2">
          {profile.hearted.filter((id) => !profile.anthems.includes(id)).slice(0, 8).map((id) => {
            const s = songById(id);
            if (!s) return null;
            return (
              <div key={id} className="module-row">
                <span className="module-index">♥</span>
                <div className="stack grow" style={{ minWidth: 0 }}>
                  <strong className="small truncate">{s.title}</strong>
                  <span className="tiny muted">{s.year}</span>
                </div>
                <AeroButton size="sm" variant="ghost" sound="coin" onClick={() => toggleAnthem(id)}>Pin ★</AeroButton>
              </div>
            );
          })}
          {profile.hearted.filter((id) => !profile.anthems.includes(id)).length === 0 && (
            <p className="small muted">Nothing hearted that is not already pinned.</p>
          )}
        </div>
      </Panel>
    </div>
  );

  /* ---------------- Data ---------------- */
  const exportProfile = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `musika-profile-${profile.handle}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast('Profile exported', { icon: '⛁', tone: 'good', detail: 'Saved as JSON.' });
  };

  const importProfile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        setProfile({
          ...DEFAULT_PROFILE,
          ...data,
          theme: { ...DEFAULT_PROFILE.theme, ...data.theme },
          audio: { ...DEFAULT_PROFILE.audio, ...data.audio },
          orb: { ...DEFAULT_PROFILE.orb, ...data.orb },
        });
        toast('Profile imported', { icon: '⛁', tone: 'good' });
        play('success');
      } catch {
        toast('That file did not parse', { icon: '!', tone: 'bad', detail: 'Expected MUSIKA profile JSON.' });
        play('error');
      }
    };
    reader.readAsText(file);
  };

  const Data = (
    <div className="studio-cols">
      <Panel className="stack gap-4">
        <SectionTitle eyebrow="Portability" title="Take it with you" sub="Everything lives in your browser. Nothing is uploaded." />
        <div className="row gap-3 wrap">
          <AeroButton variant="aqua" sound="confirm" onClick={exportProfile}>⭳ Export profile</AeroButton>
          <AeroButton variant="ghost" sound="click" onClick={() => fileRef.current?.click()}>⭱ Import profile</AeroButton>
          <input
            ref={fileRef} type="file" accept="application/json" hidden
            onChange={(e) => e.target.files?.[0] && importProfile(e.target.files[0])}
          />
        </div>
        <p className="tiny muted" style={{ margin: 0 }}>
          The export is a plain JSON file containing your identity, style, theme, sound preferences,
          hearted songs and submissions. <code>docs/NEXT-STEPS.md</code> maps this shape onto a real
          database.
        </p>
      </Panel>

      <Panel className="stack gap-4">
        <SectionTitle eyebrow="Start over" title="Reset" sub="Puts every preference back to the factory default." />
        <AeroButton
          variant="danger" sound="error"
          onClick={() => {
            resetProfile();
            toast('Profile reset to defaults', { icon: '↺', tone: 'bad' });
          }}
        >
          ↺ Reset everything
        </AeroButton>
      </Panel>
    </div>
  );

  const PANELS = {
    style: Style, identity: Identity, avatar: Avatar, theme: Theme,
    type: Type, sound: Sound, layout: Layout, data: Data,
  };

  return (
    <>
      <div className="page-head">
        <span className="caps" style={{ color: 'var(--aura-3)' }}>Profile Studio</span>
        <h1>Make it <span className="iridescent">unmistakably yours</span>.</h1>
        <p className="lede">
          Ten styles, eleven typefaces, five sound packs and every colour in between. Changes apply
          to the whole interface the moment you make them — there is no save button.
        </p>
      </div>

      <div className="studio-tabs">
        <Segmented value={tab} onChange={setTab} options={TABS} ariaLabel="Studio sections" />
        <AeroButton to="/profile" variant="ghost" size="sm">View profile →</AeroButton>
      </div>

      <div key={tab} className="anim-rise">{PANELS[tab]}</div>
    </>
  );
}
