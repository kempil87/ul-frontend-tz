import type { InputHTMLAttributes, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField } from '@/shared/ui/form/form-field.component';
import { cn } from 'tailwind-variants';
import { textFieldWrapperVariants } from './form-control.styles';

type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'value' | 'defaultValue' | 'onChange'
> & {
  name: string;
  label?: string;
  hint?: string;
  className?: string;
  onChange?: (name: string, value: string) => void;
  startContent?: ReactNode;
  endContent?: ReactNode;
};

export const TextField = ({
  name,
  label,
  hint,
  className,
  type = 'text',
  startContent,
  endContent,
  onChange,
  ...inputProps
}: TextFieldProps) => {
  const { control } = useFormContext();

  return (
    <FormField name={name} label={label} hint={hint} className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange: fieldOnChange, value, ...field }, fieldState }) => (
          <label
            id="wrapper"
            className={cn(textFieldWrapperVariants({ invalid: fieldState.invalid }))}
          >
            {startContent}
            <input
              {...inputProps}
              {...field}
              id={name}
              type={type}
              value={value ?? ''}
              className={cn(
                'w-full bg-transparent shadow-none appearance-none',
                'placeholder:text-muted',
                'outline-none',
              )}
              onChange={(event) => {
                const value = event.target.value;
                fieldOnChange(value);
                onChange?.(name, value);
              }}
            />
            {endContent}
          </label>
        )}
      />
    </FormField>
  );
};
