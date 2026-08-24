# 1. Install dependencies
cd C:\tpc\agent
C:\Tools\Bun\bin\bun.exe install

# Path to electron binary inside node_modules
$electronExe = "C:\tpc\agent\node_modules\electron\dist\electron.exe"

# Pass current directory '.' so Electron loads package.json main entry point
$action = New-ScheduledTaskAction -Execute $electronExe -Argument "." -WorkingDirectory "C:\tpc\agent"
$trigger = New-ScheduledTaskTrigger -AtLogOn

$settings = New-ScheduledTaskSettingsSet `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -ExecutionTimeLimit (New-TimeSpan -Hours 0)

Register-ScheduledTask -TaskName "TPC-Agent-User" `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -User $env:USERNAME `
    -Force

Start-ScheduledTask -TaskName "TPC-Agent-User"