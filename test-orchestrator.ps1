# Test script for MCP Orchestrator
$requestJson = @"
{
    "id": "test-orchestrate",
    "type": "request",
    "name": "orchestrate_validation",
    "params": {
        "path": "./app/components/test-component.tsx",
        "options": {
            "verbose": true,
            "includeArchitecture": true,
            "includeDependencies": true,
            "includeDocumentation": true,
            "includeStyle": true
        }
    }
}
"@

# Save request to file
$requestJson | Out-File -Encoding utf8 -FilePath "request.json"

# Run the MCP orchestrator
$result = Get-Content -Raw "request.json" | docker run -i --rm `
    -v "${PWD}:/app/project" `
    -e NODE_ENV=production `
    -e MCP_DEBUG=true `
    -e PROJECT_ROOT=/app/project `
    cyber-hand/mcp-orchestrator:latest

# Display the result
$result

# Save result for analysis
$result | Out-File -Encoding utf8 -FilePath "orchestrator-result.json"

Write-Host "Test completed. Results saved to orchestrator-result.json"
