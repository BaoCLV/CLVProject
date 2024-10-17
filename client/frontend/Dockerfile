# Use a specific Node.js version for better stability and predictability
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy only the package files first to utilize Docker layer caching
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally and install project dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the remaining application source code
COPY . .

# Build the application for production
RUN pnpm build

# Start a new, lighter stage for production
FROM node:18 AS production

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally in the production stage to ensure it's available
RUN npm install -g pnpm

# Copy only the necessary files from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Expose the Next.js default port (3000)
EXPOSE 3000

# Run the application in production mode
CMD ["pnpm", "start"]
