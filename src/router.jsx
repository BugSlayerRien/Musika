import { createBrowserRouter } from 'react-router-dom';
import { App } from '@/App';
import { Home } from '@/pages/Home';
import { Atlas } from '@/pages/Atlas';
import { CountryPage } from '@/pages/CountryPage';
import { ArtistPage } from '@/pages/ArtistPage';
import { SongPage } from '@/pages/SongPage';
import { Catalogue } from '@/pages/Catalogue';
import { Community, MemberPage } from '@/pages/Community';
import { Submit } from '@/pages/Submit';
import { Profile } from '@/pages/Profile';
import { Studio } from '@/pages/Studio';
import { About, NotFound } from '@/pages/About';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'atlas', element: <Atlas /> },
      { path: 'country/:id', element: <CountryPage /> },
      { path: 'artist/:id', element: <ArtistPage /> },
      { path: 'song/:id', element: <SongPage /> },
      { path: 'catalogue', element: <Catalogue /> },
      { path: 'community', element: <Community /> },
      { path: 'member/:handle', element: <MemberPage /> },
      { path: 'submit', element: <Submit /> },
      { path: 'profile', element: <Profile /> },
      { path: 'studio', element: <Studio /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
