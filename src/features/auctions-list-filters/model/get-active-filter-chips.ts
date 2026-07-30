import {
  AUCTION_STATUS_LABEL,
  AUCTION_TYPE_LABEL,
  TRADING_STATUS_LABEL,
} from '@/features/auctions-list-filters/model/auctions-list-filters.constants';
import type { AuctionsListFiltersFormValues } from '@/features/auctions-list-filters/model/auctions-list-filters-form.schema';
import type { AuctionsListSearch } from '@/features/auctions-list-filters/model/auctions-list-search.schema';

export type ActiveFilterChip = {
  id: string;
  label: string;
  clear: (prev: AuctionsListSearch) => AuctionsListSearch;
};

const clearKey =
  (key: keyof AuctionsListSearch) =>
  (prev: AuctionsListSearch): AuctionsListSearch => {
    const next = { ...prev, page: 1 };
    delete next[key];
    return next;
  };

const clearArrayItem =
  <T extends string>(key: 'auc_type' | 'status' | 'statuses', value: T) =>
  (prev: AuctionsListSearch): AuctionsListSearch => {
    const next = { ...prev, page: 1 };
    const remaining = (prev[key] as T[] | undefined)?.filter((item) => item !== value);

    if (remaining?.length) {
      next[key] = remaining as never;
    } else {
      delete next[key];
    }

    return next;
  };

/** Active advanced filters as removable chips (cargo_num lives in the search bar). */
export const getActiveFilterChips = (
  filters: AuctionsListFiltersFormValues,
): ActiveFilterChip[] => {
  const chips: ActiveFilterChip[] = [];

  if (filters.load_city) {
    chips.push({
      id: 'load_city',
      label: `Погрузка: ${filters.load_city}`,
      clear: clearKey('load_city'),
    });
  }

  if (filters.unload_city) {
    chips.push({
      id: 'unload_city',
      label: `Выгрузка: ${filters.unload_city}`,
      clear: clearKey('unload_city'),
    });
  }

  filters.auc_type?.forEach((type) => {
    chips.push({
      id: `auc_type:${type}`,
      label: AUCTION_TYPE_LABEL[type] ?? type,
      clear: clearArrayItem('auc_type', type),
    });
  });

  filters.status?.forEach((status) => {
    chips.push({
      id: `status:${status}`,
      label: TRADING_STATUS_LABEL[status] ?? status,
      clear: clearArrayItem('status', status),
    });
  });

  filters.statuses?.forEach((status) => {
    chips.push({
      id: `statuses:${status}`,
      label: AUCTION_STATUS_LABEL[status] ?? status,
      clear: clearArrayItem('statuses', status),
    });
  });

  if (filters.load_date_from) {
    chips.push({
      id: 'load_date_from',
      label: `Погрузка от ${filters.load_date_from}`,
      clear: clearKey('load_date_from'),
    });
  }

  if (filters.load_date_to) {
    chips.push({
      id: 'load_date_to',
      label: `Погрузка до ${filters.load_date_to}`,
      clear: clearKey('load_date_to'),
    });
  }

  if (filters.is_available != null) {
    chips.push({
      id: 'is_available',
      label: filters.is_available ? 'Доступен для ставки' : 'Недоступен для ставки',
      clear: clearKey('is_available'),
    });
  }

  if (filters.is_bidder != null) {
    chips.push({
      id: 'is_bidder',
      label: filters.is_bidder ? 'Участвую' : 'Не участвую',
      clear: clearKey('is_bidder'),
    });
  }

  if (filters.current_price_from != null) {
    chips.push({
      id: 'current_price_from',
      label: `Цена от ${filters.current_price_from}`,
      clear: clearKey('current_price_from'),
    });
  }

  if (filters.current_price_to != null) {
    chips.push({
      id: 'current_price_to',
      label: `Цена до ${filters.current_price_to}`,
      clear: clearKey('current_price_to'),
    });
  }

  return chips;
};
