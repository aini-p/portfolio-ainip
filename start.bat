@echo off
title Astro Project Launcher

echo Checking for required packages...
echo.

REM ブランチ切り替えやpullで依存パッケージが変わった(package-lock.jsonの方が新しい)場合は
REM node_modulesが古いまま起動してエラーになるため、入れ直しの対象にする
set "NEED_INSTALL="
if not exist "node_modules" set "NEED_INSTALL=1"
if exist "node_modules\.package-lock.json" (
    powershell -NoProfile -Command "if ((Get-Item 'package-lock.json').LastWriteTime -gt (Get-Item 'node_modules\.package-lock.json').LastWriteTime) { exit 1 }"
    if errorlevel 1 set "NEED_INSTALL=1"
)

REM node_modulesが無いか古い場合のみ、npm installを実行
if defined NEED_INSTALL (
    echo Dependencies not found. Installing all required packages...
    echo This might take a moment.
    echo.

    REM pnpmロックファイルが存在する場合、npmとの競合を防ぐために削除
    if exist "pnpm-lock.yaml" (
        echo Found pnpm-lock.yaml. Removing it to force npm usage...
        del pnpm-lock.yaml
    )
    
    call npm install

    REM npm installが失敗した場合、エラーを表示して停止する
    REM (ブロック内の%errorlevel%は読み込み時に展開され直前の判定結果が残るため、if errorlevelで実行時の値を見る)
    if errorlevel 1 (
        echo.
        echo ******************************************************
        echo  ERROR: Package installation failed.
        echo  Please check for error messages above.
        echo  Make sure you have Node.js installed on this PC.
        echo ******************************************************
        echo.
        pause
        exit /b
    )
    
    echo.
    echo Installation complete!
    echo.
)

echo Starting Astro development server...
echo To stop the server, close this window or press Ctrl+C in this terminal.
echo The browser opens as soon as the server answers. While it is preparing,
echo the page shows a progress screen and reloads by itself when ready.
echo.

REM サーバーが応答したらすぐブラウザを開き(準備中は進捗付きの待機ページが出る)、
REM このウィンドウにも準備の進捗(/__dev-status)を表示する
start "" /b powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\wait-dev-ready.ps1"

npm run dev

pause