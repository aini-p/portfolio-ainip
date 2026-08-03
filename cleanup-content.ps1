# cleanup-content.ps1
# artworks / doujinshi の全記事 MDX と、そこからのみ参照されている画像を削除するスクリプト
#
# 使い方:
#   プレビュー（何も削除しない）: .\cleanup-content.ps1
#   実際に削除する:               .\cleanup-content.ps1 -Force

param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# ──────────────────────────────────────────────
# 1. 記事 MDX ファイルを収集
# ──────────────────────────────────────────────
$articleDirs = @(
    (Join-Path $rootDir "src\content\artworks\ja"),
    (Join-Path $rootDir "src\content\artworks\en"),
    (Join-Path $rootDir "src\content\doujinshi\ja"),
    (Join-Path $rootDir "src\content\doujinshi\en")
)

$imagesDirs = @(
    (Join-Path $rootDir "src\content\artworks\_images"),
    (Join-Path $rootDir "src\content\doujinshi\_images")
)

$articleFiles = [System.Collections.Generic.List[System.IO.FileInfo]]::new()
foreach ($dir in $articleDirs) {
    if (Test-Path $dir) {
        Get-ChildItem -Path $dir -Filter "*.mdx" -File | ForEach-Object { $articleFiles.Add($_) }
    }
}

Write-Host "記事ファイル: $($articleFiles.Count) 件" -ForegroundColor Cyan

# ──────────────────────────────────────────────
# 2. 記事から参照されている画像ファイル名を収集
# ──────────────────────────────────────────────
# 各 _images ディレクトリの実在ファイル一覧（basename → フルパス）
$imageMap = @{}
foreach ($imgDir in $imagesDirs) {
    if (Test-Path $imgDir) {
        Get-ChildItem -Path $imgDir -File | ForEach-Object {
            # 拡張子なし basename をキーにする（relatedImages は拡張子なし ID で記録されるため）
            $key = $_.BaseName.ToLower()
            if (-not $imageMap.ContainsKey($key)) {
                $imageMap[$key] = $_.FullName
            }
        }
    }
}

$referencedImagePaths = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

foreach ($file in $articleFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    # "../_images/FILENAME.ext" 形式（src / patreonEmbedImageUrl / packageImage / sampleImages）
    $null = [regex]::Matches($content, '"\.\./_images/([^"]+)"') | ForEach-Object {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($_.Groups[1].Value).ToLower()
        if ($imageMap.ContainsKey($baseName)) {
            $null = $referencedImagePaths.Add($imageMap[$baseName])
        }
    }

    # relatedImages: ["ID1", "ID2", ...] 形式（拡張子なし16進数ID）
    $riBlock = [regex]::Match($content, 'relatedImages:\s*\[([^\]]*)\]')
    if ($riBlock.Success) {
        [regex]::Matches($riBlock.Groups[1].Value, '"([0-9a-fA-F]{16})"') | ForEach-Object {
            $id = $_.Groups[1].Value.ToLower()
            if ($imageMap.ContainsKey($id)) {
                $null = $referencedImagePaths.Add($imageMap[$id])
            }
        }
    }
}

Write-Host "記事から参照されている画像: $($referencedImagePaths.Count) 件" -ForegroundColor Cyan

# ──────────────────────────────────────────────
# 3. 記事以外のファイルのテキストを結合してチェック用文字列を作成
# ──────────────────────────────────────────────
# src/ と public/ の全テキストファイルから記事ファイルを除いたもの
$articlePathSet = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($f in $articleFiles) { $null = $articlePathSet.Add($f.FullName) }

$otherFilesContent = [System.Text.StringBuilder]::new()
$searchDirs = @(
    (Join-Path $rootDir "src"),
    (Join-Path $rootDir "public")
)
foreach ($dir in $searchDirs) {
    if (-not (Test-Path $dir)) { continue }
    Get-ChildItem -Path $dir -Recurse -File | Where-Object {
        -not $articlePathSet.Contains($_.FullName)
    } | ForEach-Object {
        $text = Get-Content $_.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
        if ($text) { $null = $otherFilesContent.Append($text) }
    }
}
$otherContent = $otherFilesContent.ToString()

# ──────────────────────────────────────────────
# 4. 削除対象・保持対象を振り分け
# ──────────────────────────────────────────────
$imagesToDelete = [System.Collections.Generic.List[string]]::new()
$imagesToKeep   = [System.Collections.Generic.List[string]]::new()

foreach ($imgPath in $referencedImagePaths) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($imgPath)
    # 記事以外のどこかに basename が出現するか
    if ($otherContent -match [regex]::Escape($baseName)) {
        $imagesToKeep.Add($imgPath)
    } else {
        $imagesToDelete.Add($imgPath)
    }
}

# ──────────────────────────────────────────────
# 5. 結果を表示
# ──────────────────────────────────────────────
if ($imagesToKeep.Count -gt 0) {
    Write-Host "`n[保持] 記事以外からも参照されている画像 ($($imagesToKeep.Count) 件):" -ForegroundColor Green
    foreach ($img in $imagesToKeep) {
        Write-Host "  KEEP  $img" -ForegroundColor Green
    }
}

Write-Host "`n[削除対象] 記事ファイル ($($articleFiles.Count) 件):" -ForegroundColor Yellow
foreach ($f in $articleFiles) {
    Write-Host "  DEL   $($f.FullName)"
}

Write-Host "`n[削除対象] 画像ファイル ($($imagesToDelete.Count) 件):" -ForegroundColor Yellow
foreach ($img in $imagesToDelete) {
    Write-Host "  DEL   $img"
}

if (-not $Force) {
    Write-Host "`n[DRY RUN] 上記を削除します。実際に削除するには -Force を付けて実行してください。" -ForegroundColor Magenta
    exit 0
}

# ──────────────────────────────────────────────
# 6. 実際に削除
# ──────────────────────────────────────────────
Write-Host "`n削除を開始します..." -ForegroundColor Red

foreach ($f in $articleFiles) {
    Remove-Item $f.FullName -Force
    Write-Host "  削除  $($f.FullName)"
}

foreach ($img in $imagesToDelete) {
    Remove-Item $img -Force
    Write-Host "  削除  $img"
}

Write-Host "`n完了しました。" -ForegroundColor Green
Write-Host "  記事ファイル : $($articleFiles.Count) 件削除" -ForegroundColor Green
Write-Host "  画像ファイル : $($imagesToDelete.Count) 件削除" -ForegroundColor Green
Write-Host "  画像保持     : $($imagesToKeep.Count) 件" -ForegroundColor Green
