import { describe, expect, it } from 'vitest';

import { createSetBetSchema } from '@/features/set-auction-bet/model/set-bet.schema';

describe('Валидация схемы ставки', () => {
  it('Требует цену больше 0', () => {
    const schema = createSetBetSchema();

    expect(schema.safeParse({ price: '' }).success).toBe(false);
    expect(schema.safeParse({ price: '0' }).success).toBe(false);
    expect(schema.safeParse({ price: '-10' }).success).toBe(false);
    expect(schema.safeParse({ price: '1500' })).toEqual({
      success: true,
      data: { price: 1500 },
    });
  });

  it('Проверяет min и max, если они заданы', () => {
    const schema = createSetBetSchema({ min: 1000, max: 2000 });

    expect(schema.safeParse({ price: '999' }).success).toBe(false);
    expect(schema.safeParse({ price: '2001' }).success).toBe(false);
    expect(schema.safeParse({ price: '1500' }).success).toBe(true);
  });

  it('Проверяет шаг относительно min', () => {
    const schema = createSetBetSchema({ min: 1000, max: 2000, step: 100 });

    expect(schema.safeParse({ price: '1050' }).success).toBe(false);
    expect(schema.safeParse({ price: '1100' }).success).toBe(true);
  });

  it('Не проверяет шаг, если нет min или step', () => {
    expect(createSetBetSchema({ step: 100 }).safeParse({ price: '1050' }).success).toBe(true);
    expect(createSetBetSchema({ min: 1000 }).safeParse({ price: '1050' }).success).toBe(true);
  });
});
