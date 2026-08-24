@echo off
echo === Installing Node.js LTS ===
winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements

:: Refresh Environment Variables so PATH updates without closing the window
call refreshenv 2>nul || (
    set "PATH=%SystemRoot%\system32;%SystemRoot%;%SystemDrive%\Program Files\nodejs;%PATH%"
)

echo.
echo === Installing Bun to C:\Tools\Bun ===
powershell -Command "$env:BUN_INSTALL='C:\Tools\Bun'; irm bun.sh/install.ps1 | iex"

echo.
echo === Installing PM2 Packages ===
call npm install -g pm2 pm2-windows-service

echo.
echo === Setting up PM2 Windows Service ===
call npm install -g pm2 pm2-windows-service
call pm2-service-install -n PM2_Service

echo.
echo === Installing Privileged Service ===
powershell -ExecutionPolicy Bypass -File "C:\tpc\privileged\install.ps1"

echo.
echo === Setup Complete! ===
pause