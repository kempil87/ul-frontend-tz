import { useQueryClient, type FetchQueryOptions, type QueryKey } from '@tanstack/react-query';
import { useDebounceCallback } from 'usehooks-ts';

const DEFAULT_PREFETCH_DEBOUNCE_MS = 150;

type PrefetchHandlers<TArgs extends unknown[]> = {
  onPrefetchIntent: (...args: TArgs) => void;
  onPrefetchCancel: () => void;
};

const isPrefetchDisabled = (options: unknown): boolean =>
  typeof options === 'object' &&
  options !== null &&
  'enabled' in options &&
  options.enabled === false;

export const useDebouncedPrefetchQuery = <TArgs extends unknown[]>(
  getOptions: (...args: TArgs) => unknown,
  delayMs = DEFAULT_PREFETCH_DEBOUNCE_MS,
): PrefetchHandlers<TArgs> => {
  const queryClient = useQueryClient();

  const prefetch = useDebounceCallback((...args: TArgs) => {
    const options = getOptions(...args);

    if (isPrefetchDisabled(options)) return;

    queryClient.prefetchQuery(options as FetchQueryOptions<unknown, Error, unknown, QueryKey>);
  }, delayMs);

  return {
    onPrefetchIntent: (...args: TArgs) => {
      prefetch(...args);
    },
    onPrefetchCancel: () => {
      prefetch.cancel();
    },
  };
};

export const getPrefetchIntentProps = <TKey extends string>(
  key: TKey,
  handlers: PrefetchHandlers<[TKey]>,
) => ({
  onMouseEnter: () => handlers.onPrefetchIntent(key),
  onMouseLeave: handlers.onPrefetchCancel,
  onFocusCapture: () => handlers.onPrefetchIntent(key),
  onBlurCapture: handlers.onPrefetchCancel,
});
