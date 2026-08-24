# ==============================================================================
# TPC Agent Setup Script (Non-Admin / HKCU Registry Method)
# ==============================================================================

# 1. Set Working Directory and Paths
$projectDir   = "C:\tpc\agent"
$bunExe       = "C:\Tools\Bun\bin\bun.exe"
$electronExe  = "$projectDir\node_modules\electron\dist\electron.exe"
$launcherPath = "$projectDir\start-agent.bat"
$logDir       = "$projectDir\logs"

Set-Location -Path $projectDir

# 2. Ensure Logs Directory Exists
if (-not (Test-Path -Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# 3. Install App Dependencies via Bun
Write-Host "Installing dependencies using Bun..." -ForegroundColor Cyan
& $bunExe install

# 4. Create the Batch File Wrapper (Handles Infinite Restart on Crash + Logging)
Write-Host "Creating startup launcher batch file..." -ForegroundColor Cyan
$batContent = @"
@echo off
cd /d "$projectDir"

:loop
echo [%date% %time%] Starting TPC Agent Electron App... >> "$logDir\launcher.log"

:: Run Electron app
"$electronExe" . >> "$logDir\app-out.log" 2>> "$logDir\app-err.log"

echo [%date% %time%] App crashed or exited. Restarting in 5 seconds... >> "$logDir\launcher.log"
timeout /t 5 /nobreak >nul
goto loop
"@

Set-Content -Path $launcherPath -Value $batContent -Encoding ASCII

# 5. Register in HKCU (Run on Logon for Current User - No Admin Required)
Write-Host "Registering app in HKCU Registry Run key..." -ForegroundColor Cyan
$registryPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
$registryName = "TPC-Agent-User"

# Set launcher to run hidden in background on Windows logon
$vbsLauncherPath = "$projectDir\start-hidden.vbs"
$vbsContent = @"
CreateObject("Wscript.Shell").Run """" & "$launcherPath" & """", 0, False
"@
Set-Content -Path $vbsLauncherPath -Value $vbsContent -Encoding ASCII

# Add VBS script to Registry so CMD window stays invisible at logon
Set-ItemProperty -Path $registryPath -Name $registryName -Value "wscript.exe `"$vbsLauncherPath`""

Write-Host "Registry entry updated successfully!" -ForegroundColor Green

# 6. Launch the Process Immediately
Write-Host "Starting TPC Agent process..." -ForegroundColor Cyan
Start-Process -FilePath "wscript.exe" -ArgumentList "`"$vbsLauncherPath`"" -WorkingDirectory $projectDir

Write-Host "Setup complete! App is running and configured to start at logon." -ForegroundColor Green