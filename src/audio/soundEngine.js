/* ============================================================
   MUSIKA — Retro UI sound engine
   ------------------------------------------------------------
   Every sound is SYNTHESISED at runtime with the Web Audio API
   rather than loaded from a sample pack. The voicing follows the
   classic retro-UI convention you hear on soundeffectlab-style
   libraries: short square/triangle blips for cursor movement,
   two-note rising thirds for confirm, falling minor for cancel,
   a bright arpeggio for success, a detuned buzz for errors.

   Advantages of synthesis here: zero network weight, zero
   licensing questions, and every sound inherits the user's
   chosen "sound pack" (voice, tuning, brightness) instantly.
   ============================================================ */

const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** midi note -> hz */
const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
/** scale degree helper: n('C', 5) -> midi */
const n = (name, octave) => NOTE[name] + (octave + 1) * 12;

/* ------------------------------------------------------------
   Sound packs. Each pack re-voices the same event vocabulary.
   ------------------------------------------------------------ */
export const SOUND_PACKS = {
  aqua: {
    label: 'Aqua Bloom',
    blurb: 'Soft glass bells and water plinks. The house voice.',
    wave: 'triangle',
    subWave: 'sine',
    bright: 0.75,
    decay: 1.0,
    transpose: 0,
    glass: true,
  },
  chiptune: {
    label: 'Chiptune 8-bit',
    blurb: 'Square-wave console blips, straight out of a handheld.',
    wave: 'square',
    subWave: 'square',
    bright: 1.0,
    decay: 0.62,
    transpose: 12,
    glass: false,
  },
  arcade: {
    label: 'Arcade Cabinet',
    blurb: 'Fat sawtooth coins and confident confirmations.',
    wave: 'sawtooth',
    subWave: 'square',
    bright: 0.9,
    decay: 0.8,
    transpose: 0,
    glass: false,
  },
  softbox: {
    label: 'Soft Box',
    blurb: 'Muted sine taps for late-night browsing.',
    wave: 'sine',
    subWave: 'sine',
    bright: 0.42,
    decay: 1.35,
    transpose: -12,
    glass: true,
  },
  crystal: {
    label: 'Crystal Aero',
    blurb: 'High shimmering bells with a long iridescent tail.',
    wave: 'triangle',
    subWave: 'sine',
    bright: 1.0,
    decay: 1.9,
    transpose: 12,
    glass: true,
  },
};

/* ------------------------------------------------------------
   Engine
   ------------------------------------------------------------ */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.uiBus = null;
    this.musicBus = null;
    this.reverb = null;
    this.analyser = null;
    this.ready = false;

    this.settings = {
      enabled: true,
      uiVolume: 0.55,
      musicVolume: 0.5,
      pack: 'aqua',
      ambience: false,
      samples: 'auto',   // 'auto' uses public/sfx when present, 'off' forces synthesis
    };

    this._ambience = null;
    this._song = null;
    this._lastHover = 0;

    /* Optional recorded sample pack — see loadSamplePack(). */
    this.samples = null;      // { event: AudioBuffer }
    this.samplePack = null;   // { name, credit }
    this._sampleTried = false;
  }

  /* ------------------------------------------------------------
     Recorded sample packs.
     ------------------------------------------------------------
     Synthesis is the default because it ships with the app and
     carries no licence. But a member can drop real recorded blips
     into public/sfx with a manifest.json, and those take over.

     Files are read from our own origin only — several free
     libraries (soundeffect-lab among them) forbid hotlinking, so
     the pack has to be downloaded by hand first. See
     docs/SOUND-PACKS.md.
     ------------------------------------------------------------ */
  async loadSamplePack() {
    if (this._sampleTried || !this.ready) return this.samplePack;
    this._sampleTried = true;

    try {
      const res = await fetch('/sfx/manifest.json', { cache: 'no-cache' });
      if (!res.ok) return null;

      const manifest = await res.json();
      const entries = Object.entries(manifest.files ?? {});
      if (!entries.length) return null;

      const decoded = {};
      await Promise.all(entries.map(async ([event, file]) => {
        try {
          const r = await fetch(`/sfx/${file}`);
          if (!r.ok) return;
          decoded[event] = await this.ctx.decodeAudioData(await r.arrayBuffer());
        } catch {
          /* one bad file should not sink the pack */
        }
      }));

      if (!Object.keys(decoded).length) return null;
      this.samples = decoded;
      this.samplePack = {
        name: manifest.name ?? 'Recorded pack',
        credit: manifest.credit ?? '',
        count: Object.keys(decoded).length,
      };
      return this.samplePack;
    } catch {
      return null;
    }
  }

  _playSample(event) {
    const buf = this.samples?.[event];
    if (!buf) return false;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.connect(this.uiBus);
    src.start();
    return true;
  }

  /* ---- lifecycle ---- */

  /** Must be called from a user gesture the first time. */
  unlock() {
    if (this.ready) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;

    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(this.ctx.destination);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.78;
    this.analyser.connect(this.master);

    this.uiBus = this.ctx.createGain();
    this.uiBus.gain.value = this.settings.uiVolume;

    this.musicBus = this.ctx.createGain();
    this.musicBus.gain.value = this.settings.musicVolume;

    // A short plate-ish reverb gives every blip that glassy Aero tail.
    this.reverb = this.ctx.createConvolver();
    this.reverb.buffer = this._impulse(1.6, 2.4);
    const wet = this.ctx.createGain();
    wet.gain.value = 0.28;
    this.reverb.connect(wet);
    wet.connect(this.analyser);

    this.uiBus.connect(this.analyser);
    this.uiBus.connect(this.reverb);
    this.musicBus.connect(this.analyser);
    this.musicBus.connect(this.reverb);

    this.ready = true;
    this.loadSamplePack();
    if (this.settings.ambience) this.startAmbience();
  }

  configure(patch) {
    Object.assign(this.settings, patch);
    if (!this.ready) return;
    this.uiBus.gain.setTargetAtTime(this.settings.uiVolume, this.ctx.currentTime, 0.02);
    this.musicBus.gain.setTargetAtTime(this.settings.musicVolume, this.ctx.currentTime, 0.05);
    if (this.settings.ambience) this.startAmbience();
    else this.stopAmbience();
  }

  get pack() {
    return SOUND_PACKS[this.settings.pack] || SOUND_PACKS.aqua;
  }

  /* ---- primitives ---- */

  _impulse(seconds, decay) {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const data = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  /** One synth voice: osc -> lowpass -> ADSR gain -> bus */
  _voice({
    freq,
    wave,
    at = 0,
    dur = 0.14,
    gain = 0.3,
    attack = 0.004,
    cutoff,
    sweep = 0,
    detune = 0,
    bus,
  }) {
    if (!this.ready) return;
    const t0 = this.ctx.currentTime + at;
    const p = this.pack;
    const osc = this.ctx.createOscillator();
    osc.type = wave || p.wave;
    osc.frequency.setValueAtTime(freq, t0);
    if (sweep) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * sweep), t0 + dur);
    osc.detune.value = detune;

    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = cutoff ?? 900 + 6500 * p.bright;
    filt.Q.value = p.glass ? 3.2 : 0.8;

    const g = this.ctx.createGain();
    const life = dur * p.decay;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + life);

    osc.connect(filt);
    filt.connect(g);
    g.connect(bus || this.uiBus);
    osc.start(t0);
    osc.stop(t0 + life + 0.06);
  }

  /** Filtered noise burst — used for whooshes, page turns, static. */
  _noise({ at = 0, dur = 0.2, gain = 0.16, type = 'bandpass', from = 900, to = 240, q = 1.2, bus }) {
    if (!this.ready) return;
    const t0 = this.ctx.currentTime + at;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const filt = this.ctx.createBiquadFilter();
    filt.type = type;
    filt.Q.value = q;
    filt.frequency.setValueAtTime(from, t0);
    filt.frequency.exponentialRampToValueAtTime(Math.max(40, to), t0 + dur);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    src.connect(filt);
    filt.connect(g);
    g.connect(bus || this.uiBus);
    src.start(t0);
    src.stop(t0 + dur + 0.05);
  }

  /* ---- the event vocabulary ---- */

  play(event) {
    if (!this.settings.enabled || !this.ready) return;

    // A recorded pack, where one is installed, wins for this event.
    if (this.settings.samples !== 'off' && this.samples) {
      if (event === 'hover') {
        const now = performance.now();
        if (now - this._lastHover < 45) return;
        this._lastHover = now;
      }
      if (this._playSample(event)) return;
    }

    const p = this.pack;
    const T = p.transpose;
    const v = (midi) => hz(midi + T);

    switch (event) {
      /* cursor moving over anything focusable */
      case 'hover': {
        const now = performance.now();
        if (now - this._lastHover < 45) return; // de-machine-gun
        this._lastHover = now;
        this._voice({ freq: v(n('E', 6)), dur: 0.055, gain: 0.10, cutoff: 5200 });
        break;
      }
      /* generic click */
      case 'click':
        this._voice({ freq: v(n('A', 5)), dur: 0.075, gain: 0.24 });
        this._voice({ freq: v(n('E', 6)), dur: 0.05, gain: 0.12, at: 0.012 });
        break;
      /* affirmative — rising major third */
      case 'confirm':
        this._voice({ freq: v(n('C', 6)), dur: 0.11, gain: 0.26 });
        this._voice({ freq: v(n('E', 6)), dur: 0.16, gain: 0.22, at: 0.075 });
        break;
      /* negative — falling step */
      case 'back':
        this._voice({ freq: v(n('G', 5)), dur: 0.1, gain: 0.22 });
        this._voice({ freq: v(n('D', 5)), dur: 0.15, gain: 0.18, at: 0.06 });
        break;
      /* success fanfare — bright arpeggio */
      case 'success':
        [n('C', 6), n('E', 6), n('G', 6), n('C', 7)].forEach((m, i) =>
          this._voice({ freq: v(m), dur: 0.2, gain: 0.2, at: i * 0.065 }));
        break;
      /* error — detuned dyad buzz */
      case 'error':
        this._voice({ freq: v(n('B', 4)), wave: 'square', dur: 0.19, gain: 0.2 });
        this._voice({ freq: v(n('B', 4)), wave: 'square', dur: 0.19, gain: 0.2, detune: 42 });
        break;
      /* toggle on / off */
      case 'on':
        this._voice({ freq: v(n('D', 6)), dur: 0.09, gain: 0.2, sweep: 1.5 });
        break;
      case 'off':
        this._voice({ freq: v(n('D', 6)), dur: 0.09, gain: 0.2, sweep: 0.62 });
        break;
      /* transport */
      case 'play':
        this._voice({ freq: v(n('A', 5)), dur: 0.14, gain: 0.24, sweep: 1.5 });
        this._voice({ freq: v(n('E', 6)), dur: 0.2, gain: 0.16, at: 0.05 });
        break;
      case 'pause':
        this._voice({ freq: v(n('E', 6)), dur: 0.12, gain: 0.2, sweep: 0.68 });
        break;
      /* navigation whoosh between routes */
      case 'nav':
        this._noise({ dur: 0.34, gain: 0.1, from: 2600, to: 300, q: 0.8 });
        this._voice({ freq: v(n('G', 5)), dur: 0.13, gain: 0.13, at: 0.04, sweep: 1.35 });
        break;
      /* a bubble popping in the background */
      case 'bubble':
        this._voice({ freq: v(n('C', 7)), dur: 0.06, gain: 0.09, sweep: 0.45, cutoff: 7000 });
        break;
      /* like / heart */
      case 'heart':
        this._voice({ freq: v(n('E', 6)), dur: 0.1, gain: 0.2 });
        this._voice({ freq: v(n('B', 6)), dur: 0.22, gain: 0.16, at: 0.06 });
        break;
      /* collectible / badge unlock */
      case 'coin':
        this._voice({ freq: v(n('B', 6)), wave: 'square', dur: 0.07, gain: 0.2 });
        this._voice({ freq: v(n('E', 7)), wave: 'square', dur: 0.3, gain: 0.18, at: 0.07 });
        break;
      /* notification */
      case 'notify':
        this._voice({ freq: v(n('G', 6)), dur: 0.14, gain: 0.2 });
        this._voice({ freq: v(n('C', 7)), dur: 0.26, gain: 0.15, at: 0.1 });
        break;
      /* typing tick */
      case 'type':
        this._voice({ freq: v(n('A', 6)), dur: 0.028, gain: 0.06, cutoff: 6000 });
        break;
      /* modal open / close */
      case 'open':
        this._noise({ dur: 0.26, gain: 0.08, from: 400, to: 2800, q: 0.7 });
        this._voice({ freq: v(n('C', 6)), dur: 0.16, gain: 0.16, sweep: 1.32 });
        break;
      case 'close':
        this._noise({ dur: 0.22, gain: 0.07, from: 2400, to: 350, q: 0.7 });
        this._voice({ freq: v(n('C', 6)), dur: 0.14, gain: 0.14, sweep: 0.72 });
        break;
      /* the MUSIKA boot chime — a wide suspended-to-major bloom */
      case 'boot':
        [
          [n('C', 4), 0.0], [n('G', 4), 0.09], [n('D', 5), 0.18],
          [n('A', 5), 0.27], [n('E', 6), 0.36], [n('B', 6), 0.45],
        ].forEach(([m, at]) =>
          this._voice({ freq: v(m), dur: 1.5, gain: 0.16, at, attack: 0.05, cutoff: 6200 }));
        break;
      default:
        break;
    }
  }

  /* ---- ambience: a slow Aero pad + occasional bubbles ---- */

  startAmbience() {
    if (!this.ready || this._ambience) return;
    const now = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.value = 0.0001;
    g.gain.exponentialRampToValueAtTime(0.05, now + 3);
    g.connect(this.musicBus);

    const oscs = [n('C', 3), n('G', 3), n('D', 4), n('A', 4)].map((m, i) => {
      const o = this.ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = hz(m);
      o.detune.value = (i - 1.5) * 6;
      const lfo = this.ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.017;
      const lg = this.ctx.createGain();
      lg.gain.value = 3.5;
      lfo.connect(lg);
      lg.connect(o.detune);
      lfo.start();
      o.connect(g);
      o.start();
      return { o, lfo };
    });

    const bubbleTimer = setInterval(() => {
      if (Math.random() < 0.55) this.play('bubble');
    }, 4200);

    this._ambience = { g, oscs, bubbleTimer };
  }

  stopAmbience() {
    if (!this._ambience) return;
    const { g, oscs, bubbleTimer } = this._ambience;
    clearInterval(bubbleTimer);
    const now = this.ctx.currentTime;
    g.gain.cancelScheduledValues(now);
    g.gain.setValueAtTime(g.gain.value, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    oscs.forEach(({ o, lfo }) => {
      o.stop(now + 1.4);
      lfo.stop(now + 1.4);
    });
    this._ambience = null;
  }

  /* ------------------------------------------------------------
     Preview player.
     The catalogue links out to the real recordings; what plays
     in-app is a generated "signature" — a short instrumental
     motif derived deterministically from the track's own seed,
     so every song has a recognisable preview with no licensed
     audio anywhere in the bundle.
     ------------------------------------------------------------ */

  startPreview(seed, tempo = 96) {
    this.stopPreview();
    if (!this.ready || !this.settings.enabled) return;

    let s = seed >>> 0 || 1;
    const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);

    const roots = [n('C', 3), n('A', 2), n('F', 2), n('G', 2), n('D', 3), n('E', 3)];
    const root = roots[Math.floor(rnd() * roots.length)];
    const scale = rnd() > 0.45 ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];
    const beat = 60 / tempo;

    const bass = this.ctx.createGain();
    bass.gain.value = 0.16;
    bass.connect(this.musicBus);

    const lead = this.ctx.createGain();
    lead.gain.value = 0.1;
    lead.connect(this.musicBus);

    let step = 0;
    const tick = () => {
      const deg = scale[Math.floor(rnd() * scale.length)];
      const chordRoot = root + [0, 5, 7, 3][step % 4];

      // bass pulse
      this._voice({
        freq: hz(chordRoot), wave: 'triangle', dur: beat * 1.6,
        gain: 0.22, cutoff: 700, bus: bass,
      });
      // pad third + fifth
      [4, 7].forEach((iv, i) => this._voice({
        freq: hz(chordRoot + 12 + iv), wave: 'sine', dur: beat * 1.8,
        gain: 0.1, at: i * 0.02, cutoff: 1800, bus: bass,
      }));
      // melodic answer
      if (rnd() > 0.32) {
        this._voice({
          freq: hz(root + 24 + deg), wave: this.pack.wave, dur: beat * 0.8,
          gain: 0.16, at: beat * 0.5, cutoff: 4200, bus: lead,
        });
      }
      step++;
    };

    tick();
    const id = setInterval(tick, beat * 2000);
    this._song = { id, bass, lead };
  }

  stopPreview() {
    if (!this._song) return;
    clearInterval(this._song.id);
    const now = this.ctx.currentTime;
    [this._song.bass, this._song.lead].forEach((g) => {
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(g.gain.value, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    });
    this._song = null;
  }

  /* ------------------------------------------------------------
     Real audio.
     Apple's preview CDN sends `Access-Control-Allow-Origin: *`, so
     a crossOrigin element can be routed through our graph — which
     means the visualiser reacts to the actual recording rather
     than to a fake animation. A MediaElementSource can only be
     created once per element, so the node is cached on it.
     ------------------------------------------------------------ */
  connectElement(el) {
    if (!this.ready || !el) return false;
    if (el._musikaNode) return true;
    try {
      const node = this.ctx.createMediaElementSource(el);
      node.connect(this.musicBus);
      el._musikaNode = node;
      return true;
    } catch {
      // Tainted stream or an already-connected element: let the
      // browser play it directly, just without the spectrum.
      el._musikaNode = null;
      return false;
    }
  }

  /** Live spectrum for the visualiser. */
  spectrum(target) {
    if (!this.ready) return null;
    const arr = target || new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(arr);
    return arr;
  }
}

export const sound = new SoundEngine();

/* Unlock on the first real interaction anywhere in the document. */
if (typeof window !== 'undefined') {
  const unlock = () => sound.unlock();
  ['pointerdown', 'keydown', 'touchstart'].forEach((evt) =>
    window.addEventListener(evt, unlock, { once: true, passive: true }));
}
