import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SONGS, songById } from '@/data/songs';
import { previewFor } from '@/data/media';
import { sound } from '@/audio/soundEngine';
import { useProfile } from '@/context/ProfileContext';

const PlayerCtx = createContext(null);

/**
 * Two playback modes, chosen per track.
 *
 *  · `stream` — the real 30-second preview Apple publishes for the
 *    recording, routed through our audio graph so the visualiser
 *    reads the actual waveform.
 *  · `synth`  — for entries nothing matched, an original motif
 *    generated from the song's seed. Always available, works
 *    offline, and keeps the app usable end to end.
 */
export function PlayerProvider({ children }) {
  const { profile } = useProfile();
  const [queue, setQueue] = useState(() => SONGS.map((s) => s.id));
  const [index, setIndex] = useState(-1); // -1 = nothing loaded yet
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off'); // off | all | one
  const [history, setHistory] = useState([]);
  const [buffering, setBuffering] = useState(false);

  const audioRef = useRef(null);
  const tickRef = useRef(null);

  const current = useMemo(
    () => (index >= 0 ? songById(queue[index]) ?? null : null),
    [queue, index],
  );

  const previewUrl = current ? previewFor(current.id) : null;
  const mode = previewUrl ? 'stream' : 'synth';

  /* ---- one audio element for the life of the app ---- */
  if (!audioRef.current && typeof Audio !== 'undefined') {
    const el = new Audio();
    el.crossOrigin = 'anonymous';
    el.preload = 'none';
    audioRef.current = el;
  }

  /* ---- transport ---- */
  const playSong = useCallback((songId, contextQueue) => {
    const q = contextQueue?.length ? contextQueue : queue;
    const i = q.indexOf(songId);
    if (contextQueue?.length) setQueue(q);
    setIndex(i >= 0 ? i : 0);
    setPosition(0);
    setPlaying(true);
    setHistory((h) => [songId, ...h.filter((x) => x !== songId)].slice(0, 40));
  }, [queue]);

  const toggle = useCallback(() => {
    // pressing play with an empty deck drops the needle on the first track
    if (index < 0) {
      setIndex(0);
      setPosition(0);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  }, [index]);

  const next = useCallback(() => {
    setIndex((i) => {
      if (shuffle) return Math.floor(Math.random() * queue.length);
      if (i + 1 >= queue.length) return repeat === 'all' ? 0 : i;
      return i + 1;
    });
    setPosition(0);
  }, [queue.length, shuffle, repeat]);

  const prev = useCallback(() => {
    setPosition((pos) => {
      if (pos > 4) {
        if (audioRef.current) audioRef.current.currentTime = 0;
        return 0; // first press restarts the track
      }
      setIndex((i) => (i - 1 < 0 ? queue.length - 1 : i - 1));
      return 0;
    });
  }, [queue.length]);

  const seek = useCallback((seconds) => {
    const el = audioRef.current;
    if (el && el.src && Number.isFinite(el.duration)) {
      el.currentTime = Math.min(seconds, el.duration - 0.05);
    }
    setPosition(seconds);
  }, []);

  /* ------------------------------------------------------------
     Load whichever source this track uses.
     ------------------------------------------------------------ */
  useEffect(() => {
    const el = audioRef.current;
    sound.stopPreview();
    if (el) {
      el.pause();
      el.removeAttribute('src');
      el.load();
    }
    setDuration(current ? (previewUrl ? 0 : current.seconds) : 0);
    if (!current) return;

    if (previewUrl && el) {
      sound.unlock();
      sound.connectElement(el);
      el.src = previewUrl;
      el.load();
      setBuffering(true);
    }
  }, [current, previewUrl]);

  /* ---- volume follows the member's preference ---- */
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    // When the element is routed through our graph the musicBus gain
    // already applies, so keep the element itself at unity there.
    el.volume = el._musikaNode ? 1 : profile.audio.musicVolume;
    el.muted = !profile.audio.enabled;
  }, [profile.audio.musicVolume, profile.audio.enabled, current]);

  /* ---- play / pause both sources ---- */
  useEffect(() => {
    const el = audioRef.current;

    if (!playing || !current) {
      el?.pause();
      sound.stopPreview();
      return undefined;
    }

    if (mode === 'stream' && el) {
      sound.unlock();
      el.play().catch(() => {
        // Autoplay refused or the stream failed — fall back to the motif
        // rather than leaving the member with silence.
        sound.startPreview(current.seed, current.bpm);
      });
    } else if (profile.audio.enabled) {
      sound.unlock();
      sound.startPreview(current.seed, current.bpm);
    }

    return () => sound.stopPreview();
  }, [playing, current, mode, profile.audio.enabled]);

  /* ---- the clock: real audio reports its own time, synth is counted ---- */
  useEffect(() => {
    clearInterval(tickRef.current);
    const el = audioRef.current;

    if (mode === 'stream' && el) {
      const onTime = () => setPosition(el.currentTime);
      const onMeta = () => { setDuration(el.duration || 30); setBuffering(false); };
      const onEnd = () => {
        if (repeat === 'one') { el.currentTime = 0; el.play().catch(() => {}); return; }
        next();
      };
      const onWaiting = () => setBuffering(true);
      const onPlaying = () => setBuffering(false);
      const onError = () => setBuffering(false);

      el.addEventListener('timeupdate', onTime);
      el.addEventListener('loadedmetadata', onMeta);
      el.addEventListener('ended', onEnd);
      el.addEventListener('waiting', onWaiting);
      el.addEventListener('playing', onPlaying);
      el.addEventListener('error', onError);
      return () => {
        el.removeEventListener('timeupdate', onTime);
        el.removeEventListener('loadedmetadata', onMeta);
        el.removeEventListener('ended', onEnd);
        el.removeEventListener('waiting', onWaiting);
        el.removeEventListener('playing', onPlaying);
        el.removeEventListener('error', onError);
      };
    }

    if (!playing || !current) return undefined;
    tickRef.current = setInterval(() => {
      setPosition((p) => {
        if (p + 1 >= current.seconds) {
          if (repeat === 'one') return 0;
          next();
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [playing, current, next, repeat, mode]);

  /* ---- keyboard transport ---- */
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      if (e.code === 'Space') { e.preventDefault(); toggle(); }
      if (e.code === 'ArrowRight' && e.shiftKey) { e.preventDefault(); next(); }
      if (e.code === 'ArrowLeft' && e.shiftKey) { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, next, prev]);

  const effectiveDuration = duration || current?.seconds || 0;

  const value = useMemo(() => ({
    queue, setQueue, index, current, playing, position, shuffle, repeat, history,
    mode, buffering, duration: effectiveDuration,
    playSong, toggle, next, prev, seek,
    setShuffle, setRepeat,
    progress: effectiveDuration ? Math.min(1, position / effectiveDuration) : 0,
  }), [queue, index, current, playing, position, shuffle, repeat, history,
    mode, buffering, effectiveDuration, playSong, toggle, next, prev, seek]);

  return <PlayerCtx.Provider value={value}>{children}</PlayerCtx.Provider>;
}

export const usePlayer = () => {
  const ctx = useContext(PlayerCtx);
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>');
  return ctx;
};
