@echo off
set PORT=%1
if "%PORT%"=="" set PORT=8000
python -m http.server %PORT%
