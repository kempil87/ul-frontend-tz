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
  onRangeChange?: (from: number | undefined, to: number | undefined) => void;
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
  onRangeChange,
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

  const commitRange = (nextFrom: number, nextTo: number) => {
    const normalizedFrom = Math.min(nextFrom, nextTo);
    const normalizedTo = Math.max(nextFrom, nextTo);
    setFrom(normalizedFrom);
    setTo(normalizedTo);

    const fromPayload = normalizedFrom === min ? undefined : normalizedFrom;
    const toPayload = normalizedTo === max ? undefined : normalizedTo;

    if (onRangeChange) {
      onRangeChange(fromPayload, toPayload);
      return;
    }

    onChange?.(fromName, fromPayload);
    onChange?.(toName, toPayload);
  };

  const commitFrom = (value: number | undefined) => {
    const next = value == null || Number.isNaN(value) ? min : clamp(value, min, max);
    commitRange(Math.min(next, to), to);
  };

  const commitTo = (value: number | undefined) => {
    const next = value == null || Number.isNaN(value) ? max : clamp(value, min, max);
    commitRange(from, Math.max(next, from));
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
          }}
          onValueCommit={([nextFrom, nextTo]) => {
            commitRange(nextFrom, nextTo);
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
                return;
              }

              const next = clamp(Number(raw), min, max);
              setFrom(Math.min(next, to));
            }}
            onBlur={() => {
              commitFrom(from);
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
                return;
              }

              const next = clamp(Number(raw), min, max);
              setTo(Math.max(next, from));
            }}
            onBlur={() => {
              commitTo(to);
            }}
          />
        </div>
      </div>
    </FormField>
  );
};
