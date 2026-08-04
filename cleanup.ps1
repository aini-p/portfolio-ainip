# cleanup.ps1
# One script that does everything:
#   1) Deletes every article (MDX) under artworks/doujinshi (ja/en)
#   2) Deletes every image under their _images folders that is no longer
#      referenced anywhere else in the repo (src/ or public/)
#   3) Purges the matching rows from the Cloudflare D1 "likes"/"like_votes"
#      tables (worker/schema.sql), so nothing is left orphaned there either
#
# Both tables and all content directories stay valid at zero rows/files -
# nothing crashes when everything has been deleted.
#
# Usage:
#   Preview only (nothing is changed):          .\cleanup.ps1
#   Delete files + apply to local dev D1:       .\cleanup.ps1 -Force
#   Delete files + apply to production D1:      .\cleanup.ps1 -Force -Remote
#   Delete files only, skip the D1 step:        .\cleanup.ps1 -Force -SkipDb
#
#   Only sweep orphaned images, keep every article:
#     Preview: .\cleanup.ps1 -ImagesOnly
#     Delete:  .\cleanup.ps1 -ImagesOnly -Force
#   (-ImagesOnly leaves articles untouched, so the D1 step is skipped too -
#   nothing references a slug that no longer has an article, so there's
#   nothing to clean up there.)

param(
    [switch]$Force,
    [switch]$Remote,
    [switch]$SkipDb,
    [switch]$ImagesOnly,
    [string]$DatabaseName = "at5fun-db"
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$workerDir = Join-Path $rootDir "worker"

$articleDirs = @(
    (Join-Path $rootDir "src\content\artworks\ja"),
    (Join-Path $rootDir "src\content\artworks\en"),
    (Join-Path $rootDir "src\content\doujinshi\ja"),
    (Join-Path $rootDir "src\content\doujinshi\en")
)

$imageDirs = @(
    (Join-Path $rootDir "src\content\artworks\_images"),
    (Join-Path $rootDir "src\content\doujinshi\_images")
)

Write-Host "===== STEP 1: articles + images =====" -ForegroundColor Cyan

# 1) Collect article files. Normally every one of these gets deleted; with
#    -ImagesOnly, articles are left alone and only used to figure out which
#    images are still referenced.
$articleFiles = [System.Collections.Generic.List[System.IO.FileInfo]]::new()
foreach ($dir in $articleDirs) {
    if (Test-Path $dir) {
        Get-ChildItem -Path $dir -Filter "*.mdx" -File | ForEach-Object {
            $articleFiles.Add($_)
        }
    }
}

Write-Host "Article files found: $($articleFiles.Count)" -ForegroundColor Cyan

$articleFilesToDelete = if ($ImagesOnly) { [System.Collections.Generic.List[System.IO.FileInfo]]::new() } else { $articleFiles }

$articlePathSet = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
$deletedSlugs = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($f in $articleFilesToDelete) {
    $null = $articlePathSet.Add($f.FullName)
    $null = $deletedSlugs.Add($f.BaseName)
}

# 2) Collect every image under the _images folders - each one is a delete candidate
$imageFiles = [System.Collections.Generic.List[System.IO.FileInfo]]::new()
foreach ($imgDir in $imageDirs) {
    if (Test-Path $imgDir) {
        Get-ChildItem -Path $imgDir -File | ForEach-Object {
            $imageFiles.Add($_)
        }
    }
}

Write-Host "Images under _images folders: $($imageFiles.Count)" -ForegroundColor Cyan

$imagePathSet = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($img in $imageFiles) {
    $null = $imagePathSet.Add($img.FullName)
}

# 3) Build "other content" = every file under src/ and public/ EXCLUDING the
#    article files being deleted and the image files themselves, so an image
#    only survives when something other than an article (or itself) mentions it.
$searchDirs = @(
    (Join-Path $rootDir "src"),
    (Join-Path $rootDir "public")
)

$otherFilesContent = [System.Text.StringBuilder]::new()
foreach ($dir in $searchDirs) {
    if (-not (Test-Path $dir)) {
        continue
    }

    Get-ChildItem -Path $dir -Recurse -File | Where-Object {
        -not $articlePathSet.Contains($_.FullName) -and -not $imagePathSet.Contains($_.FullName)
    } | ForEach-Object {
        $text = Get-Content -Path $_.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
        if ($text) {
            $null = $otherFilesContent.Append($text)
        }
    }
}
$otherContent = $otherFilesContent.ToString()

# 4) Split every image into delete/keep based on whether its filename (the
#    hex id) appears anywhere outside the articles/_images themselves
$imagesToDelete = [System.Collections.Generic.List[string]]::new()
$imagesToKeep = [System.Collections.Generic.List[string]]::new()

foreach ($img in $imageFiles) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($img.Name)
    if ($otherContent -match [regex]::Escape($baseName)) {
        $imagesToKeep.Add($img.FullName)
    }
    else {
        $imagesToDelete.Add($img.FullName)
    }
}

# 5) Print summary
if ($imagesToKeep.Count -gt 0) {
    Write-Host "`n[KEEP] Referenced outside articles ($($imagesToKeep.Count)):" -ForegroundColor Green
    foreach ($img in $imagesToKeep) {
        Write-Host "  KEEP  $img" -ForegroundColor Green
    }
}

if ($ImagesOnly) {
    Write-Host "`n[KEEP] Articles are not touched (-ImagesOnly)." -ForegroundColor Green
}
else {
    Write-Host "`n[DELETE] Article files ($($articleFilesToDelete.Count)):" -ForegroundColor Yellow
    foreach ($f in $articleFilesToDelete) {
        Write-Host "  DEL   $($f.FullName)"
    }
}

Write-Host "`n[DELETE] Image files ($($imagesToDelete.Count)):" -ForegroundColor Yellow
foreach ($img in $imagesToDelete) {
    Write-Host "  DEL   $img"
}

if ($Force) {
    Write-Host "`nDeleting files..." -ForegroundColor Red

    foreach ($f in $articleFilesToDelete) {
        Remove-Item -Path $f.FullName -Force
        Write-Host "  Deleted $($f.FullName)"
    }

    foreach ($img in $imagesToDelete) {
        Remove-Item -Path $img -Force
        Write-Host "  Deleted $img"
    }

    $astroCacheDir = Join-Path $rootDir ".astro"
    if (Test-Path $astroCacheDir) {
        Remove-Item -Path $astroCacheDir -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  Cleared cache: $astroCacheDir"
    }

    Write-Host "`nStep 1 done." -ForegroundColor Green
    Write-Host "  Article files deleted: $($articleFilesToDelete.Count)" -ForegroundColor Green
    Write-Host "  Image files deleted:   $($imagesToDelete.Count)" -ForegroundColor Green
    Write-Host "  Images kept:           $($imagesToKeep.Count)" -ForegroundColor Green
}
else {
    Write-Host "`n[DRY RUN] No files were deleted." -ForegroundColor Magenta
}

# ===================== STEP 2: D1 database (likes / like_votes) =====================
Write-Host "`n===== STEP 2: database (likes / like_votes) =====" -ForegroundColor Cyan

if ($ImagesOnly) {
    Write-Host "[SKIP] No articles are being deleted (-ImagesOnly), so there's nothing to clean up in the database." -ForegroundColor Yellow
}
elseif ($SkipDb) {
    Write-Host "[SKIP] Database step skipped (-SkipDb)." -ForegroundColor Yellow
}
else {
    # Any slug on disk right now that is NOT part of this run's deletion list
    # would still need its DB rows kept. Since step 1 above always deletes
    # every article it finds, this is normally empty - but computing it this
    # way keeps the DB step correct even if a future edit makes step 1
    # selective, or if a file failed to delete.
    $allSlugsOnDisk = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
    foreach ($dir in $articleDirs) {
        if (Test-Path $dir) {
            Get-ChildItem -Path $dir -Filter "*.mdx" -File | ForEach-Object {
                $null = $allSlugsOnDisk.Add($_.BaseName)
            }
        }
    }
    $remainingSlugs = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
    foreach ($slug in $allSlugsOnDisk) {
        if (-not $deletedSlugs.Contains($slug)) {
            $null = $remainingSlugs.Add($slug)
        }
    }

    Write-Host "Remaining article slugs after this run: $($remainingSlugs.Count)" -ForegroundColor Cyan
    foreach ($slug in $remainingSlugs) {
        Write-Host "  KEEP slug: $slug" -ForegroundColor Green
    }

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
        Write-Host "[ERROR] worker/ directory not found - cannot continue with the database step." -ForegroundColor Red
    }
    else {
        $sqlPath = Join-Path $workerDir ".generated-cleanup.sql"
        Set-Content -Path $sqlPath -Value $sql -Encoding UTF8
        Write-Host "`nSQL written to: $sqlPath" -ForegroundColor Cyan

        if (-not $Force) {
            Write-Host "`n[DRY RUN] Database was not touched." -ForegroundColor Magenta
            Write-Host "  Re-run with -Force to apply to the LOCAL dev D1 database." -ForegroundColor Magenta
            Write-Host "  Add -Remote as well to apply to the PRODUCTION D1 database (irreversible)." -ForegroundColor Magenta
        }
        else {
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

            Write-Host "`nStep 2 done." -ForegroundColor Green
        }
    }
}

Write-Host "`nAll done." -ForegroundColor Green
