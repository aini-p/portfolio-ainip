@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "PS1_PATH=%SCRIPT_DIR%cleanup-db.ps1"

if not exist "%PS1_PATH%" (
  echo [ERROR] cleanup-db.ps1 was not found: "%PS1_PATH%"
  exit /b 1
)

rem Unlike cleanup-content.bat, this defaults to a DRY RUN (preview only).
rem Pass -Force to apply to the local dev D1 database, and -Force -Remote
rem to apply to the production D1 database (irreversible).
set "ARGS="

:parse
if "%~1"=="" goto :run
if /I "%~1"=="-Force" set "ARGS=%ARGS% -Force"
if /I "%~1"=="/Force" set "ARGS=%ARGS% -Force"
if /I "%~1"=="-Remote" set "ARGS=%ARGS% -Remote"
if /I "%~1"=="/Remote" set "ARGS=%ARGS% -Remote"
shift
goto :parse

:run
where pwsh >nul 2>nul
if "%ERRORLEVEL%"=="0" (
  echo Running: pwsh -NoProfile -ExecutionPolicy Bypass -File "%PS1_PATH%"%ARGS%
  pwsh -NoProfile -ExecutionPolicy Bypass -File "%PS1_PATH%"%ARGS%
) else (
  echo Running: powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1_PATH%"%ARGS%
  powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1_PATH%"%ARGS%
)
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  echo [ERROR] Script execution failed. exit code: %EXIT_CODE%
  exit /b %EXIT_CODE%
)

echo Done.
exit /b 0
