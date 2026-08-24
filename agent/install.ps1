[System.Environment]::SetEnvironmentVariable("PM2_HOME", "$env:USERPROFILE\.pm2-user", "User")

# Start your service application
cd C:\tpc\agent
C:\Tools\Bun\bin\bun.exe install
pm2 start ecosystem.config.cjs

# Save the process list so it restores on system reboot
pm2 save