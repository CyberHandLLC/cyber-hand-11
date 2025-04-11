# Enhanced test script for MCP Orchestrator with detailed logging
$ErrorActionPreference = "Continue"

# Set test variables
$component = "./app/components/test-component.tsx"
$outputFile = "orchestrator-result.json"
$logFile = "orchestrator-test.log"

# Start logging
"$(Get-Date) - Starting MCP Orchestrator comprehensive test" | Tee-Object -FilePath $logFile

# Create request payload following MCP protocol format
$requestJson = @"
{
    "id": "test-orchestrate",
    "type": "request",
    "name": "orchestrate_validation",
    "params": {
        "path": "$component",
        "options": {
            "verbose": true,
            "includeArchitecture": true,
            "includeDependencies": true,
            "includeDocumentation": true,
            "includeStyle": true,
            "allowFailure": true
        }
    }
}
"@

"$(Get-Date) - Created request payload for component: $component" | Tee-Object -Append -FilePath $logFile
$requestJson | Out-File -Encoding utf8 -FilePath "request.json"

# Check that component exists
if (Test-Path $component) {
    "$(Get-Date) - Component file exists: $component" | Tee-Object -Append -FilePath $logFile
} else {
    "$(Get-Date) - ERROR: Component file does not exist: $component" | Tee-Object -Append -FilePath $logFile
    exit 1
}

# Check that Docker is running
try {
    docker info | Out-Null
    "$(Get-Date) - Docker is running" | Tee-Object -Append -FilePath $logFile
} catch {
    "$(Get-Date) - ERROR: Docker is not running or not accessible" | Tee-Object -Append -FilePath $logFile
    exit 1
}

# Check orchestrator image
try {
    $image = docker images cyber-hand/mcp-orchestrator:latest --format "{{.Repository}}:{{.Tag}}"
    if ($image) {
        "$(Get-Date) - Found orchestrator image: $image" | Tee-Object -Append -FilePath $logFile
    } else {
        "$(Get-Date) - ERROR: Orchestrator image not found" | Tee-Object -Append -FilePath $logFile
        exit 1
    }
} catch {
    "$(Get-Date) - ERROR checking orchestrator image: $_" | Tee-Object -Append -FilePath $logFile
    exit 1
}

# Run the MCP orchestrator with detailed logging
"$(Get-Date) - Running MCP orchestrator..." | Tee-Object -Append -FilePath $logFile

try {
    $result = Get-Content -Raw "request.json" | docker run -i --rm `
        -v "${PWD}:/app/project" `
        -e NODE_ENV=production `
        -e MCP_DEBUG=true `
        -e DEBUG=mcp:*,stream:*,net:* `
        -e NODE_DEBUG=mcp,stream,net `
        -e PROJECT_ROOT=/app/project `
        cyber-hand/mcp-orchestrator:latest 2>&1
    
    "$(Get-Date) - Received orchestrator response" | Tee-Object -Append -FilePath $logFile
    
    # Save raw result
    $result | Out-File -Encoding utf8 -FilePath $outputFile
    
    # Try to parse the JSON response
    try {
        $jsonResult = $result | ConvertFrom-Json
        "$(Get-Date) - Successfully parsed JSON response" | Tee-Object -Append -FilePath $logFile
        
        # Extract content if present
        if ($jsonResult.content) {
            "$(Get-Date) - Response contains content array with $(($jsonResult.content).Length) items" | Tee-Object -Append -FilePath $logFile
            
            # Extract the text content
            $textContent = ($jsonResult.content | Where-Object { $_.type -eq "text" }).text
            if ($textContent) {
                "$(Get-Date) - Text content from orchestrator:" | Tee-Object -Append -FilePath $logFile
                $textContent | Tee-Object -Append -FilePath $logFile
            }
            
            # Extract JSON content
            $jsonContent = ($jsonResult.content | Where-Object { $_.type -eq "json" }).json
            if ($jsonContent) {
                "$(Get-Date) - JSON content summary:" | Tee-Object -Append -FilePath $logFile
                "- Summary: $($jsonContent.summary.message)" | Tee-Object -Append -FilePath $logFile
                "- Pass Rate: $($jsonContent.summary.passRate)%" | Tee-Object -Append -FilePath $logFile
                "- Passed: $($jsonContent.summary.passed)" | Tee-Object -Append -FilePath $logFile
                "- Failed: $($jsonContent.summary.failed)" | Tee-Object -Append -FilePath $logFile
                "- Errors: $($jsonContent.summary.errors)" | Tee-Object -Append -FilePath $logFile
                "- Warnings: $($jsonContent.summary.warnings)" | Tee-Object -Append -FilePath $logFile
                
                # Save structured JSON for further analysis
                $jsonContent | ConvertTo-Json -Depth 10 | Out-File -Encoding utf8 -FilePath "orchestrator-structured.json"
            }
        } else {
            "$(Get-Date) - No content array in response" | Tee-Object -Append -FilePath $logFile
        }
    } catch {
        "$(Get-Date) - ERROR parsing JSON: $_" | Tee-Object -Append -FilePath $logFile
        "$(Get-Date) - Raw response:" | Tee-Object -Append -FilePath $logFile
        $result | Tee-Object -Append -FilePath $logFile
    }
} catch {
    "$(Get-Date) - ERROR running orchestrator: $_" | Tee-Object -Append -FilePath $logFile
}

# Test complete
"$(Get-Date) - Test completed. Results saved to $outputFile and detailed logs in $logFile" | Tee-Object -Append -FilePath $logFile
"$(Get-Date) - To view the log: Get-Content -Path $logFile" | Tee-Object -Append -FilePath $logFile
