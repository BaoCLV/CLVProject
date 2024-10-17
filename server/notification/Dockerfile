# Use a specific version for better stability
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package and lock files first to optimize build caching
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies in one step to reduce image layers
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .



RUN pnpm build

FROM node:18 AS production

# Set working directory
WORKDIR /app

RUN npm install -g pnpm

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 6000

CMD ["pnpm", "start:prod"]
