# Start your service application
cd C:\tpc\agent
pm2 start ecosystem.config.js

# Save the process list so it restores on system reboot
pm2 save