import * as Checkbox from '@radix-ui/react-checkbox';
import * as Popover from '@radix-ui/react-popover';
import { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { cn } from '@/shared/lib/cn';
import { controlVariants, popoverContentVariants } from '@/shared/ui/form/form-control.styles';
import { FormField } from '@/shared/ui/form/form-field.component';
import { Icon } from '../icon/icon.component';

export type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxFieldBaseProps = {
  name: string;
  label?: string;
  hint?: string;
  placeholder?: string;
  options: ComboboxOption[];
  className?: string;
  searchable?: boolean;
  clearable?: boolean;
  onChange?: (name: string, value: string | string[] | undefined) => void;
};

type ComboboxFieldProps =
  (ComboboxFieldBaseProps & { multiple?: false }) | (ComboboxFieldBaseProps & { multiple: true });

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (typeof value === 'string' && value) return [value];
  return [];
};

export const ComboboxField = ({
  name,
  label,
  hint,
  placeholder = 'Выберите…',
  options,
  className,
  searchable = true,
  clearable = true,
  multiple = false,
  onChange,
}: ComboboxFieldProps) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [options, query]);

  return (
    <FormField name={name} label={label} hint={hint} className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const selected = toArray(field.value);
          const selectedLabels = options
            .filter((option) => selected.includes(option.value))
            .map((option) => option.label);

          const display =
            selectedLabels.length === 0
              ? placeholder
              : multiple
                ? selectedLabels.join(', ')
                : selectedLabels[0];

          const toggle = (value: string) => {
            if (multiple) {
              const next = selected.includes(value)
                ? selected.filter((item) => item !== value)
                : [...selected, value];
              const nextValue = next.length > 0 ? next : undefined;
              field.onChange(nextValue);
              onChange?.(name, nextValue);
              return;
            }

            const nextValue = selected[0] === value ? undefined : value;
            field.onChange(nextValue);
            onChange?.(name, nextValue);
            setOpen(false);
          };

          return (
            <Popover.Root
              modal
              open={open}
              onOpenChange={(next) => {
                setOpen(next);
                if (!next) setQuery('');
              }}
            >
              <Popover.Trigger asChild>
                <button
                  type="button"
                  id={name}
                  className={cn(
                    controlVariants({ invalid: fieldState.invalid }),
                    'flex items-center justify-between gap-2 text-left',
                    selectedLabels.length === 0 && 'text-muted',
                  )}
                >
                  <span className="truncate">{display}</span>
                  <span className="text-muted">▾</span>
                </button>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  align="start"
                  sideOffset={6}
                  className={cn(
                    popoverContentVariants(),
                    'w-[var(--radix-popover-trigger-width)] min-w-56',
                  )}
                >
                  {searchable && (
                    <input
                      autoFocus
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Поиск…"
                      className={cn(controlVariants({ size: 'sm' }), 'mb-2')}
                    />
                  )}

                  <ul className="max-h-56 space-y-0.5 overflow-auto">
                    {filteredOptions.length === 0 && (
                      <li className="px-2 py-1.5 text-xs text-muted">Ничего не найдено</li>
                    )}

                    {filteredOptions.map((option) => {
                      const checked = selected.includes(option.value);

                      return (
                        <li key={option.value}>
                          <button
                            type="button"
                            className={cn(
                              'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm',
                              'hover:bg-raised-hover',
                              checked && 'bg-nav-active',
                            )}
                            onClick={() => toggle(option.value)}
                          >
                            {multiple && (
                              <Checkbox.Root
                                checked={checked}
                                className="flex size-4 shrink-0 items-center justify-center rounded border border-border bg-app"
                                tabIndex={-1}
                              >
                                <Checkbox.Indicator className="text-[10px] text-accent">
                                  <Icon name="common:check" className="size-4" />
                                </Checkbox.Indicator>
                              </Checkbox.Root>
                            )}
                            <span className="truncate">{option.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {clearable && selected.length > 0 && (
                    <button
                      type="button"
                      className="mt-2 w-full rounded-md px-2 py-1.5 text-left text-xs text-muted hover:bg-raised-hover hover:text-text"
                      onClick={() => {
                        field.onChange(undefined);
                        onChange?.(name, undefined);
                        if (!multiple) setOpen(false);
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
