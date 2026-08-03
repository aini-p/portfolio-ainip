# cleanup-content.ps1
# Delete all article MDX files under artworks/doujinshi and delete every image
# under their _images folders that is not referenced anywhere else in the repo
# (src/ or public/) - including images left orphaned by earlier partial cleanups,
# not just ones directly referenced by the articles being deleted right now.
#
# Usage:
#   Dry run (no deletion): .\cleanup-content.ps1
#   Delete for real:       .\cleanup-content.ps1 -Force

param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1) Collect article files (all of these are always deleted)
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

$articleFiles = [System.Collections.Generic.List[System.IO.FileInfo]]::new()
foreach ($dir in $articleDirs) {
    if (Test-Path $dir) {
        Get-ChildItem -Path $dir -Filter "*.mdx" -File | ForEach-Object {
            $articleFiles.Add($_)
        }
    }
}

Write-Host "Article files found: $($articleFiles.Count)" -ForegroundColor Cyan

$articlePathSet = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($f in $articleFiles) {
    $null = $articlePathSet.Add($f.FullName)
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

Write-Host "`n[DELETE] Article files ($($articleFiles.Count)):" -ForegroundColor Yellow
foreach ($f in $articleFiles) {
    Write-Host "  DEL   $($f.FullName)"
}

Write-Host "`n[DELETE] Image files ($($imagesToDelete.Count)):" -ForegroundColor Yellow
foreach ($img in $imagesToDelete) {
    Write-Host "  DEL   $img"
}

if (-not $Force) {
    Write-Host "`n[DRY RUN] No files were deleted. Re-run with -Force to delete." -ForegroundColor Magenta
    exit 0
}

# 7) Delete files
Write-Host "`nDeleting files..." -ForegroundColor Red

foreach ($f in $articleFiles) {
    Remove-Item -Path $f.FullName -Force
    Write-Host "  Deleted $($f.FullName)"
}

foreach ($img in $imagesToDelete) {
    Remove-Item -Path $img -Force
    Write-Host "  Deleted $img"
}

# 8) Clear Astro cache to avoid stale content references
$astroCacheDir = Join-Path $rootDir ".astro"
if (Test-Path $astroCacheDir) {
    Remove-Item -Path $astroCacheDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  Cleared cache: $astroCacheDir"
}

Write-Host "`nDone." -ForegroundColor Green
Write-Host "  Article files deleted: $($articleFiles.Count)" -ForegroundColor Green
Write-Host "  Image files deleted:   $($imagesToDelete.Count)" -ForegroundColor Green
Write-Host "  Images kept:           $($imagesToKeep.Count)" -ForegroundColor Green
