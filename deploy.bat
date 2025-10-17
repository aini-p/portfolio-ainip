@echo off
title Astro Production Build

echo ========================================
echo  Starting Astro build for production...
echo ========================================
echo.

REM
REM This command creates an optimized version of your site in the 'dist' folder.
REM

npm run build

REM Check if the build command was successful
if %errorlevel% neq 0 (
    echo.
    echo ******************************************************
    echo  ERROR: Production build failed.
    echo  Please check for error messages above.
    echo ******************************************************
    echo.
) else (
    echo.
    echo ======================================================================
    echo  Build successful!
    echo  Your optimized site has been generated in the 'dist' folder.
    echo  You can now upload the contents of the 'dist' folder to your host.
    echo ======================================================================
    echo.
)

pause