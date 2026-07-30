import { describe, expect, it } from 'vitest';

import type { AuctionsListSearch } from '@/features/auctions-list-filters/model/auctions-list-search.schema';
import { toAuctionsListRequest } from '@/features/auctions-list-filters/model/to-auctions-list-request';

describe('Сборка запроса списка аукционов', () => {
  it('Мапит search в request с дефолтным per_page', () => {
    const search: AuctionsListSearch = {
      page: 2,
      cargo_num: 'CARGO-1001',
      load_city: 'Москва',
      unload_city: 'Казань',
      is_available: true,
      is_bidder: false,
      current_price_from: 1000,
      current_price_to: 5000,
      auc_type: ['Down'],
      status: ['Losing'],
    };

    expect(toAuctionsListRequest(search)).toEqual({
      page: 2,
      per_page: 20,
      cargo_num: 'CARGO-1001',
      load_city: 'Москва',
      unload_city: 'Казань',
      is_available: true,
      is_bidder: false,
      current_price_from: 1000,
      current_price_to: 5000,
      auc_type: ['Down'],
      status: ['Losing'],
      statuses: undefined,
      load_date_from: undefined,
      load_date_to: undefined,
    });
  });

  it('Конвертирует статусы аукциона в коды API и отбрасывает Unknown', () => {
    expect(
      toAuctionsListRequest({
        page: 1,
        statuses: ['Planning', 'Auction', 'Unknown'],
      }).statuses,
    ).toEqual([1, 2]);
  });

  it('Разворачивает даты погрузки в начало и конец дня', () => {
    expect(
      toAuctionsListRequest({
        page: 1,
        load_date_from: '2026-08-01',
        load_date_to: '2026-08-03',
      }),
    ).toMatchObject({
      load_date_from: '2026-08-01T00:00:00',
      load_date_to: '2026-08-03T23:59:59',
    });
  });
});
