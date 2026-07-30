import { createSvgSpriteBuilder } from '@neodx/svg';

const builder = createSvgSpriteBuilder({
  inputRoot: 'src/shared/ui/icon/assets',
  output: 'public/sprites',
  fileName: '{name}.{hash:8}.svg',
  metadata: 'src/shared/ui/icon/sprite.gen.ts',
  group: true,
  resetColors: {
    replace: ['#000', '#000000', '#fff', '#ffffff'],
    replaceUnknown: 'currentColor',
  },
});

await builder.load('**/*.svg');
await builder.build();

console.log('SVG sprites generated');
