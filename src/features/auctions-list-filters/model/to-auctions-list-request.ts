import { AUCTION_STATUS_CODE } from '@/features/auctions-list-filters/model/auctions-list-filters.constants';
import type { AuctionsListSearch } from '@/features/auctions-list-filters/model/auctions-list-search.schema';
import type { AuctionListRequest } from '@/shared/api/contracts/auctions';

const DEFAULT_PER_PAGE = 5;

const toDayStart = (date: string) => `${date}T00:00:00`;
const toDayEnd = (date: string) => `${date}T23:59:59`;

export const toAuctionsListRequest = (search: AuctionsListSearch): AuctionListRequest => {
  const statuses = search.statuses
    ?.map((status) => (status === 'Unknown' ? undefined : AUCTION_STATUS_CODE[status]))
    .filter((code): code is number => typeof code === 'number');

  return {
    page: search.page,
    per_page: DEFAULT_PER_PAGE,
    cargo_num: search.cargo_num,
    status: search.status,
    statuses: statuses?.length ? statuses : undefined,
    auc_type: search.auc_type,
    load_city: search.load_city,
    unload_city: search.unload_city,
    load_date_from: search.load_date_from ? toDayStart(search.load_date_from) : undefined,
    load_date_to: search.load_date_to ? toDayEnd(search.load_date_to) : undefined,
    is_available: search.is_available,
    is_bidder: search.is_bidder,
    current_price_from: search.current_price_from,
    current_price_to: search.current_price_to,
  };
};
