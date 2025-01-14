import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { root } from './rooter/root';  // Routing import
import ProviderConfig from './tools/Provider';  // ProviderConfig import

createRoot(document.getElementById('root')!).render(
  <ProviderConfig>
    <RouterProvider router={root} />
  </ProviderConfig>
);
