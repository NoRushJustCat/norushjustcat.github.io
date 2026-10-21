@echo off
REM ------------------------------------------------------------------
REM demarrer.bat — Version Windows de demarrer.sh.
REM Ouvre http://localhost:8000 pour afficher les projets JSON.
REM ------------------------------------------------------------------
cd /d "%~dp0"
set PORT=%1
if "%PORT%"=="" set PORT=8000

echo.
echo   Portfolio NoRushJustChat
echo   ^> Ouvre http://localhost:%PORT% dans ton navigateur
echo   ^> Arret : Ctrl + C
echo.
start "" "http://localhost:%PORT%"
python -m http.server %PORT%
