@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "PS1_PATH=%SCRIPT_DIR%cleanup-content.ps1"

if not exist "%PS1_PATH%" (
  echo [ERROR] cleanup-content.ps1 が見つかりません: "%PS1_PATH%"
  exit /b 1
)

set "FORCE_ARG="
if /I "%~1"=="-Force" set "FORCE_ARG=-Force"
if /I "%~1"=="/Force" set "FORCE_ARG=-Force"

echo 実行: "%PS1_PATH%" %FORCE_ARG%
powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1_PATH%" %FORCE_ARG%
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  echo [ERROR] スクリプト実行に失敗しました。exit code: %EXIT_CODE%
  exit /b %EXIT_CODE%
)

echo 完了しました。
exit /b 0
