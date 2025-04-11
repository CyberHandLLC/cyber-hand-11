FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy server code
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Configure pipes for STDIN/STDOUT communication
# This is critical for Cascade MCP integration
ENV FORCE_COLOR=1

# Start server with STDIN/STDOUT communication
CMD ["node", "standalone-server.js"]

# IMPORTANT: Don't expose ports since we're using STDIN/STDOUT
# instead of HTTP communication for the MCP protocol
