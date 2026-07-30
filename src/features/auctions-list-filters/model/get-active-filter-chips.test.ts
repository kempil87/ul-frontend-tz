import { describe, expect, it } from 'vitest';

import { getActiveFilterChips } from '@/features/auctions-list-filters/model/get-active-filter-chips';
import type { AuctionsListSearch } from '@/features/auctions-list-filters/model/auctions-list-search.schema';

describe('Маппер активных фильтров в чипы', () => {
  it('Мапит активные фильтры в чипы с подписями', () => {
    const chips = getActiveFilterChips({
      load_city: 'Москва',
      unload_city: 'Казань',
      auc_type: ['Down'],
      status: ['Losing'],
      statuses: ['Auction'],
      load_date_from: '2026-08-01',
      is_available: true,
      is_bidder: false,
      current_price_from: 1000,
      current_price_to: 5000,
    });

    expect(chips.map((chip) => chip.id)).toEqual([
      'load_city',
      'unload_city',
      'auc_type:Down',
      'status:Losing',
      'statuses:Auction',
      'load_date_from',
      'is_available',
      'is_bidder',
      'current_price_from',
      'current_price_to',
    ]);

    expect(chips.find((chip) => chip.id === 'auc_type:Down')?.label).toBe('На понижение');
    expect(chips.find((chip) => chip.id === 'status:Losing')?.label).toBe('Перебит');
    expect(chips.find((chip) => chip.id === 'is_available')?.label).toBe('Доступен для ставки');
  });

  it('Clear-хелперы сбрасывают ключ фильтра и page', () => {
    const chips = getActiveFilterChips({
      load_city: 'Москва',
      auc_type: ['Down', 'Up'],
    });

    const prev: AuctionsListSearch = {
      page: 3,
      load_city: 'Москва',
      auc_type: ['Down', 'Up'],
      cargo_num: 'CARGO-1',
    };

    expect(chips.find((chip) => chip.id === 'load_city')?.clear(prev)).toEqual({
      page: 1,
      auc_type: ['Down', 'Up'],
      cargo_num: 'CARGO-1',
    });

    expect(chips.find((chip) => chip.id === 'auc_type:Down')?.clear(prev)).toEqual({
      page: 1,
      load_city: 'Москва',
      auc_type: ['Up'],
      cargo_num: 'CARGO-1',
    });
  });

  it('Возвращает пустой список, если расширенных фильтров нет', () => {
    expect(getActiveFilterChips({})).toEqual([]);
  });
});
