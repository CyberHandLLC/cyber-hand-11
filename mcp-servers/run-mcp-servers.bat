@echo off
echo Starting MCP Servers in Docker containers...

start "Architecture Guard MCP Server" cmd /k docker run -i --rm cyber-hand/architecture-guard:latest
start "Dependency Validator MCP Server" cmd /k docker run -i --rm cyber-hand/dependency-validator:latest
start "Style Validator MCP Server" cmd /k docker run -i --rm cyber-hand/style-validator:latest

echo.
echo All MCP servers started in separate windows.
echo To use these servers, make sure your mcp_config.json is updated.
echo.
echo Press any key to close this window...
pause > nul
