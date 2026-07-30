import { tv } from 'tailwind-variants';

export const controlVariants = tv({
  base: [
    'w-full rounded-xl border border-border bg-raised text-sm text-text',
    'placeholder:text-muted',
    'outline-none transition-colors',
    'focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-app',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  variants: {
    size: {
      md: 'h-11 px-3.5',
      sm: 'h-9 px-3 text-xs',
    },
    invalid: {
      true: 'border-red-500/70 focus-visible:ring-red-500/40',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    invalid: false,
  },
});

export const textFieldWrapperVariants = tv({
  base: [
    'w-full rounded-xl border border-border bg-raised text-sm text-text flex items-center gap-2.5',
    'focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-app',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'hover:bg-raised-hover',
  ],
  variants: {
    size: {
      md: 'h-11 px-3.5',
      sm: 'h-9 px-3 text-xs',
    },
    invalid: {
      true: 'border-red-500/70 focus-visible:ring-red-500/40',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    invalid: false,
  },
});

export const popoverContentVariants = tv({
  base: [
    'z-50 rounded-xl border border-border bg-raised p-2 shadow-lg',
    'outline-none',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
  ],
});
