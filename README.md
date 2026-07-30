# Умная логистика — Тестовое задание (SPA)

SPA для работы с грузовыми аукционами по OpenAPI-схеме `openapi.auctions.v0.json`.

Деплой на GithubPages

## Site - https://kempil87.github.io/ul-frontend-tz

[![CI](https://github.com/kempil87/ul-frontend-tz/actions/workflows/ci.yml/badge.svg)](https://github.com/kempil87/ul-frontend-tz/actions/workflows/ci.yml)
[![Deploy](https://github.com/kempil87/ul-frontend-tz/actions/workflows/deploy.yml/badge.svg)](https://github.com/kempil87/ul-frontend-tz/actions/workflows/deploy.yml)

## Запуск

Требования: Node.js 20+, Yarn 1.

```bash
yarn install
yarn dev
```

Приложение откроется на `http://localhost:5173` (Vite `--host`).

### Полезные команды

| Команда          | Описание                                         |
| ---------------- | ------------------------------------------------ |
| `yarn dev`       | Локальная разработка                             |
| `yarn build`     | Генерация иконок + typecheck + production-сборка |
| `yarn preview`   | Просмотр production-сборки                       |
| `yarn test`      | Юнит-тесты (Vitest)                              |
| `yarn lint`      | ESLint                                           |
| `yarn gen:types` | Типы из OpenAPI → `src/shared/api/types.ts`      |
| `yarn gen:icons` | SVG-спрайты                                      |

## Тесты

```bash
yarn test
```

## Ограничения

- **Шаг ставки на карточке списка** не показывается: в list DTO (`AuctionListItemTradingPrice`) нет поля `step` — оно есть только в detail. Цена за км берётся из `main.price_per_km`.
- Auth отсутствует: MSW работает без Bearer-токена.
- Seed/MSW — учебный in-memory store, не полный продакшен-бэкенд.

## AI

Использование AI и решения кандидата описаны в [`AI_USAGE.md`](./AI_USAGE.md).
