import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '../redux/store';
import { ReactNode } from 'react';

interface ProviderConfigProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export default function ProviderConfig({ children }: ProviderConfigProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
