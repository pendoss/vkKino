# Устанавливаем зависимости для разработки
FROM node:20-alpine AS development-dependencies-env
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml /app/
WORKDIR /app
RUN pnpm install

# Устанавливаем production зависимости
FROM node:20-alpine AS production-dependencies-env
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml /app/
WORKDIR /app
RUN pnpm install --prod

# Собираем приложение
FROM node:20-alpine AS build-env
RUN npm install -g pnpm
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN pnpm run build

# Финальный образ для production
FROM node:20-alpine
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
CMD ["pnpm", "run", "start"]