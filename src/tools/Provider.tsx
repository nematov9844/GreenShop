import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function ProviderConfig() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  );
}
