import { Link, useRouterState } from '@tanstack/react-router';

import { AppLinks } from '@/app/links';
import { auctionsListSearchDefaults } from '@/features/auctions-list-filters';
import { useMobileMenu } from '@/widgets/layout/model/use-mobile-menu';
import { cn } from '@/shared/lib/cn';
import { Icon, type IconName } from '@/shared/ui/icon';

type MobileNavItem = {
  label: string;
  to: string;
  icon: IconName;
  isActive: (pathname: string) => boolean;
};

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  {
    label: 'Аукционы',
    to: AppLinks.home(),
    icon: 'common:auctions',
    isActive: (pathname) => pathname === '/' || pathname.startsWith('/auctions'),
  },
];

/** Mobile-only navigation drawer (desktop nav lives in the black header). */
export const Sidebar = () => {
  const { isOpen, close } = useMobileMenu();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div
      className={cn(
        'fixed inset-0 z-40 md:hidden',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none',
      )}
    >
      <button
        type="button"
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
        aria-label="Закрыть меню"
        onClick={close}
      />

      <aside
        className={cn(
          'absolute inset-y-0 left-0 flex h-full w-72 flex-col overflow-y-auto border-r border-border bg-sidebar shadow-xl transition-transform duration-200',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center border-b border-border px-4 py-5">
          <img src="/images/logo/logo-black.png" alt="Умная логистика" className="max-h-10" />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Мобильная навигация">
          <div className="flex flex-col gap-1">
            {MOBILE_NAV_ITEMS.map((item) => {
              const active = item.isActive(pathname);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  search={auctionsListSearchDefaults}
                  onClick={close}
                  className={cn(
                    'inline-flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-nav-active text-text'
                      : 'text-muted hover:bg-raised-hover hover:text-text',
                  )}
                >
                  <Icon name={item.icon} className="size-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </div>
  );
};
