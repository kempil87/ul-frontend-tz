import dayjs, { type ConfigType } from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

export const Granularity = {
  DAY: 'DD MMM YYYY',
  MONTH: 'MMMM YYYY',
  YEAR: 'YYYY',
  DATE_TIME: 'DD MMM YYYY, HH:mm',
};

export const dateService = {
  parse: (value: ConfigType) => dayjs(value),

  isValid: (value: ConfigType) => dayjs(value).isValid(),

  format: (value: ConfigType, template = Granularity.DAY) => {
    if (value == null || value === '') {
      return '—';
    }

    const date = dayjs(value);

    if (!date.isValid()) {
      return typeof value === 'string' ? value : '—';
    }

    return date.format(template);
  },

  formatDateTime: (value: ConfigType, template = Granularity.DATE_TIME) => {
    return dateService.format(value, template);
  },
};
