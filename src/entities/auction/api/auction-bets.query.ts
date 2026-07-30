import { queryOptions, useQuery } from '@tanstack/react-query';

import { auctionsQueryKeys } from '@/entities/auction/api/auctions.query-keys';
import { auctionsApi } from '@/shared/api';

export const auctionBetsQueryOptions = (auctionUuid: string, all?: boolean | null) =>
  queryOptions({
    queryKey: auctionsQueryKeys.bets(auctionUuid, all),
    queryFn: () => auctionsApi.bets(auctionUuid, { all }),
    enabled: Boolean(auctionUuid),
  });

export const useAuctionBetsQuery = (
  auctionUuid: string,
  options?: { all?: boolean | null; enabled?: boolean },
) => {
  const { data, ...query } = useQuery({
    ...auctionBetsQueryOptions(auctionUuid, options?.all),
    enabled: Boolean(auctionUuid) && (options?.enabled ?? true),
  });

  return {
    bets: data?.bets ?? [],
    ...query,
  };
};
