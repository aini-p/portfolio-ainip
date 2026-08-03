# cleanup-content.ps1
# Delete all article MDX files under artworks/doujinshi and delete image files
# referenced from those articles, unless the image is also referenced elsewhere.
#
# Usage:
#   Dry run (no deletion): .\cleanup-content.ps1
#   Delete for real:       .\cleanup-content.ps1 -Force

param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1) Collect article files
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

# 2) Build image index by basename
$imageMap = @{}
foreach ($imgDir in $imageDirs) {
    if (Test-Path $imgDir) {
        Get-ChildItem -Path $imgDir -File | ForEach-Object {
            $key = $_.BaseName.ToLowerInvariant()
            if (-not $imageMap.ContainsKey($key)) {
                $imageMap[$key] = $_.FullName
            }
        }
    }
}

# 3) Parse image references from articles
$referencedImagePaths = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

foreach ($file in $articleFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

    # Matches "../_images/filename.ext"
    [regex]::Matches($content, '"\.\./_images/([^"]+)"') | ForEach-Object {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($_.Groups[1].Value).ToLowerInvariant()
        if ($imageMap.ContainsKey($baseName)) {
            $null = $referencedImagePaths.Add($imageMap[$baseName])
        }
    }

    # Matches relatedImages: ["id1", "id2", ...]
    $riBlock = [regex]::Match($content, 'relatedImages:\s*\[([^\]]*)\]')
    if ($riBlock.Success) {
        [regex]::Matches($riBlock.Groups[1].Value, '"([0-9a-fA-F]{16})"') | ForEach-Object {
            $id = $_.Groups[1].Value.ToLowerInvariant()
            if ($imageMap.ContainsKey($id)) {
                $null = $referencedImagePaths.Add($imageMap[$id])
            }
        }
    }
}

Write-Host "Images referenced by articles: $($referencedImagePaths.Count)" -ForegroundColor Cyan

# 4) Collect non-article content to detect external references
$articlePathSet = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($f in $articleFiles) {
    $null = $articlePathSet.Add($f.FullName)
}

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
        -not $articlePathSet.Contains($_.FullName)
    } | ForEach-Object {
        $text = Get-Content -Path $_.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
        if ($text) {
            $null = $otherFilesContent.Append($text)
        }
    }
}
$otherContent = $otherFilesContent.ToString()

# 5) Split into delete/keep lists
$imagesToDelete = [System.Collections.Generic.List[string]]::new()
$imagesToKeep = [System.Collections.Generic.List[string]]::new()

foreach ($imgPath in $referencedImagePaths) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($imgPath)
    if ($otherContent -match [regex]::Escape($baseName)) {
        $imagesToKeep.Add($imgPath)
    }
    else {
        $imagesToDelete.Add($imgPath)
    }
}

# 6) Print summary
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

Write-Host "`nDone." -ForegroundColor Green
Write-Host "  Article files deleted: $($articleFiles.Count)" -ForegroundColor Green
Write-Host "  Image files deleted:   $($imagesToDelete.Count)" -ForegroundColor Green
Write-Host "  Images kept:           $($imagesToKeep.Count)" -ForegroundColor Green
