import { cn } from '@/shared/lib/cn';

type PageLoaderProps = {
  className?: string;
};

export const PageLoader = ({ className }: PageLoaderProps) => {
  return (
    <div
      className={cn(
        'flex h-full min-h-48 items-center justify-center text-sm text-muted',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label="Загрузка страницы"
    >
      <div className="flex items-center gap-3">
        <span className="size-4 animate-spin rounded-full border-2 border-border border-t-accent" />

        <span>Загрузка...</span>
      </div>
    </div>
  );
};
