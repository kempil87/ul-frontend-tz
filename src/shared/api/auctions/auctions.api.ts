import type {
  AuctionListRequest,
  AuctionListResponse,
  AuctionShowResponse,
  AuctionUuid,
  BetListResponse,
  SetBetRequest,
} from '@/shared/api/contracts/auctions';
import { apiClient } from '@/shared/api/http/api-client';

export const auctionsApi = {
  list: async (body: AuctionListRequest = {}, options?: { signal?: AbortSignal }) => {
    const { data } = await apiClient.post<AuctionListResponse>('/auctions/list', body, {
      signal: options?.signal,
    });
    return data;
  },

  detail: async (auctionUuid: AuctionUuid) => {
    const { data } = await apiClient.get<AuctionShowResponse>(`/auctions/${auctionUuid}`);
    return data;
  },

  bets: async (auctionUuid: AuctionUuid, params?: { all?: boolean | null }) => {
    const { data } = await apiClient.get<BetListResponse>(`/auctions/${auctionUuid}/bets`, {
      params,
    });
    return data;
  },

  setBet: async (auctionUuid: AuctionUuid, body: SetBetRequest) => {
    await apiClient.post(`/auctions/${auctionUuid}/bets`, body);
  },
};
