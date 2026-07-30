type FormatPriceOptions = {
  currency?: string;
  locale?: string;
  maximumFractionDigits?: number;
  fallback?: string;
};

const DEFAULT_OPTIONS: Required<FormatPriceOptions> = {
  currency: 'RUB',
  locale: 'ru-RU',
  maximumFractionDigits: 0,
  fallback: '—',
};

export const priceService = {
  format: (value: number | null | undefined, options: FormatPriceOptions = {}) => {
    const { currency, locale, maximumFractionDigits, fallback } = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    if (value == null || Number.isNaN(value)) {
      return fallback;
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits,
    }).format(value);
  },
};
