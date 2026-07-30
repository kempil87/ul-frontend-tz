import type { AuctionListRequest } from '@/shared/api/contracts/auctions';

export const auctionsQueryKeys = {
  all: ['auctions'] as const,
  lists: () => [...auctionsQueryKeys.all, 'list'] as const,
  list: (params: AuctionListRequest = {}) => [...auctionsQueryKeys.lists(), params] as const,
  details: () => [...auctionsQueryKeys.all, 'detail'] as const,
  detail: (auctionUuid: string) => [...auctionsQueryKeys.details(), auctionUuid] as const,
  bets: (auctionUuid: string, all?: boolean | null) =>
    [...auctionsQueryKeys.all, 'bets', auctionUuid, { all }] as const,
};
