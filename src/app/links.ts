export const RoutePaths = {
  home: '/',
  auctionDetail: '/auctions/$auctionUuid',
  auctionBet: '/auctions/$auctionUuid/bet',
} as const;

export const AppLinks = {
  home: () => RoutePaths.home,
  auctionDetail: (auctionUuid: string) => `/auctions/${auctionUuid}`,
  auctionBet: (auctionUuid: string) => `/auctions/${auctionUuid}/bet`,
} as const;
