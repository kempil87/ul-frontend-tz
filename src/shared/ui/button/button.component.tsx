import { Slot } from '@radix-ui/react-slot';
import type { ButtonHTMLAttributes, Ref } from 'react';

import { buttonVariants, type ButtonVariants } from '@/shared/ui/button/button.variants';
import { cn } from '@/shared/lib/cn';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants & {
    asChild?: boolean;
    isLoading?: boolean;
    ref?: Ref<HTMLButtonElement>;
  };

const ButtonSpinner = ({ className }: { className?: string }) => (
  <span
    className={cn(
      'size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent',
      className,
    )}
    aria-hidden
  />
);

export const Button = ({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  isLoading = false,
  type = 'button',
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const Component = asChild ? Slot : 'button';
  const isDisabled = disabled || isLoading;

  return (
    <Component
      type={asChild ? undefined : type}
      className={buttonVariants({ variant, size, fullWidth, className })}
      disabled={asChild ? undefined : isDisabled}
      aria-busy={isLoading || undefined}
      aria-disabled={asChild ? isDisabled : undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {isLoading ? <ButtonSpinner /> : null}
          {children}
        </>
      )}
    </Component>
  );
};
