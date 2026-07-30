import type { AuctionsListSearch } from '@/features/auctions-list-filters/model/auctions-list-search.schema';

export const isEmptyFilterValue = (value: unknown): boolean =>
  value == null || value === '' || (Array.isArray(value) && value.length === 0);

export const applyFilterToSearch = (
  prev: AuctionsListSearch,
  name: keyof AuctionsListSearch,
  value: unknown,
): AuctionsListSearch => {
  const result: AuctionsListSearch = { ...prev, page: 1 };

  if (isEmptyFilterValue(value)) {
    delete result[name];
  } else {
    result[name] = value as never;
  }

  return result;
};
