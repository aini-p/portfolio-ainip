# cleanup-db.ps1
# Run this AFTER cleanup-content.ps1 (or whenever articles are deleted).
#
# Articles are plain MDX files (see cleanup-content.ps1), but the "likes" feature
# stores its own rows in a separate Cloudflare D1 database (worker/schema.sql),
# keyed by article slug with no foreign key to the content files:
#   likes(slug, count)
#   like_votes(slug, ip_hash, created_at)
# Deleting an article leaves its rows behind forever unless this is run. Both
# tables are safe to fully empty - worker/src/index.ts treats a missing "likes"
# row as count = 0, so the site keeps working correctly with zero rows.
#
# This script never touches the database by itself. It always generates the
# DELETE statements and writes them to worker/.generated-cleanup.sql for review.
#
# Usage:
#   Preview only (no DB touched):      .\cleanup-db.ps1
#   Apply to local dev D1 (safe):      .\cleanup-db.ps1 -Force
#   Apply to production D1 (careful):  .\cleanup-db.ps1 -Force -Remote

param(
    [switch]$Force,
    [switch]$Remote,
    [string]$DatabaseName = "at5fun-db"
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$workerDir = Join-Path $rootDir "worker"

# 1) Collect slugs of articles that still exist on disk (normally none, since
#    this is meant to run right after cleanup-content.ps1 removes them all)
$articleDirs = @(
    (Join-Path $rootDir "src\content\artworks\ja"),
    (Join-Path $rootDir "src\content\artworks\en"),
    (Join-Path $rootDir "src\content\doujinshi\ja"),
    (Join-Path $rootDir "src\content\doujinshi\en")
)

$remainingSlugs = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($dir in $articleDirs) {
    if (Test-Path $dir) {
        Get-ChildItem -Path $dir -Filter "*.mdx" -File | ForEach-Object {
            $null = $remainingSlugs.Add($_.BaseName)
        }
    }
}

Write-Host "Remaining article slugs: $($remainingSlugs.Count)" -ForegroundColor Cyan
foreach ($slug in $remainingSlugs) {
    Write-Host "  KEEP slug: $slug" -ForegroundColor Green
}

# 2) Build the DELETE statements. A slug is only worth keeping in the DB if a
#    matching article still exists; when none remain, both tables are wiped
#    entirely (still valid - see schema.sql / worker/src/index.ts).
function New-DeleteSql {
    param([string]$Table)

    if ($remainingSlugs.Count -eq 0) {
        return "DELETE FROM $Table;"
    }

    $quoted = $remainingSlugs | ForEach-Object { "'" + ($_ -replace "'", "''") + "'" }
    $list = $quoted -join ", "
    return "DELETE FROM $Table WHERE slug NOT IN ($list);"
}

$sql = @(
    New-DeleteSql -Table "like_votes"
    New-DeleteSql -Table "likes"
) -join "`n"

Write-Host "`nGenerated SQL:" -ForegroundColor Cyan
Write-Host $sql

if (-not (Test-Path $workerDir)) {
    Write-Host "[ERROR] worker/ directory not found - cannot continue." -ForegroundColor Red
    exit 1
}

$sqlPath = Join-Path $workerDir ".generated-cleanup.sql"
Set-Content -Path $sqlPath -Value $sql -Encoding UTF8
Write-Host "`nSQL written to: $sqlPath" -ForegroundColor Cyan

if (-not $Force) {
    Write-Host "`n[DRY RUN] Database was not touched." -ForegroundColor Magenta
    Write-Host "  Re-run with -Force to apply to the LOCAL dev D1 database." -ForegroundColor Magenta
    Write-Host "  Add -Remote as well to apply to the PRODUCTION D1 database (irreversible)." -ForegroundColor Magenta
    exit 0
}

$target = if ($Remote) { "--remote" } else { "--local" }
if ($Remote) {
    Write-Host "`n[WARNING] Applying to the PRODUCTION D1 database ($DatabaseName)." -ForegroundColor Red
}
else {
    Write-Host "`nApplying to the LOCAL dev D1 database ($DatabaseName)..." -ForegroundColor Yellow
}

Push-Location $workerDir
try {
    npx wrangler d1 execute $DatabaseName $target --file=".generated-cleanup.sql"
}
finally {
    Pop-Location
}

Write-Host "`nDone." -ForegroundColor Green
