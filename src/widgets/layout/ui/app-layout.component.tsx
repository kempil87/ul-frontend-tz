import { Suspense } from 'react';
import { Outlet } from '@tanstack/react-router';

import { Header } from '@/widgets/layout/ui/header.component';
import { Sidebar } from '@/widgets/layout/ui/sidebar.component';
import { ErrorBoundary } from '@/shared/ui/error-boundary';
import { PageLoader } from '@/shared/ui/page-loader';

export const AppLayout = () => {
  return (
    <div className="flex h-full min-h-0 flex-col bg-app text-text">
      <Header />
      <Sidebar />

      <main className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-6 md:py-8">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};
