import * as Slider from '@radix-ui/react-slider';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/shared/lib/cn';
import { controlVariants } from '@/shared/ui/form/form-control.styles';
import { FormField } from '@/shared/ui/form/form-field.component';

type RangeInputFieldProps = {
  fromName: string;
  toName: string;
  label?: string;
  hint?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (name: string, value: number | undefined) => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const RangeInputField = ({
  fromName,
  toName,
  label,
  hint,
  className,
  min = 0,
  max = 500_000,
  step = 1000,
  onChange,
}: RangeInputFieldProps) => {
  const { watch } = useFormContext();
  const fromValue = watch(fromName);
  const toValue = watch(toName);

  const committedFrom = typeof fromValue === 'number' ? fromValue : min;
  const committedTo = typeof toValue === 'number' ? toValue : max;

  const [from, setFrom] = useState(committedFrom);
  const [to, setTo] = useState(committedTo);
  const [prevCommitted, setPrevCommitted] = useState({
    from: committedFrom,
    to: committedTo,
  });

  if (prevCommitted.from !== committedFrom || prevCommitted.to !== committedTo) {
    setPrevCommitted({ from: committedFrom, to: committedTo });
    setFrom(committedFrom);
    setTo(committedTo);
  }

  const commitFrom = (value: number | undefined) => {
    const next = value == null || Number.isNaN(value) ? min : clamp(value, min, max);
    const normalized = Math.min(next, to);
    setFrom(normalized);
    onChange?.(fromName, normalized === min ? undefined : normalized);
  };

  const commitTo = (value: number | undefined) => {
    const next = value == null || Number.isNaN(value) ? max : clamp(value, min, max);
    const normalized = Math.max(next, from);
    setTo(normalized);
    onChange?.(toName, normalized === max ? undefined : normalized);
  };

  return (
    <FormField name={fromName} label={label} hint={hint} className={className}>
      <div className="space-y-3">
        <Slider.Root
          className="relative flex h-5 w-full touch-none items-center select-none"
          min={min}
          max={max}
          step={step}
          value={[from, to]}
          onValueChange={([nextFrom, nextTo]) => {
            setFrom(nextFrom);
            setTo(nextTo);
            onChange?.(fromName, nextFrom === min ? undefined : nextFrom);
            onChange?.(toName, nextTo === max ? undefined : nextTo);
          }}
        >
          <Slider.Track className="relative h-1.5 grow rounded-full bg-border">
            <Slider.Range className="absolute h-full rounded-full bg-accent" />
          </Slider.Track>
          <Slider.Thumb
            className="block size-4 rounded-full border border-border bg-text outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            aria-label="От"
          />
          <Slider.Thumb
            className="block size-4 rounded-full border border-border bg-text outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            aria-label="До"
          />
        </Slider.Root>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            placeholder="От"
            className={cn(controlVariants({ size: 'sm' }))}
            value={from === min && fromValue == null ? '' : from}
            onChange={(event) => {
              const raw = event.target.value;
              if (raw === '') {
                setFrom(min);
                onChange?.(fromName, undefined);
                return;
              }

              commitFrom(Number(raw));
            }}
          />

          <input
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            placeholder="До"
            className={cn(controlVariants({ size: 'sm' }))}
            value={to === max && toValue == null ? '' : to}
            onChange={(event) => {
              const raw = event.target.value;
              if (raw === '') {
                setTo(max);
                onChange?.(toName, undefined);
                return;
              }

              commitTo(Number(raw));
            }}
          />
        </div>
      </div>
    </FormField>
  );
};
