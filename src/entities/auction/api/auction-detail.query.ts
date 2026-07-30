import { queryOptions, useQuery } from '@tanstack/react-query';

import { auctionsQueryKeys } from '@/entities/auction/api/auctions.query-keys';
import { auctionsApi } from '@/shared/api';

export const auctionDetailQueryOptions = (auctionUuid: string) =>
  queryOptions({
    queryKey: auctionsQueryKeys.detail(auctionUuid),
    queryFn: () => auctionsApi.detail(auctionUuid),
    enabled: Boolean(auctionUuid),
  });

export const useAuctionDetailQuery = (auctionUuid: string) => {
  const { data, ...query } = useQuery(auctionDetailQueryOptions(auctionUuid));

  return {
    auction: data ?? null,
    ...query,
  };
};
