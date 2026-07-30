import { getPaginationItems } from '@/shared/ui/pagination/get-pagination-items';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/cn';

type PaginationProps = {
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  disabled?: boolean;
  siblingCount?: number;
};

export const Pagination = ({
  page,
  lastPage,
  onPageChange,
  className,
  disabled = false,
  siblingCount = 1,
}: PaginationProps) => {
  if (lastPage <= 1) {
    return null;
  }

  const currentPage = Math.min(Math.max(page, 1), lastPage);
  const items = getPaginationItems({ page: currentPage, lastPage, siblingCount });
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= lastPage;

  return (
    <nav
      className={cn('flex flex-wrap items-center justify-center gap-1 md:justify-end', className)}
      aria-label="Пагинация"
    >
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled || isFirstPage}
        aria-label="Предыдущая страница"
        onClick={() => onPageChange(currentPage - 1)}
      >
        Назад
      </Button>

      {items.map((item, index) => {
        if (item === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-8 min-w-8 items-center justify-center px-1 text-sm text-muted"
              aria-hidden
            >
              …
            </span>
          );
        }

        const isActive = item === currentPage;

        return (
          <Button
            key={item}
            type="button"
            variant={isActive ? 'soft' : 'ghost'}
            size="sm"
            disabled={disabled}
            aria-label={`Страница ${item}`}
            aria-current={isActive ? 'page' : undefined}
            className={cn('min-w-8', isActive && 'pointer-events-none')}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        );
      })}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled || isLastPage}
        aria-label="Следующая страница"
        onClick={() => onPageChange(currentPage + 1)}
      >
        Вперёд
      </Button>
    </nav>
  );
};
