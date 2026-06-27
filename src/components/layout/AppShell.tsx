import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="flex flex-col bg-zhu-bg min-h-dvh">
      <TopBar />
      {/* Extra bottom padding so content isn't hidden behind the fixed nav */}
      <main className="flex-1 overflow-y-auto pb-[calc(3.5rem+env(safe-area-inset-bottom,20px))]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
