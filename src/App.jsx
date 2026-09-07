import { useState } from 'react';
import { ProfileProvider } from '@/context/ProfileContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { ToastProvider } from '@/context/ToastContext';
import { AppShell } from '@/components/layout/AppShell';
import { BootScreen } from '@/components/layout/BootScreen';

/**
 * Root of the tree. Providers wrap the shell, and the boot splash
 * sits on top until the member enters (which also unlocks audio).
 */
export function App() {
  const [booted, setBooted] = useState(
    () => sessionStorage.getItem('musika.booted') === '1',
  );

  const finishBoot = () => {
    sessionStorage.setItem('musika.booted', '1');
    setBooted(true);
  };

  return (
    <ProfileProvider>
      <ToastProvider>
        <PlayerProvider>
          {!booted && <BootScreen onDone={finishBoot} />}
          <AppShell />
        </PlayerProvider>
      </ToastProvider>
    </ProfileProvider>
  );
}
