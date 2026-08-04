@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "PS1_PATH=%SCRIPT_DIR%setup-worker.ps1"

if not exist "%PS1_PATH%" (
  echo [ERROR] setup-worker.ps1 was not found: "%PS1_PATH%"
  exit /b 1
)

rem Double-clicking this file checks/creates the staging + production D1
rem databases for worker/, writes their IDs into worker/wrangler.toml, applies
rem the schema, then starts the API worker's local dev server (Ctrl+C to stop).
rem Add -SkipDev to skip starting the server. Add -Only staging (or
rem -Only production) to touch only one of the two databases.
set "ARGS="

:parse
if "%~1"=="" goto :run
if /I "%~1"=="-SkipDev" set "ARGS=%ARGS% -SkipDev"
if /I "%~1"=="/SkipDev" set "ARGS=%ARGS% -SkipDev"
if /I "%~1"=="-Only" (
  set "ARGS=%ARGS% -Only %~2"
  shift
)
if /I "%~1"=="/Only" (
  set "ARGS=%ARGS% -Only %~2"
  shift
)
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

exit /b 0
