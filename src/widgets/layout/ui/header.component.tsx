import { Link, useRouterState } from '@tanstack/react-router';

import { AppLinks } from '@/app/links';
import { auctionsListSearchDefaults } from '@/features/auctions-list-filters';
import { useMobileMenu } from '@/widgets/layout/model/use-mobile-menu';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

const NAV_ITEMS = [
  {
    label: 'Аукционы',
    to: AppLinks.home(),
    isActive: (pathname: string) => pathname === '/' || pathname.startsWith('/auctions'),
  },
] as const;

export const Header = () => {
  const { isOpen, toggle } = useMobileMenu();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-header text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:h-20 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Открыть меню"
          aria-expanded={isOpen}
          onClick={toggle}
        >
          <Icon name="common:menu" className="text-xl" />
        </Button>

        <Link
          to={AppLinks.home()}
          search={auctionsListSearchDefaults}
          className="flex shrink-0 items-center gap-2"
        >
          <img
            src="/images/logo/logo-black.png"
            alt="Умная логистика"
            className="max-h-12 invert"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex ml-auto" aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => {
            const isActive = item.isActive(pathname);

            return (
              <Button variant={isActive ? 'secondary' : 'soft'} asChild key={item.to}>
                <Link to={item.to} search={auctionsListSearchDefaults}>
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
