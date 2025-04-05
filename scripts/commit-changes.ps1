#!/usr/bin/env pwsh
#
# Auto Commit and Push Script
# 
# This script automatically detects changes, generates a descriptive commit message,
# and pushes those changes to the repository.
#
# Usage: ./scripts/commit-changes.ps1 [additional message]

# Configure script to stop on errors
$ErrorActionPreference = "Stop"

# Colors for output formatting
$GREEN = [ConsoleColor]::Green
$YELLOW = [ConsoleColor]::Yellow
$RED = [ConsoleColor]::Red
$CYAN = [ConsoleColor]::Cyan

# Helper functions
function Write-ColorOutput($message, $color) {
    Write-Host $message -ForegroundColor $color
}

function Get-CommitSummary {
    $changes = git diff --cached --name-status
    $addedCount = 0
    $modifiedCount = 0
    $deletedCount = 0
    $otherCount = 0

    foreach ($line in $changes -split "`n") {
        if ($line -match "^A") { $addedCount++ }
        elseif ($line -match "^M") { $modifiedCount++ }
        elseif ($line -match "^D") { $deletedCount++ }
        else { $otherCount++ }
    }

    $summary = ""
    if ($addedCount -gt 0) { $summary += "$addedCount added, " }
    if ($modifiedCount -gt 0) { $summary += "$modifiedCount modified, " }
    if ($deletedCount -gt 0) { $summary += "$deletedCount deleted, " }
    if ($otherCount -gt 0) { $summary += "$otherCount other changes, " }
    
    return $summary.TrimEnd(", ")
}

function Get-ChangedComponents {
    $componentFiles = git diff --cached --name-only -- "components/"
    if ($componentFiles.Count -gt 0) {
        $componentNames = @()
        foreach ($file in $componentFiles) {
            # Extract component name from path (components/folder/component-name.tsx -> component-name)
            $componentName = [System.IO.Path]::GetFileNameWithoutExtension($file)
            $componentNames += $componentName
        }
        return $componentNames -join ", "
    }
    return ""
}

function Get-FileTypeChanges {
    $fileTypes = @{
        "CSS" = @(".css", ".scss", ".module.css", ".module.scss")
        "TypeScript" = @(".ts", ".tsx")
        "JavaScript" = @(".js", ".jsx")
        "Config" = @(".json", ".yml", ".yaml", ".config.js")
        "Documentation" = @(".md", ".mdx")
    }
    
    $changedFiles = git diff --cached --name-only
    $typeChanges = @{}
    
    foreach ($file in $changedFiles) {
        $extension = [System.IO.Path]::GetExtension($file).ToLower()
        foreach ($type in $fileTypes.Keys) {
            if ($fileTypes[$type] -contains $extension) {
                if (-not $typeChanges.ContainsKey($type)) {
                    $typeChanges[$type] = 0
                }
                $typeChanges[$type]++
                break
            }
        }
    }
    
    $result = ""
    foreach ($type in $typeChanges.Keys) {
        $result += "$($typeChanges[$type]) $type files, "
    }
    
    return $result.TrimEnd(", ")
}

# Main script execution
try {
    # Check if there are any changes to commit
    $status = git status --porcelain
    if ([string]::IsNullOrWhiteSpace($status)) {
        Write-ColorOutput "No changes to commit" $YELLOW
        exit 0
    }
    
    # Add all changes to staging
    Write-ColorOutput "Adding all changes to staging..." $CYAN
    git add .
    
    # Generate commit details
    $date = Get-Date -Format "yyyy-MM-dd"
    $commitSummary = Get-CommitSummary
    $changedComponents = Get-ChangedComponents
    $fileTypeChanges = Get-FileTypeChanges
    
    # Build commit message
    $commitMessage = "Update ${date}: $commitSummary"
    
    # Add component info if applicable
    if ($changedComponents) {
        $commitMessage += "`n`nModified components: $changedComponents"
    }
    
    # Add file type info
    if ($fileTypeChanges) {
        $commitMessage += "`n`nChanged files: $fileTypeChanges"
    }
    
    # Add user's additional message if provided
    if ($args.Count -gt 0) {
        $additionalMessage = $args -join " "
        $commitMessage += "`n`nAdditional notes: $additionalMessage"
    }
    
    # Create commit
    Write-ColorOutput "Committing changes with message:" $CYAN
    Write-Host $commitMessage
    git commit -m $commitMessage
    
    # Push changes
    Write-ColorOutput "`nPushing changes to remote repository..." $CYAN
    git push
    
    Write-ColorOutput "Successfully committed and pushed changes!" $GREEN
} catch {
    Write-ColorOutput "Error: $_" $RED
    exit 1
}
