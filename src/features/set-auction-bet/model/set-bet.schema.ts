import { z } from 'zod';

type CreateSetBetSchemaParams = {
  min?: number | null;
  max?: number | null;
  step?: number | null;
};

export const createSetBetSchema = ({ min, max, step }: CreateSetBetSchemaParams = {}) => {
  return z.object({
    price: z
      .union([z.string(), z.number()])
      .transform((value, ctx) => {
        if (value === '' || value == null) {
          ctx.addIssue({ code: 'custom', message: 'Укажите цену' });
          return z.NEVER;
        }

        const parsed = typeof value === 'number' ? value : Number(value);

        if (Number.isNaN(parsed)) {
          ctx.addIssue({ code: 'custom', message: 'Укажите цену' });
          return z.NEVER;
        }

        return parsed;
      })
      .refine((value) => value > 0, 'Цена должна быть больше 0')
      .refine((value) => min == null || value >= min, {
        message: min != null ? `Минимальная цена: ${min}` : undefined,
      })
      .refine((value) => max == null || value <= max, {
        message: max != null ? `Максимальная цена: ${max}` : undefined,
      })
      .refine(
        (value) => {
          if (step == null || step <= 0 || min == null) return true;
          return Math.abs(Math.round((value - min) / step) * step + min - value) < 0.001;
        },
        { message: step != null ? `Шаг ставки: ${step}` : undefined },
      ),
  });
};

export type SetBetFormSchema = ReturnType<typeof createSetBetSchema>;
export type SetBetFormInput = z.input<SetBetFormSchema>;
export type SetBetFormValues = z.output<SetBetFormSchema>;
