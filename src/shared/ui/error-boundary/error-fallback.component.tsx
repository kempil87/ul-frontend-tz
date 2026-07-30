import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

type ErrorFallbackProps = {
  error: Error;
  onReset?: () => void;
};

export const ErrorFallback = ({ error, onReset }: ErrorFallbackProps) => {
  return (
    <Card
      className="flex h-full min-h-48 flex-col items-center justify-center gap-4 text-center"
      padding="lg"
    >
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-text">Что-то пошло не так</h2>

        <p className="max-w-md text-sm text-muted">
          Произошла непредвиденная ошибка. Можно попробовать снова или обновить страницу.
        </p>

        {import.meta.env.DEV ? (
          <pre className="mt-3 max-w-lg overflow-auto rounded-lg bg-app p-3 text-left text-xs text-link">
            {error.message}
          </pre>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {onReset ? (
          <Button type="button" variant="primary" onClick={onReset}>
            Попробовать снова
          </Button>
        ) : null}
        <Button type="button" variant="secondary" onClick={() => window.location.assign('/')}>
          На главную
        </Button>
      </div>
    </Card>
  );
};
