import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';

import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/animations.css';
import '@/styles/aero.css';
import '@/styles/app.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
