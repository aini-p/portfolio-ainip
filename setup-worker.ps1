# setup-worker.ps1
#
# Makes sure the Cloudflare D1 databases behind the "at5fun-api" Worker
# (worker/) exist for staging and production, creates whichever is missing,
# writes the resulting database_id back into worker/wrangler.toml, and
# applies worker/schema.sql to each (safe to re-run: CREATE TABLE IF NOT
# EXISTS). Finally it starts the worker's local dev server so you can test
# right away.
#
# Requires: you are already logged in via `npx wrangler login` (run once,
# opens a browser). If you are not, this script stops and tells you to run
# it, rather than failing halfway through.
#
# Usage:
#   .\setup-worker.ps1                  # ensure staging + production, then start local dev server
#   .\setup-worker.ps1 -SkipDev         # ensure staging + production, don't start a server
#   .\setup-worker.ps1 -Only staging    # only ensure the staging database
#   .\setup-worker.ps1 -Only production -SkipDev

param(
    [ValidateSet("staging", "production", "both")]
    [string]$Only = "both",
    [switch]$SkipDev
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$workerDir = Join-Path $rootDir "worker"
$wranglerToml = Join-Path $workerDir "wrangler.toml"
$uuidPattern = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'

if (-not (Test-Path $workerDir)) {
    Write-Host "[ERROR] worker/ directory not found." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $wranglerToml)) {
    Write-Host "[ERROR] worker/wrangler.toml not found." -ForegroundColor Red
    exit 1
}

$allTargets = @(
    [pscustomobject]@{ Env = "staging"; DbName = "at5fun-db-staging"; Section = "[[env.staging.d1_databases]]" }
    [pscustomobject]@{ Env = "production"; DbName = "at5fun-db"; Section = "[[env.production.d1_databases]]" }
)
$targets = if ($Only -eq "both") { $allTargets } else { $allTargets | Where-Object { $_.Env -eq $Only } }

function Sync-DatabaseId {
    param([string]$Section, [string]$NewId)

    $lines = Get-Content $wranglerToml
    $inSection = $false
    $changed = $false

    $newLines = foreach ($line in $lines) {
        if ($line.Trim() -eq $Section) {
            $inSection = $true
            $line
            continue
        }
        if ($inSection -and $line.Trim().StartsWith("[")) {
            $inSection = $false
        }

        if ($inSection -and $line -match '^\s*database_id\s*=\s*"([^"]*)"') {
            $current = $Matches[1]
            if ($current -ne $NewId) {
                Write-Host "  wrangler.toml: database_id $current -> $NewId" -ForegroundColor Yellow
                $changed = $true
                $line -replace '"[^"]*"', "`"$NewId`""
            }
            else {
                $line
            }
        }
        else {
            $line
        }
    }

    if ($changed) {
        Set-Content -Path $wranglerToml -Value $newLines -Encoding UTF8
    }
    else {
        Write-Host "  wrangler.toml already up to date." -ForegroundColor DarkGray
    }
}

Push-Location $workerDir
try {
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing worker dependencies (npm install)..." -ForegroundColor Cyan
        npm install
        if ($LASTEXITCODE -ne 0) { throw "npm install failed in worker/" }
    }

    Write-Host "`nChecking Cloudflare login..." -ForegroundColor Cyan
    $whoami = (npx wrangler whoami 2>&1 | Out-String)
    $loggedIn = ($LASTEXITCODE -eq 0) -and ($whoami -notmatch "not authenticated|You are not logged in|not logged in")
    if (-not $loggedIn) {
        Write-Host $whoami
        Write-Host "[ERROR] Not logged in to Cloudflare." -ForegroundColor Red
        Write-Host "  Run: npx wrangler login" -ForegroundColor Yellow
        Write-Host "  then re-run this script." -ForegroundColor Yellow
        exit 1
    }
    Write-Host $whoami.Trim()

    foreach ($t in $targets) {
        Write-Host "`n===== $($t.Env) : $($t.DbName) =====" -ForegroundColor Cyan

        Write-Host "Checking whether the database already exists..."
        $infoOutput = (npx wrangler d1 info $t.DbName --config wrangler.toml --json 2>&1 | Out-String)
        $exists = $LASTEXITCODE -eq 0
        $databaseId = $null

        if ($exists) {
            $match = [regex]::Match($infoOutput, $uuidPattern)
            if ($match.Success) { $databaseId = $match.Value }
            Write-Host "  Found existing database (id: $databaseId)" -ForegroundColor Green
        }
        else {
            Write-Host "  Not found. Creating..." -ForegroundColor Yellow
            $createOutput = (npx wrangler d1 create $t.DbName --config wrangler.toml 2>&1 | Out-String)
            Write-Host $createOutput
            if ($LASTEXITCODE -ne 0) {
                throw "Failed to create D1 database '$($t.DbName)'. See output above."
            }
            $match = [regex]::Match($createOutput, $uuidPattern)
            if (-not $match.Success) {
                throw "Created '$($t.DbName)' but could not find its database_id in wrangler's output."
            }
            $databaseId = $match.Value
            Write-Host "  Created (id: $databaseId)" -ForegroundColor Green
        }

        if (-not $databaseId) {
            throw "Could not determine the database_id for '$($t.DbName)'."
        }

        Sync-DatabaseId -Section $t.Section -NewId $databaseId

        Write-Host "Applying schema (safe to repeat: CREATE TABLE IF NOT EXISTS)..."
        npx wrangler d1 execute $t.DbName --config wrangler.toml --env $t.Env --remote --file=schema.sql
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to apply schema to '$($t.DbName)'."
        }
        Write-Host "  Schema OK." -ForegroundColor Green
    }

    Write-Host "`nAll requested D1 databases are ready." -ForegroundColor Green

    if ($SkipDev) {
        Write-Host "`n-SkipDev was set, not starting a local server." -ForegroundColor DarkGray
    }
    else {
        Write-Host "`nStarting the local API dev server (http://localhost:8787)..." -ForegroundColor Cyan
        Write-Host "This uses Wrangler's LOCAL D1 emulation, not the real staging/production databases." -ForegroundColor DarkGray
        Write-Host "In another terminal, run the site with 'npm run dev' (repo root) or start.bat -" -ForegroundColor DarkGray
        Write-Host "make sure its .env has PUBLIC_API_BASE=http://localhost:8787 to talk to this server." -ForegroundColor DarkGray
        Write-Host "Press Ctrl+C to stop.`n" -ForegroundColor DarkGray
        npm run dev
    }
}
finally {
    Pop-Location
}
