import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { cardVariants, type CardVariants } from '@/shared/ui/card/card.variants';

type CardProps = HTMLAttributes<HTMLElement> &
  CardVariants & {
    as?: ElementType;
    children?: ReactNode;
  };

export const Card = ({
  as: Component = 'div',
  bordered,
  shadow,
  hoverable,
  padding,
  className,
  children,
  ...props
}: CardProps) => {
  return (
    <Component
      className={cardVariants({ bordered, shadow, hoverable, padding, className })}
      {...props}
    >
      {children}
    </Component>
  );
};
