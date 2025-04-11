FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy server code
COPY . .

# Configure environment for STDIN/STDOUT communication
# CRITICAL: Do NOT expose ports for STDIN/STDOUT MCP servers
ENV NODE_ENV=production
ENV FORCE_COLOR=1
ENV MCP_DEBUG=true

# Start server with STDIN/STDOUT communication
CMD ["node", "standalone-server.js"]
