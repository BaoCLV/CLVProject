# Use a specific Node.js version for better stability and predictability
FROM node:18

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

# Expose the Next.js default port (3000)
EXPOSE 3000

# Run the application in production mode
CMD ["pnpm", "dev"]
