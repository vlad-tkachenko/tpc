const Service = require('node-windows').Service;

const svc = new Service({
  name: 'TPC-Privileged',
  description: 'TPC-Privileged',
  
  // Point script to package.json so node-windows validates the path
  script: 'C:\\tpc\\privileged\\package.json', 
  
  execPath: 'C:\\Tools\\Bun\\bin\\bun.exe',
  
  // Passes "bun run start" to package.json directory
  scriptOptions: ['run', 'start'], 

  workingDirectory: 'C:\\tpc\\privileged',
  wait: 2,
  grow: 0.25,
  maxRestarts: 40
});

svc.on('install', function() {
  console.log('Service installed successfully!');
  svc.start();
});

svc.install();