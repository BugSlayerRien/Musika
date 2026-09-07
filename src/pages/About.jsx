import { Panel, SectionTitle, Chip } from '@/components/aero/Controls';
import { AeroButton } from '@/components/aero/AeroButton';
import { COUNTRIES } from '@/data/countries';
import { ARTISTS } from '@/data/artists';
import { SONGS } from '@/data/songs';
import { mediaCoverage } from '@/data/media';
import { STYLES } from '@/data/styles';
import { TYPEFACES } from '@/data/fonts';

export function About() {
  const media = mediaCoverage();

  return (
    <>
      <Panel className="hero" irisEdge elevation="deep">
        <div className="stack gap-4" style={{ maxWidth: '72ch' }}>
          <span className="caps" style={{ color: 'var(--aura-3)' }}>About</span>
          <h1>A room for the songs<br /><span className="iridescent">everybody’s parents played</span>.</h1>
          <p className="lede">
            MUSIKA started as a small site about OPM bands. It kept running into the same
            observation: half the songs people call classics in the Philippines were written in
            English — and that is true almost everywhere pop music landed. So the site became an
            atlas instead.
          </p>
        </div>
      </Panel>

      <div className="card-grid card-grid-lg">
        <Panel>
          <SectionTitle eyebrow="The premise" title="One rule, one map" />
          <p>
            A song belongs here if it is sung in English and the band is from the country it is
            filed under. That is the whole filter. What it surfaces is a shelf you would never get
            from a chart: The Dawn next to Shocking Blue next to a-ha, all doing the same thing from
            different corners of the world.
          </p>
          <p>
            Rooms are curated by the members who grew up with the music. Every entry carries a liner
            note explaining why it counts as a classic where it comes from — that note is the point,
            not the metadata.
          </p>
        </Panel>

        <Panel>
          <SectionTitle eyebrow="What is in it" title="The atlas today" />
          <div className="card-grid card-grid-sm">
            <Panel elevation="flat" className="stat-tile"><b>{COUNTRIES.length}</b><span className="tiny muted">country rooms</span></Panel>
            <Panel elevation="flat" className="stat-tile"><b>{ARTISTS.length}</b><span className="tiny muted">bands</span></Panel>
            <Panel elevation="flat" className="stat-tile"><b>{SONGS.length}</b><span className="tiny muted">entries</span></Panel>
            <Panel elevation="flat" className="stat-tile">
              <b>{media.withPreview}</b><span className="tiny muted">playable previews</span>
            </Panel>
          </div>
          <p className="small muted" style={{ marginTop: 'var(--sp-4)' }}>
            Rooms with nothing in them are left visible on purpose. An empty shelf is an invitation.
          </p>
        </Panel>
      </div>

      <Panel>
        <SectionTitle eyebrow="How it is built" title="Design and technology" />
        <div className="card-grid card-grid-lg">
          <div className="stack gap-3">
            <h4>Frutiger Aero, in purple</h4>
            <p className="small">
              The interface is a deliberate revival: glossy glass, humanist type, bubbles, aurora
              gradients, lens flares and water caustics — the visual language of consumer software
              from roughly 2004 to 2011, pushed toward a purple-iridescent palette rather than the
              usual aqua-and-grass green.
            </p>
            <div className="row wrap gap-2">
              <Chip tone="violet">glass panels</Chip>
              <Chip tone="aqua">aurora fields</Chip>
              <Chip tone="mint">bubble weather</Chip>
              <Chip tone="gold">skeuomorphic controls</Chip>
              <Chip>iridescent film</Chip>
            </div>
          </div>

          <div className="stack gap-3">
            <h4>Real recordings, no hosting</h4>
            <p className="small">
              {media.matched} of {media.total} entries are matched against the public iTunes Search
              API, which supplies the real cover artwork and the 30-second preview Apple publishes
              for each recording. Both are linked, never copied — the repository contains no
              third-party media at all. Because Apple's audio CDN allows cross-origin reads, the
              preview streams through the app's own audio graph, so the visualiser is reading the
              actual waveform.
            </p>
            <p className="small">
              Anything that does not match falls back to a procedural sleeve and a synthesised
              motif, and the player labels which one you are hearing. It never pretends a generated
              motif is the record.
            </p>
          </div>

          <div className="stack gap-3">
            <h4>Sound without samples</h4>
            <p className="small">
              Every blip, chime and whoosh is generated live with the Web Audio API in the voicing
              retro UI sound libraries established — short square and triangle blips, rising thirds
              for confirm, falling steps for cancel, detuned dyads for errors. Nothing is downloaded,
              so switching sound packs re-voices the entire interface instantly and there is no
              licence attached to anything you hear.
            </p>
            <p className="small">
              Recorded packs are supported too: drop files into <code>public/sfx</code> and they
              take over, with synthesis filling any gap.
            </p>
          </div>

          <div className="stack gap-3">
            <h4>Yours to repaint</h4>
            <p className="small">
              {STYLES.length} styles, {TYPEFACES.length} typefaces, five sound packs. A style is a
              whole visual language — wallpaper, palette, corner sharpness, weather, ink direction,
              typeface — applied in one move and editable afterwards down to individual colours.
              Everything visual is a CSS custom property, so the Studio repaints the entire
              application at runtime. Preferences live in your browser and export as JSON.
            </p>
            <AeroButton to="/studio" variant="primary" size="sm">⚙ Open the Studio</AeroButton>
          </div>

          <div className="stack gap-3">
            <h4>Stack</h4>
            <p className="small">
              React 18 and Vite, React Router for the rooms, plain CSS with custom properties for
              the entire design system, and the Web Audio API for sound. No UI framework and no
              icon font. The wallpapers and decals are real PNGs, but generated here from SVG
              sources by a build script rather than sourced from an archive — which is why they
              recolour with the theme and ship without a licence question.
            </p>
            <div className="row wrap gap-2">
              <Chip>React</Chip>
              <Chip>Vite</Chip>
              <Chip>React Router</Chip>
              <Chip>Web Audio</Chip>
              <Chip>CSS custom properties</Chip>
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <SectionTitle eyebrow="Contribute" title="The shelves are not finished" />
        <p>
          There are rooms here with one entry and rooms with none. If you know the English-language
          song your country treats as a standard — the one at every wedding, every reunion, every
          long drive — file it.
        </p>
        <div className="row gap-3 wrap">
          <AeroButton to="/submit" variant="primary" size="lg">✚ File a song</AeroButton>
          <AeroButton to="/atlas" variant="aqua" size="lg">🌐 Browse the atlas</AeroButton>
        </div>
      </Panel>
    </>
  );
}

export function NotFound() {
  return (
    <Panel className="hero" irisEdge elevation="deep">
      <div className="stack center gap-4 center-text" style={{ padding: 'var(--sp-7) 0' }}>
        <span style={{ fontSize: 64 }} className="anim-float">☁</span>
        <h1><span className="iridescent">Nothing filed here</span></h1>
        <p className="lede">That address is not a room, a band or an entry.</p>
        <div className="row gap-3 wrap center">
          <AeroButton to="/" variant="primary" sound="back">← Back to the listening room</AeroButton>
          <AeroButton to="/atlas" variant="ghost">Open the atlas</AeroButton>
        </div>
      </div>
    </Panel>
  );
}
