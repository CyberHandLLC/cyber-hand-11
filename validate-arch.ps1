# PowerShell script to properly communicate with MCP server
# using the Model Context Protocol

# Set environment variables for debugging
$env:MCP_DEBUG = "true"

# Get the request JSON content
$requestPath = Join-Path $PSScriptRoot "mcp-servers\requests\validate-arch.json"
Write-Host "Reading request from: $requestPath"
$requestContent = Get-Content $requestPath -Raw

# Display the request content for debugging
Write-Host "Request content:"
Write-Host $requestContent

# Create a temporary file to store the output
$tempOutputFile = Join-Path $env:TEMP "mcp-response-$(Get-Random).json"

# Use Get-Content to pipe the JSON into the docker exec command and redirect output to the temp file
Write-Host "`nSending request to MCP server..."
Get-Content $requestPath | docker exec -i cyber-handcom-architecture-guard-1 node standalone-server.js > $tempOutputFile

# Read the output file
$output = Get-Content $tempOutputFile -Raw

# Display the output
Write-Host "`nMCP Server Response:"
Write-Host $output

# Parse the output to display formatted results (if available)
if ($output) {
    try {
        # Clean up the output to make it valid JSON if needed
        $cleanedOutput = $output.Trim()
        
        # Parse the JSON response
        $parsed = $cleanedOutput | ConvertFrom-Json
        Write-Host "`nFormatted Response:"
        
        if ($parsed.content) {
            # Display formatted content
            foreach ($item in $parsed.content) {
                if ($item.type -eq "json") {
                    Write-Host "`nArchitecture Validation Results:" -ForegroundColor Green
                    
                    # Display errors if any
                    if ($item.json.errors -and $item.json.errors.Count -gt 0) {
                        Write-Host "`nErrors:" -ForegroundColor Red
                        foreach ($error in $item.json.errors) {
                            Write-Host "- $error" -ForegroundColor Red
                        }
                    }
                    
                    # Display warnings if any
                    if ($item.json.warnings -and $item.json.warnings.Count -gt 0) {
                        Write-Host "`nWarnings:" -ForegroundColor Yellow
                        foreach ($warning in $item.json.warnings) {
                            Write-Host "- $warning" -ForegroundColor Yellow
                        }
                    }
                    
                    # Display component issues if any
                    if ($item.json.componentIssues -and $item.json.componentIssues.Count -gt 0) {
                        Write-Host "`nComponent Issues:" -ForegroundColor Yellow
                        foreach ($issue in $item.json.componentIssues) {
                            Write-Host "File: $($issue.file)" -ForegroundColor Cyan
                            foreach ($issueItem in $issue.issues) {
                                Write-Host "  - $issueItem" -ForegroundColor Yellow
                            }
                        }
                    }
                }
                elseif ($item.type -eq "text") {
                    Write-Host "`nSummary:" -ForegroundColor Green
                    Write-Host $item.text
                }
            }
        }
        elseif ($parsed.error) {
            Write-Host "`nError:" -ForegroundColor Red
            Write-Host $parsed.error.message
        }
    }
    catch {
        Write-Host "Could not parse response as JSON. Raw output:" -ForegroundColor Yellow
        Write-Host $output
        Write-Host "Error details:" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
    
    # Clean up the temporary file
    if (Test-Path $tempOutputFile) {
        Remove-Item $tempOutputFile -Force
    }
}
else {
    Write-Host "No response received from MCP server" -ForegroundColor Red
}
