import { setupWorker } from 'msw/browser';

import { handlers } from '@/shared/api/msw/handlers';

export const worker = setupWorker(...handlers);
