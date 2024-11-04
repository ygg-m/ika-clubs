@echo off
echo Checking Python installation...

REM Try to find Python in common locations
set PYTHON_CMD=
where python > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set PYTHON_CMD=python
) else (
    where py > nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        set PYTHON_CMD=py
    ) else (
        if exist "C:\Python39\python.exe" (
            set PYTHON_CMD=C:\Python39\python.exe
        ) else if exist "C:\Python310\python.exe" (
            set PYTHON_CMD=C:\Python310\python.exe
        ) else if exist "C:\Python311\python.exe" (
            set PYTHON_CMD=C:\Python311\python.exe
        ) else if exist "C:\Program Files\Python39\python.exe" (
            set PYTHON_CMD="C:\Program Files\Python39\python.exe"
        ) else if exist "C:\Program Files\Python310\python.exe" (
            set PYTHON_CMD="C:\Program Files\Python310\python.exe"
        ) else if exist "C:\Program Files\Python311\python.exe" (
            set PYTHON_CMD="C:\Program Files\Python311\python.exe"
        )
    )
)

if "%PYTHON_CMD%"=="" (
    echo Python was not found on your system!
    echo Please make sure Python is installed and added to your PATH.
    echo You can download Python from https://www.python.org/downloads/
    echo.
    echo Press any key to exit...
    pause > nul
    exit /b 1
)

echo Found Python at: %PYTHON_CMD%
echo Running script...
echo.

%PYTHON_CMD% "%~dp0_Merge Angular Files.py"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo An error occurred while running the script.
    echo Press any key to exit...
    pause > nul
    exit /b 1
)

pause