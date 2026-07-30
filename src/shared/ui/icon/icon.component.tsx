import { type ComponentProps, useMemo } from 'react';

import { cn } from '@/shared/lib/cn';
import { type SpritePrepareConfig, sprites, type SpritesMeta } from '@/shared/ui/icon/sprite.gen';

export type IconName = {
  [Key in keyof SpritesMeta]: `${Key & string}:${SpritesMeta[Key]}`;
}[keyof SpritesMeta];

export type IconProps = ComponentProps<'svg'> & {
  name: IconName;
};

export const Icon = ({ name, className, ...props }: IconProps) => {
  const {
    symbol: { viewBox, width, height },
    href,
  } = useMemo(() => getIconMeta(name), [name]);

  return (
    <svg
      width={width}
      fill="currentColor"
      height={height}
      className={cn('select-none text-current', className)}
      viewBox={viewBox}
      focusable="false"
      aria-hidden
      {...props}
    >
      <use href={href} />
    </svg>
  );
};

const getIconMeta = (name: IconName) => {
  const [spriteName, iconName] = name.split(':') as [string, string];
  const item = sprites.experimental_get(spriteName, iconName, spritesConfig);

  if (!item) {
    throw new Error(`Icon "${name}" is not found in "${spriteName}" sprite`);
  }

  return item;
};

const spritesConfig: SpritePrepareConfig = {
  baseUrl: `${import.meta.env.BASE_URL}sprites/`,
};
