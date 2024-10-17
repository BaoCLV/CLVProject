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

# Build the application
RUN pnpm build

# Start a new, lighter stage for production
FROM node:18 AS production

# Set working directory
WORKDIR /app

# Install pnpm globally in the production stage to ensure it's available
RUN npm install -g pnpm

# Copy only the necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Expose the port based on the specific API
EXPOSE 5000

# Start the application in production mode
CMD ["pnpm", "start:prod"]
