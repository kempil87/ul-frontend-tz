import { describe, expect, it } from 'vitest';

import {
  auctionsListSearchDefaults,
  parseAuctionsListSearch,
} from '@/features/auctions-list-filters/model/auctions-list-search.schema';

describe('Парсинг search params списка аукционов', () => {
  it('Возвращает дефолты для пустого или невалидного search', () => {
    expect(parseAuctionsListSearch({})).toEqual(auctionsListSearchDefaults);
    expect(parseAuctionsListSearch(null)).toEqual(auctionsListSearchDefaults);
    expect(parseAuctionsListSearch({ page: 'abc' })).toEqual({ page: 1 });
  });

  it('Парсит page и приводит невалидный page к 1', () => {
    expect(parseAuctionsListSearch({ page: '3' }).page).toBe(3);
    expect(parseAuctionsListSearch({ page: 0 }).page).toBe(1);
    expect(parseAuctionsListSearch({ page: -2 }).page).toBe(1);
  });

  it('Парсит строковые фильтры и отбрасывает пустые значения', () => {
    expect(
      parseAuctionsListSearch({
        cargo_num: '  CARGO-1  ',
        load_city: '',
        unload_city: 'Казань',
      }),
    ).toEqual({
      page: 1,
      cargo_num: 'CARGO-1',
      unload_city: 'Казань',
    });
  });

  it('Парсит enum-массивы из строк через запятую и отфильтровывает неизвестные', () => {
    expect(
      parseAuctionsListSearch({
        auc_type: 'Down,Up,Nope',
        status: ['Leading', 'Fake'],
        statuses: 'Auction,Finished',
      }),
    ).toEqual({
      page: 1,
      auc_type: ['Down', 'Up'],
      status: ['Leading'],
      statuses: ['Auction', 'Finished'],
    });
  });

  it('Парсит boolean, даты и неотрицательные цены с безопасными fallback', () => {
    expect(
      parseAuctionsListSearch({
        is_available: 'true',
        is_bidder: 'false',
        load_date_from: '2026-08-01',
        load_date_to: '01.08.2026',
        current_price_from: '1000',
        current_price_to: '-5',
      }),
    ).toEqual({
      page: 1,
      is_available: true,
      is_bidder: false,
      load_date_from: '2026-08-01',
      current_price_from: 1000,
    });
  });
});
