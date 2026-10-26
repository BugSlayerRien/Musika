import { useEffect, useState } from 'react';
import { sound } from '@/audio/soundEngine';
import { useProfile } from '@/context/ProfileContext';
import './boot.css';

const LINES = [
  'mounting country rooms…',
  'polishing glass…',
  'tuning the sound pack…',
  'filling the bubble tank…',
  'restoring your aura…',
];

/**
 * The splash. Doubles as the audio gate — browsers will not let a
 * page make noise until someone interacts, so the "Enter" press is
 * both a nice piece of theatre and the unlock.
 */
export function BootScreen({ onDone }) {
  const { profile } = useProfile();
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % LINES.length), 700);
    return () => clearInterval(id);
  }, []);

  const enter = () => {
    sound.unlock();
    if (profile.audio.enabled && profile.audio.bootChime) sound.play('boot');
    setLeaving(true);
    setTimeout(onDone, 900);
  };

  return (
    <div className={`boot ${leaving ? 'is-leaving' : ''}`}>
      <div className="boot-bg" />
      <div className="boot-inner">
        <h1 className="boot-word iridescent">MUSIKA</h1>
        <p className="boot-tag">Classic English songs of the world</p>

        <button className="boot-enter btn btn-primary btn-lg" onClick={enter}>
          ▶ Enter the listening room
        </button>

        <div className="boot-status">
          <span className="boot-dot" />
          <span className="tiny muted">{LINES[step]}</span>
        </div>
      </div>
    </div>
  );
}
