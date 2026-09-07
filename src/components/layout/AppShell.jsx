import { useEffect, useState } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { SideRail } from '@/components/layout/SideRail';
import { NowPlaying } from '@/components/player/NowPlaying';
import { Scenery } from '@/components/aero/Scenery';
import { CursorTrail } from '@/components/aero/CursorTrail';
import { useSound } from '@/hooks/useSound';
import { usePlayer } from '@/context/PlayerContext';

export function AppShell() {
  const [railOpen, setRailOpen] = useState(false);
  const { play } = useSound();
  const loc = useLocation();
  const { current } = usePlayer();

  /* a soft whoosh whenever the route changes */
  useEffect(() => {
    play('nav');
    setRailOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname]);

  return (
    <div className={`shell ${current ? 'has-player' : ''}`}>
      <Scenery />
      <CursorTrail />
      <TopBar onMenu={() => setRailOpen((o) => !o)} />
      <div className="shell-body">
        <SideRail open={railOpen} onClose={() => setRailOpen(false)} />
        <main className="content" key={loc.pathname}>
          <Outlet />
          <footer className="page-foot">
            <span className="tiny muted">
              MUSIKA · a community atlas of English-language classics · built with air, glass and Web Audio
            </span>
          </footer>
        </main>
      </div>
      <NowPlaying />
      <ScrollRestoration />
    </div>
  );
}
