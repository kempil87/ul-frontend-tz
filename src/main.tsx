import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import '/public/styles/index.css';
import { App } from '@/app.tsx';
import { queryClient } from '@/app/query-client';
import { enableMocking } from '@/shared/api/msw/enable-mocking';
import { ErrorBoundary } from '@/shared/ui/error-boundary';

async function bootstrap() {
  await enableMocking();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}

bootstrap();
