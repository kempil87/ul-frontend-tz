import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, type ComponentProps } from 'react';
import { useForm } from 'react-hook-form';

import { useSetAuctionBetMutation } from '@/features/set-auction-bet/api/use-set-auction-bet.mutation';
import {
  createSetBetSchema,
  type SetBetFormInput,
  type SetBetFormValues,
} from '@/features/set-auction-bet/model/set-bet.schema';
import { priceService } from '@/shared/lib/price';
import { Button } from '@/shared/ui/button';
import { Form, TextField } from '@/shared/ui/form';
import { cn } from 'tailwind-variants';

type SetAuctionBetFormProps = {
  auctionUuid: string;
  available?: number | null;
  min?: number | null;
  max?: number | null;
  step?: number | null;
  disabled?: boolean;
  className?: string;
};

const toDefaultPrice = (available?: number | null, min?: number | null): string => {
  const value = available ?? min;
  return value == null ? '' : String(value);
};

export const SetAuctionBetForm = ({
  auctionUuid,
  available,
  min,
  max,
  step,
  disabled = false,
  className,
}: SetAuctionBetFormProps) => {
  const schema = useMemo(() => createSetBetSchema({ min, max, step }), [min, max, step]);
  const mutation = useSetAuctionBetMutation();

  const form = useForm<SetBetFormInput, unknown, SetBetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: toDefaultPrice(available, min),
    },
  });

  const onSubmit = form.handleSubmit(({ price }) => {
    mutation.mutate({ auctionUuid, price });
  });

  const hints = [
    available != null ? `Доступно: ${priceService.format(available)}` : null,
    step != null ? `Шаг: ${priceService.format(step)}` : null,
    min != null || max != null
      ? `Диапазон: ${priceService.format(min)} – ${priceService.format(max)}`
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const additionalFieldProps = useMemo(() => {
    const result: Partial<ComponentProps<typeof TextField>> = {};

    if (hints.length > 0) {
      result.hint = hints;
    }
    if (step != null) {
      result.step = step;
    }
    if (min != null) {
      result.min = min;
    }
    if (max != null) {
      result.max = max;
    }

    return result;
  }, [step, min, max, hints]);

  useEffect(() => {
    form.reset({ price: toDefaultPrice(available, min) });
  }, [available, min, form]);

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className={cn('flex flex-col gap-3 sm:flex-row sm:items-center', className)}
    >
      <TextField
        name="price"
        label="Цена ставки"
        type="number"
        disabled={disabled || mutation.isPending}
        className="min-w-0 flex-1"
        {...additionalFieldProps}
      />

      <Button
        type="submit"
        variant="primary"
        isLoading={mutation.isPending}
        disabled={disabled}
        className="shrink-0 sm:min-w-44"
      >
        Сделать ставку
      </Button>
    </Form>
  );
};
