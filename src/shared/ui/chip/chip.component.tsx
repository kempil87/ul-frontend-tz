import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';

const chipVariants = tv({
  base: 'inline-flex items-center font-bold',
  variants: {
    variant: {
      default: 'bg-chip text-muted',
      muted: 'bg-chip text-muted',
      link: 'bg-chip text-link',
      accent: 'bg-accent/10 font-medium text-accent',
      success: 'bg-success/10 font-medium text-success',
      danger: 'bg-danger/10 font-medium text-danger',
      active: 'bg-chip-active text-white',
    },
    size: {
      sm: 'rounded-lg px-4 h-9 text-sm',
      md: 'gap-1 rounded-full px-4 h-10',
    },
    hasRemoved: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      size: ['sm', 'md'],
      hasRemoved: true,
      class: 'pr-1.5',
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'sm',
  },
});

type ChipVariants = VariantProps<typeof chipVariants>;

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> &
  ChipVariants & {
    children: ReactNode;
    onRemove?: () => void;
  };

export const Chip = ({
  children,
  variant,
  size,
  active,
  onRemove,
  className,
  type = 'button',
  onClick,
  ...props
}: ChipProps & { active?: boolean }) => {
  const resolvedVariant = active ? 'active' : variant;
  const classes = chipVariants({
    variant: resolvedVariant,
    size,
    className,
    hasRemoved: !!onRemove,
  });

  if (onRemove) {
    return (
      <span className={classes}>
        <span>{children}</span>
        <button
          type="button"
          aria-label="Убрать фильтр"
          className="inline-flex size-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-border hover:text-text"
          onClick={onRemove}
        >
          <Icon name="common:close" className="size-4.5" />
        </button>
      </span>
    );
  }

  if (onClick) {
    return (
      <button
        type={type}
        className={cn(classes, 'font-medium transition-colors hover:bg-border')}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }

  return <span className={classes}>{children}</span>;
};
