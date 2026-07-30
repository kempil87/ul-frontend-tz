import { z } from 'zod';

import {
  AUCTION_STATUSES,
  AUCTION_TYPES,
  TRADING_STATUSES,
} from '@/features/auctions-list-filters/model/auctions-list-filters.constants';
import type { AuctionsListSearch } from '@/features/auctions-list-filters/model/auctions-list-search.schema';

export const auctionsListFiltersFormSchema = z.object({
  cargo_num: z.string().optional(),
  status: z.array(z.enum(TRADING_STATUSES)).optional(),
  statuses: z.array(z.enum(AUCTION_STATUSES)).optional(),
  auc_type: z.array(z.enum(AUCTION_TYPES)).optional(),
  load_city: z.string().optional(),
  unload_city: z.string().optional(),
  load_date_from: z.string().optional(),
  load_date_to: z.string().optional(),
  is_available: z.boolean().optional(),
  is_bidder: z.boolean().optional(),
  current_price_from: z.number().nonnegative().optional(),
  current_price_to: z.number().nonnegative().optional(),
});

export type AuctionsListFiltersFormValues = z.infer<typeof auctionsListFiltersFormSchema>;

export const auctionsListFiltersFormDefaults: AuctionsListFiltersFormValues = {};

export const toFiltersFormValues = (search: AuctionsListSearch): AuctionsListFiltersFormValues => {
  const { page: _page, ...filters } = search;
  return filters;
};

export const toSearchFromFilters = (filters: AuctionsListFiltersFormValues): AuctionsListSearch => {
  return {
    ...filters,
    page: 1,
  };
};

export const countActiveFilters = (filters: AuctionsListFiltersFormValues) => {
  return Object.values(filters).filter((value) => {
    if (value == null || value === '') return false;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }).length;
};
