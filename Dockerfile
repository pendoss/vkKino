# Базовый образ с pnpm
FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

# Устанавливаем все зависимости
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Собираем приложение
FROM base AS build
COPY package.json pnpm-lock.yaml ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# Production образ
FROM node:20-alpine AS production
RUN npm install -g pnpm
WORKDIR /app

# Копируем package.json и устанавливаем только production зависимости
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Копируем собранное приложение
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public

# Настраиваем окружение
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# Проверяем что приложение работает
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Запускаем приложение
CMD ["pnpm", "run", "start"]