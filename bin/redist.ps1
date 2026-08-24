# Set error handling and protocol
$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Direct Microsoft permalink for the x64 installer
$url = "https://aka.ms/vc14/vc_redist.x64.exe"
$outputFile = "$env:TEMP\vc_redist.x64.exe"

Write-Host "Downloading Visual C++ Redistributable..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $url -OutFile $outputFile

Write-Host "Installing VC++ Redistributable silently..." -ForegroundColor Cyan
$process = Start-Process -FilePath $outputFile -ArgumentList "/install", "/quiet", "/norestart" -Wait -PassThru

# Check installation status
if ($process.ExitCode -eq 0) {
    Write-Host "Successfully installed VC++ Redistributable!" -ForegroundColor Green
} elseif ($process.ExitCode -eq 3010) {
    Write-Host "Installed successfully (reboot required)." -ForegroundColor Yellow
} else {
    Write-Host "Installation failed with exit code: $($process.ExitCode)" -ForegroundColor Red
}

# Cleanup installer
Remove-Item -Path $outputFile -Force -ErrorAction SilentlyContinue