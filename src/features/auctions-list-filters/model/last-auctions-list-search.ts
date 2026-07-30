import {
  type AuctionsListSearch,
  auctionsListSearchDefaults,
} from '@/features/auctions-list-filters/model/auctions-list-search.schema';

let lastSearch: AuctionsListSearch = auctionsListSearchDefaults;

export const rememberAuctionsListSearch = (search: AuctionsListSearch) => {
  lastSearch = search;
};

export const getLastAuctionsListSearch = (): AuctionsListSearch => lastSearch;
