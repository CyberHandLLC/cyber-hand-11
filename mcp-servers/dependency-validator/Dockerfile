FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Use npm install instead of npm ci for flexibility with or without package-lock.json
RUN npm install

# Copy server files
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Start the server in STDIN/STDOUT mode
CMD ["node", "standalone-server.js"]
