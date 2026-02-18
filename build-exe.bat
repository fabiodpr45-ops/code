@echo off
setlocal

echo Installation des dependances...
call npm install
if errorlevel 1 (
  echo Echec npm install
  exit /b 1
)

echo Generation de l'EXE Windows...
call npm run build:win
if errorlevel 1 (
  echo Echec build:win
  exit /b 1
)

echo Terminé. Les fichiers sont dans le dossier dist\
