import type { components } from '@/shared/api/types';

export type Schema = components['schemas'];

export type AuctionListItem = Schema['AuctionListItem'];
export type AuctionListRequest = Schema['AuctionListRequest'];
export type AuctionListResponse = Schema['AuctionListResponseBase'];
export type AuctionListMeta = Schema['AuctionListMeta'];

export type AuctionShowResponse = Schema['AuctionShowResponse'];
export type AuctionShowTrading = Schema['AuctionShowTrading'];

export type BetItem = Schema['BetItem'];
export type BetListResponse = Schema['BetListResponse'];
export type SetBetRequest = Schema['SetBetRequest'];

export type AuctionType = Schema['AuctionType'];
export type AuctionStatus = Schema['AuctionStatus'];
export type TradingStatus = Schema['TradingStatus'];

export type ProblemDetail = Schema['ProblemDetail'];
export type ValidationProblem = Schema['ValidationProblem'];

export type AuctionUuid = string;
