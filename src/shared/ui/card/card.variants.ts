import { tv, type VariantProps } from 'tailwind-variants';

export const cardVariants = tv({
  base: 'rounded-3xl bg-raised',
  variants: {
    bordered: {
      true: 'border border-border',
      thick: 'border-2 border-border hover:shadow-md',
      false: '',
    },
    shadow: {
      true: 'shadow-sm',
      false: '',
    },
    hoverable: {
      true: 'transition-colors hover:bg-raised-hover',
      false: '',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-5 md:p-6',
      lg: 'p-6 md:p-8',
    },
  },
  defaultVariants: {
    bordered: 'thick',
    shadow: false,
    hoverable: false,
    padding: 'md',
  },
});

export type CardVariants = VariantProps<typeof cardVariants>;
