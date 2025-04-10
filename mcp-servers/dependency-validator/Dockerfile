FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Use npm install instead of npm ci for flexibility with or without package-lock.json
RUN npm install

# Copy server files
COPY . .

# Expose the port the server listens on
EXPOSE 8002

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8002

# Health check to verify server is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8002/health || exit 1

# Start the server
CMD ["node", "standalone-server.js"]
