export { auctionsApi } from '@/shared/api/auctions/auctions.api';
export { citiesApi } from '@/shared/api/cities/cities.api';
export type {
  AuctionListItem,
  AuctionListRequest,
  AuctionListResponse,
  AuctionShowResponse,
  AuctionStatus,
  AuctionType,
  BetItem,
  BetListResponse,
  SetBetRequest,
  TradingStatus,
} from '@/shared/api/contracts/auctions';
export type { CitiesListResponse } from '@/shared/api/contracts/cities';
export { apiClient } from '@/shared/api/http/api-client';
export { ApiError, toApiError } from '@/shared/api/http/api-error';
