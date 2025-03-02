# Use a lightweight Node.js image with Alpine Linux
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript
RUN npm run build

# ---- Production Image ----
FROM node:20-alpine

WORKDIR /app

# Install system dependencies for executing Python & Node.js
RUN apk add --no-cache python3 py3-pip gcc g++ make

# Copy built files from the builder stage
COPY --from=builder /app /app

# Install only production dependencies
RUN npm install --omit=dev

# Expose API port
EXPOSE 6789

# Start both API and worker
CMD ["sh", "-c", "node dist/server.js"]
