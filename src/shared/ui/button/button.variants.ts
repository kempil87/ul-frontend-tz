import { tv, type VariantProps } from 'tailwind-variants';

export const buttonVariants = tv({
  base: [
    'inline-flex items-center justify-center gap-2 font-bold',
    'rounded-xl font-medium whitespace-nowrap cursor-pointer',
    'transition-colors outline-none',
    'focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-app',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  variants: {
    variant: {
      primary: 'bg-accent text-white hover:bg-accent-hover',
      secondary: 'border border-border bg-raised text-text hover:bg-raised-hover',
      ghost: 'bg-transparent text-muted hover:bg-raised-hover hover:text-text',
      soft: 'bg-nav-active text-text hover:bg-raised-hover',
      danger: 'bg-red-600 text-white hover:bg-red-500',
    },
    size: {
      sm: 'h-9 px-3 text-sm',
      md: 'h-12 px-4 text-base',
      lg: 'h-13 px-5 text-lg',
      icon: 'size-10 p-0',
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
  },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;
