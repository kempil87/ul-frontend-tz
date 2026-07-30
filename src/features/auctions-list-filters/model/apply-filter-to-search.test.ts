import { describe, expect, it } from 'vitest';

import {
  applyFilterToSearch,
  isEmptyFilterValue,
} from '@/features/auctions-list-filters/model/apply-filter-to-search';

describe('applyFilterToSearch', () => {
  it('Сохраняет boolean false в search', () => {
    expect(applyFilterToSearch({ page: 3 }, 'is_available', false)).toEqual({
      page: 1,
      is_available: false,
    });
  });

  it('Сохраняет 0 для числовых фильтров', () => {
    expect(applyFilterToSearch({ page: 2 }, 'current_price_from', 0)).toEqual({
      page: 1,
      current_price_from: 0,
    });
  });

  it('Удаляет пустые значения', () => {
    expect(
      applyFilterToSearch({ page: 2, cargo_num: 'CARGO-1', is_bidder: false }, 'cargo_num', ''),
    ).toEqual({ page: 1, is_bidder: false });

    expect(applyFilterToSearch({ page: 1, auc_type: ['Down'] }, 'auc_type', [])).toEqual({
      page: 1,
    });

    expect(
      applyFilterToSearch({ page: 1, is_available: false }, 'is_available', undefined),
    ).toEqual({ page: 1 });
  });
});

describe('isEmptyFilterValue', () => {
  it('Считает пустыми только nullish, пустую строку и пустой массив', () => {
    expect(isEmptyFilterValue(undefined)).toBe(true);
    expect(isEmptyFilterValue(null)).toBe(true);
    expect(isEmptyFilterValue('')).toBe(true);
    expect(isEmptyFilterValue([])).toBe(true);
    expect(isEmptyFilterValue(false)).toBe(false);
    expect(isEmptyFilterValue(0)).toBe(false);
    expect(isEmptyFilterValue('x')).toBe(false);
  });
});
