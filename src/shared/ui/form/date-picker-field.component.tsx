import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { ru } from 'react-day-picker/locale';
import { Controller, useFormContext } from 'react-hook-form';

import { cn } from '@/shared/lib/cn';
import { dateService, Granularity } from '@/shared/lib/date';
import { controlVariants, popoverContentVariants } from '@/shared/ui/form/form-control.styles';
import { FormField } from '@/shared/ui/form/form-field.component';

import 'react-day-picker/style.css';

type DatePickerFieldProps = {
  name: string;
  label?: string;
  hint?: string;
  placeholder?: string;
  className?: string;
  clearable?: boolean;
  onChange?: (name: string, value: string | undefined) => void;
};

const parseDate = (value: unknown): Date | undefined => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;

  const date = dateService.parse(value);
  return date.isValid() ? date.toDate() : undefined;
};

const toDateValue = (date: Date | undefined) =>
  date ? dateService.format(date, Granularity.DATE_VALUE) : undefined;

export const DatePickerField = ({
  name,
  label,
  hint,
  placeholder = 'Выберите дату',
  className,
  clearable = true,
  onChange,
}: DatePickerFieldProps) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormField name={name} label={label} hint={hint} className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const selected = parseDate(field.value);

          const handleSelect = (date: Date | undefined) => {
            const currentValue = toDateValue(date);

            field.onChange(currentValue);
            onChange?.(name, currentValue);
            setOpen(false);
          };

          return (
            <Popover.Root open={open} onOpenChange={setOpen}>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  id={name}
                  className={cn(
                    controlVariants({ invalid: fieldState.invalid }),
                    'flex items-center justify-between gap-2 text-left',
                    !selected && 'text-muted',
                  )}
                >
                  <span className="truncate">
                    {selected
                      ? dateService.format(selected, Granularity.DATE_DISPLAY)
                      : placeholder}
                  </span>
                  <span className="text-muted">▾</span>
                </button>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  align="start"
                  sideOffset={6}
                  className={cn(popoverContentVariants(), 'p-3')}
                >
                  <DayPicker
                    mode="single"
                    locale={ru}
                    selected={selected}
                    onSelect={handleSelect}
                    className="rdp-root text-text"
                  />

                  {clearable && field.value && (
                    <button
                      type="button"
                      className="mt-2 w-full rounded-md px-2 py-1.5 text-left text-xs text-muted hover:bg-raised-hover hover:text-text"
                      onClick={() => {
                        field.onChange(undefined);
                        onChange?.(name, undefined);
                        setOpen(false);
                      }}
                    >
                      Очистить
                    </button>
                  )}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          );
        }}
      />
    </FormField>
  );
};
