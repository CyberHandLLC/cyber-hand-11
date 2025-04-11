FROM node:18-slim

WORKDIR /app

# Install debugging tools
RUN apt-get update && apt-get install -y \
    curl \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy server code
COPY . .

# Configure environment for STDIN/STDOUT communication and extensive debugging
# CRITICAL: Do NOT expose ports for STDIN/STDOUT MCP servers
ENV NODE_ENV=production
ENV FORCE_COLOR=1
ENV MCP_DEBUG=true
ENV DEBUG=mcp:*
ENV NODE_DEBUG=mcp,stream,net

# Create wrapper script to enhance logging
RUN echo '#!/bin/sh\necho "Starting MCP Orchestrator with enhanced logging..."\necho "Environment: $(env | grep -E "(MCP|NODE)" | sort)"\nexec node --trace-warnings standalone-server.js' > /app/start.sh \
    && chmod +x /app/start.sh

# Start server with STDIN/STDOUT communication and enhanced logging
CMD ["/app/start.sh"]
