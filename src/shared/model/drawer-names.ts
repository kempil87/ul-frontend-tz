export const DrawerNames = {
  auctionsFilters: 'auctions-filters',
} as const;

export type DrawerName = (typeof DrawerNames)[keyof typeof DrawerNames];
