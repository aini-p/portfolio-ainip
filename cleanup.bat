@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "PS1_PATH=%SCRIPT_DIR%cleanup.ps1"

if not exist "%PS1_PATH%" (
  echo [ERROR] cleanup.ps1 was not found: "%PS1_PATH%"
  exit /b 1
)

rem Double-clicking this file with no arguments runs a DRY RUN (preview only,
rem nothing is deleted or touched). Pass -Force to actually delete files and
rem apply to the local dev D1 database. Add -Remote as well to apply to the
rem production D1 database (irreversible). Add -SkipDb to skip the database
rem step entirely (e.g. if wrangler/D1 isn't set up). Add -ImagesOnly to keep
rem every article and only delete images that aren't referenced anywhere.
set "ARGS="

:parse
if "%~1"=="" goto :run
if /I "%~1"=="-Force" set "ARGS=%ARGS% -Force"
if /I "%~1"=="/Force" set "ARGS=%ARGS% -Force"
if /I "%~1"=="-Remote" set "ARGS=%ARGS% -Remote"
if /I "%~1"=="/Remote" set "ARGS=%ARGS% -Remote"
if /I "%~1"=="-SkipDb" set "ARGS=%ARGS% -SkipDb"
if /I "%~1"=="/SkipDb" set "ARGS=%ARGS% -SkipDb"
if /I "%~1"=="-ImagesOnly" set "ARGS=%ARGS% -ImagesOnly"
if /I "%~1"=="/ImagesOnly" set "ARGS=%ARGS% -ImagesOnly"
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
