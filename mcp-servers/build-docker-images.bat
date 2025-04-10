@echo off
echo Building MCP Server Docker Images...

cd %~dp0\..
docker-compose -f mcp-servers/docker-compose.yml build

echo.
echo Docker images built successfully!
echo.
echo The following images are now available:
echo - cyber-hand/architecture-guard:latest
echo - cyber-hand/dependency-validator:latest
echo - cyber-hand/style-validator:latest
echo.
echo To use these MCP servers with Codeium, you need to update your mcp_config.json
