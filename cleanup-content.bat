@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "PS1_PATH=%SCRIPT_DIR%cleanup-content.ps1"

if not exist "%PS1_PATH%" (
  echo [ERROR] cleanup-content.ps1 was not found: "%PS1_PATH%"
  exit /b 1
)

set "FORCE_ARG=-Force"
if /I "%~1"=="-DryRun" set "FORCE_ARG="
if /I "%~1"=="/DryRun" set "FORCE_ARG="
if /I "%~1"=="-Preview" set "FORCE_ARG="
if /I "%~1"=="/Preview" set "FORCE_ARG="

where pwsh >nul 2>nul
if "%ERRORLEVEL%"=="0" (
  echo Running: pwsh -NoProfile -ExecutionPolicy Bypass -File "%PS1_PATH%" %FORCE_ARG%
  pwsh -NoProfile -ExecutionPolicy Bypass -File "%PS1_PATH%" %FORCE_ARG%
) else (
  echo Running: powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1_PATH%" %FORCE_ARG%
  powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1_PATH%" %FORCE_ARG%
)
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  echo [ERROR] Script execution failed. exit code: %EXIT_CODE%
  exit /b %EXIT_CODE%
)

echo Done.
exit /b 0
