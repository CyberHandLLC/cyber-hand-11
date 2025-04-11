# Basic test script for MCP Orchestrator
$component = "./app/components/test-component.tsx"

Write-Host "Testing MCP Orchestrator with component: $component" -ForegroundColor Cyan

# Create simplified request payload
$requestJson = @"
{
    "id": "test-orchestrate",
    "type": "request",
    "name": "orchestrate_validation",
    "params": {
        "path": "$component",
        "options": {
            "verbose": true,
            "includeDocumentation": true
        }
    }
}
"@

# Save request to file
$requestJson | Out-File -Encoding utf8 -FilePath "request.json"

# Run the documentation validator directly instead of the orchestrator
# This focuses on testing the documentation we just added
Write-Host "Testing documentation validation directly..." -ForegroundColor Cyan
Get-Content -Raw "request.json" | docker run -i --rm -v "${PWD}:/app/project" cyber-hand/docs-validator:latest

Write-Host "Test complete. The documentation validator should have verified our JSDoc comments." -ForegroundColor Green
