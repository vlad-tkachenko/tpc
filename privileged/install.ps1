$env:PM2_HOME = "C:\ProgramData\pm2-admin"

[System.Environment]::SetEnvironmentVariable("PM2_HOME", "C:\ProgramData\pm2-admin", "Machine")

# Start your service application
cd C:\tpc\privileged
C:\Tools\Bun\bin\bun.exe install
pm2 start ecosystem.config.cjs

# Save the process list so it restores on system reboot
pm2 save