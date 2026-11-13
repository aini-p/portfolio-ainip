# start.batから呼ばれる。開発サーバーの準備状況(/__dev-status)をコンソールに表示し、
# サーバーが応答したらブラウザを開く(準備中はブラウザ側にも進捗付きの待機ページが出る)
$base = 'http://localhost:4321'
$sw = [Diagnostics.Stopwatch]::StartNew()
$opened = $false
$last = ''
for ($i = 0; $i -lt 1800; $i++) {
  try {
    $s = Invoke-RestMethod "$base/__dev-status" -TimeoutSec 5
    if (-not $opened) { Start-Process "$base/"; $opened = $true }
    $line = if ($s.phase -eq 'images' -and $s.total) { "$($s.message) $($s.done)/$($s.total)" } else { $s.message }
    if ($line -ne $last) {
      Write-Host ("[dev] {0} ({1:N0}s)" -f $line, $sw.Elapsed.TotalSeconds) -ForegroundColor Cyan
      $last = $line
    }
    if (-not $s.busy) {
      Write-Host ("[dev] Ready in {0:N0}s - {1}/" -f $sw.Elapsed.TotalSeconds, $base) -ForegroundColor Green
      break
    }
  } catch { }
  Start-Sleep -Milliseconds 500
}
