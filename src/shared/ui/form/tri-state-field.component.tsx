import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { cn } from '@/shared/lib/cn';
import { controlVariants, popoverContentVariants } from '@/shared/ui/form/form-control.styles';
import { FormField } from '@/shared/ui/form/form-field.component';

type TriStateFieldProps = {
  name: string;
  label?: string;
  hint?: string;
  className?: string;
  labels?: {
    any?: string;
    true?: string;
    false?: string;
  };
  onChange?: (name: string, value: boolean | undefined) => void;
};

const DEFAULT_LABELS = {
  any: 'Все',
  true: 'Да',
  false: 'Нет',
} as const;

export const TriStateField = ({
  name,
  label,
  hint,
  className,
  labels: labelsProp,
  onChange,
}: TriStateFieldProps) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const labels = { ...DEFAULT_LABELS, ...labelsProp };

  const options: Array<{ value: boolean | undefined; label: string }> = [
    { value: undefined, label: labels.any },
    { value: true, label: labels.true },
    { value: false, label: labels.false },
  ];

  return (
    <FormField name={name} label={label} hint={hint} className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const current = options.find((option) => option.value === field.value) ?? options[0];

          return (
            <Popover.Root modal open={open} onOpenChange={setOpen}>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  id={name}
                  className={cn(
                    controlVariants({ invalid: fieldState.invalid }),
                    'flex items-center justify-between gap-2 text-left',
                    field.value === undefined && 'text-muted',
                  )}
                >
                  <span className="truncate">{current.label}</span>
                  <span className="text-muted">▾</span>
                </button>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  align="start"
                  sideOffset={6}
                  className={cn(
                    popoverContentVariants(),
                    'w-[var(--radix-popover-trigger-width)] min-w-40',
                  )}
                >
                  <ul className="space-y-0.5">
                    {options.map((option) => (
                      <li key={String(option.value)}>
                        <button
                          type="button"
                          className={cn(
                            'flex w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-raised-hover',
                            option.value === field.value && 'bg-nav-active',
                          )}
                          onClick={() => {
                            field.onChange(option.value);
                            onChange?.(name, option.value);
                            setOpen(false);
                          }}
                        >
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          );
        }}
      />
    </FormField>
  );
};
