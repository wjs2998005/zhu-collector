import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const StampDetailPage = lazy(() => import('@/pages/StampDetailPage'));
const CollectionPage = lazy(() => import('@/pages/CollectionPage'));
const IdeasPage = lazy(() => import('@/pages/IdeasPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="w-8 h-8 border-3 border-zhu-pink border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function App({ seedPromise }: { seedPromise: Promise<Error | void> }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage seedPromise={seedPromise} />} />
          <Route path="/stamp/:id" element={<StampDetailPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/ideas" element={<IdeasPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}