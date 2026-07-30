import * as Label from '@radix-ui/react-label';
import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/shared/lib/cn';

type FormFieldProps = {
  name: string;
  label?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export const FormField = ({ name, label, hint, className, children }: FormFieldProps) => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const message = typeof error?.message === 'string' ? error.message : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label.Root htmlFor={name} className="text-xs font-medium text-muted">
          {label}
        </Label.Root>
      )}

      {children}

      {hint && !message && <p className="text-xs text-muted">{hint}</p>}

      {message && <p className="text-xs text-red-600">{message}</p>}
    </div>
  );
};
