@echo off
title Astro Project Launcher

echo Checking for required packages...
echo.

REM node_modulesフォルダが存在しない場合のみ、npm installを実行
if not exist "node_modules" (
    echo Dependencies not found. Installing all required packages...
    echo This might take a moment.
    echo.
    npm install
    
    REM npm installが失敗した場合、エラーを表示して停止する
    if %errorlevel% neq 0 (
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
echo.

npm run dev

pause