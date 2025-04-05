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

function Get-FileChangeSummary {
    $output = git diff --cached --name-status
    $changeDetails = @()
    
    foreach ($line in $output -split "`n") {
        if ($line -match "^([A-Z])\s+(.+)$") {
            $status = $matches[1]
            $file = $matches[2]
            
            $statusDesc = switch ($status) {
                "A" { "Added" }
                "M" { "Modified" }
                "D" { "Deleted" }
                "R" { "Renamed" }
                default { "Changed" }
            }
            
            $changeDetails += "- ${statusDesc}: $file"
        }
    }
    
    return $changeDetails -join "`n"
}

function Get-FileTypeChanges {
    $fileTypes = @{
        "CSS" = @(".css", ".scss", ".module.css", ".module.scss");
        "TypeScript" = @(".ts", ".tsx");
        "JavaScript" = @(".js", ".jsx");
        "Config" = @(".json", ".yml", ".yaml", ".config.js");
        "Documentation" = @(".md", ".mdx");
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
    $changeDetails = Get-FileChangeSummary
    
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
    
    # Add detailed changes
    if ($changeDetails) {
        $commitMessage += "`n`nDetails:
$changeDetails"
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
    
    # Show detailed changes
    Write-ColorOutput "`nDetailed changes:" $CYAN
    git diff --cached --stat

    # Check if branch has upstream configured
    $branchInfo = & { git status -sb 2>&1 } | Select-Object -First 1
    $hasUpstream = $branchInfo -match '\[(.+?)\]'
    
    # Push changes with upstream configuration if needed
    Write-ColorOutput "`nPushing changes to remote repository..." $CYAN
    
    if (-not $hasUpstream) {
        # No upstream, try to automatically configure it
        $currentBranch = git rev-parse --abbrev-ref HEAD
        Write-ColorOutput "No upstream branch configured. Setting up tracking for '$currentBranch'..." $YELLOW
        $remoteName = git remote
        if ($remoteName.Count -eq 0) {
            Write-ColorOutput "No remote configured. Please add a remote first." $RED
        } else {
            $primaryRemote = $remoteName | Select-Object -First 1
            git branch --set-upstream-to="$primaryRemote/$currentBranch" $currentBranch
            git push
        }
    } else {
        # Normal push with tracking already set up
        git push
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "Successfully committed and pushed changes!" $GREEN
    } else {
        Write-ColorOutput "Commit successful but push failed. Changes are saved locally." $YELLOW
    }
} catch {
    Write-ColorOutput "Error: $_" $RED
    exit 1
}
