import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import ProviderConfig from './tools/Provider';

createRoot(document.getElementById('root')!).render(
  <ProviderConfig>
    <RouterProvider router={router} />
  </ProviderConfig>
);
