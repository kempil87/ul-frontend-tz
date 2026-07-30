import { RoutePaths } from '@/app/links';
import { parseAuctionsListSearch } from '@/features/auctions-list-filters';
import { PageLoader } from '@/shared/ui/page-loader';
import { AppLayout } from '@/widgets/layout';
import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const auctionsListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: RoutePaths.home,
  validateSearch: parseAuctionsListSearch,
  component: lazyRouteComponent(
    () => import('@/pages/auctions-list-page/auctions-list-page'),
    'AuctionsListPage',
  ),
});

const auctionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: RoutePaths.auctionDetail,
  component: lazyRouteComponent(
    () => import('@/pages/auction-detail-page/auction-detail-page'),
    'AuctionDetailPage',
  ),
});

const auctionBetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: RoutePaths.auctionBet,
  component: lazyRouteComponent(
    () => import('@/pages/auction-set-bet-page/auction-set-bet-page'),
    'AuctionSetBetPage',
  ),
});

const routeTree = rootRoute.addChildren([auctionsListRoute, auctionDetailRoute, auctionBetRoute]);

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
  defaultPendingComponent: PageLoader,
  defaultPendingMs: 200,
  defaultPendingMinMs: 300,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
