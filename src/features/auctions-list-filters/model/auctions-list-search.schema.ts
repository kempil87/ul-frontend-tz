import { z } from 'zod';

import {
  AUCTION_STATUSES,
  AUCTION_TYPES,
  TRADING_STATUSES,
} from '@/features/auctions-list-filters/model/auctions-list-filters.constants';

const optionalString = z.preprocess((value) => {
  if (value == null) return undefined;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}, z.string().optional());

const optionalEnumArray = <T extends string>(values: readonly T[]) => {
  const set = new Set<string>(values);

  return z.preprocess(
    (value) => {
      if (value == null || value === '') return undefined;

      const list = Array.isArray(value)
        ? value
        : typeof value === 'string'
          ? value.split(',').map((item) => item.trim())
          : [];

      const filtered = list.filter((item): item is T => typeof item === 'string' && set.has(item));
      return filtered.length > 0 ? filtered : undefined;
    },
    z.array(z.enum(values as [T, ...T[]])).optional(),
  );
};

const optionalBoolean = z.preprocess((value) => {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return undefined;
}, z.boolean().optional());

const optionalDate = z.preprocess((value) => {
  if (value == null || value === '') return undefined;
  if (typeof value !== 'string') return undefined;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}, z.string().optional());

const optionalNonNegativeNumber = z.preprocess((value) => {
  if (value == null || value === '') return undefined;
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number) || number < 0) return undefined;
  return number;
}, z.number().optional());

export const auctionsListSearchSchema = z.object({
  page: z.preprocess((value) => {
    const number = typeof value === 'number' ? value : Number(value);
    if (!Number.isInteger(number) || number < 1) return 1;
    return number;
  }, z.number().int().positive()),

  cargo_num: optionalString,
  status: optionalEnumArray(TRADING_STATUSES),
  statuses: optionalEnumArray(AUCTION_STATUSES),
  auc_type: optionalEnumArray(AUCTION_TYPES),
  load_city: optionalString,
  unload_city: optionalString,
  load_date_from: optionalDate,
  load_date_to: optionalDate,
  is_available: optionalBoolean,
  is_bidder: optionalBoolean,
  current_price_from: optionalNonNegativeNumber,
  current_price_to: optionalNonNegativeNumber,
});

export type AuctionsListSearch = z.infer<typeof auctionsListSearchSchema>;

export const auctionsListSearchDefaults: AuctionsListSearch = {
  page: 1,
};

export const parseAuctionsListSearch = (search: unknown): AuctionsListSearch => {
  const result = auctionsListSearchSchema.safeParse(search);
  return result.success ? result.data : auctionsListSearchDefaults;
};
