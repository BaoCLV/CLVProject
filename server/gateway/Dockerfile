# Use a specific version for better stability
FROM node:18

# Set working directory
WORKDIR /app


COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies in one step to reduce image layers
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the application
RUN pnpm build

# Expose the port
EXPOSE 5000

# Start the application in development mode
CMD ["pnpm", "start:dev"]
