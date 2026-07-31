import { useMediaQuery } from 'usehooks-ts';

export const useMobile = (breakpoint: number = 768) =>
  useMediaQuery(`(max-width: ${breakpoint}px)`);
