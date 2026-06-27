import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/collection', label: 'Collection', icon: '💎' },
  { to: '/ideas', label: 'Ideas', icon: '💡' },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-100"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `tap-target flex flex-col items-center justify-center gap-0.5 no-select transition-colors ${
                isActive ? 'text-zhu-accent' : 'text-zhu-muted'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
