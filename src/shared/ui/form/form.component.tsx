import type { ComponentProps, ReactNode } from 'react';
import { FormProvider, type FieldValues, type UseFormReturn } from 'react-hook-form';

import { cn } from '@/shared/lib/cn';

type FormProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  children: ReactNode;
  className?: string;
  onSubmit?: ComponentProps<'form'>['onSubmit'];
};

export const Form = <TFieldValues extends FieldValues>({
  form,
  children,
  className,
  onSubmit,
}: FormProps<TFieldValues>) => {
  return (
    <FormProvider {...form}>
      <form
        className={cn(className)}
        onSubmit={onSubmit ?? ((event) => event.preventDefault())}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
};
