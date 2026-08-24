# Point to the service's PM2 environment
$env:PM2_HOME="C:\ProgramData\pm2"

# Start your service application
cd C:\tpc\privileged
bun install
pm2 start ecosystem.config.js

# Save the process list so it restores on system reboot
pm2 save