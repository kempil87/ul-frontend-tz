import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { auctionsQueryKeys } from '@/entities/auction/api/auctions.query-keys';
import { auctionsApi } from '@/shared/api';
import type { AuctionListRequest } from '@/shared/api/contracts/auctions';

export const useAuctionsListQuery = (params: AuctionListRequest = {}) => {
  const { data, ...query } = useQuery({
    queryKey: auctionsQueryKeys.list(params),
    queryFn: ({ signal }) => auctionsApi.list(params, { signal }),
    placeholderData: keepPreviousData,
  });

  return {
    auctions: data?.data ?? [],
    meta: data?.meta,
    total: data?.meta?.total ?? 0,
    currentPage: data?.meta?.current_page ?? params.page ?? 1,
    lastPage: data?.meta?.last_page ?? 1,
    ...query,
  };
};
