# Start your service application
cd C:\tpc\agent
bun install
pm2 start ecosystem.config.cjs

# Save the process list so it restores on system reboot
pm2 save