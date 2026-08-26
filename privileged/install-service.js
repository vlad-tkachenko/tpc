import { Service } from 'node-windows';

const svc = new Service({
  name: 'TPC-Privileged',
  description: 'TPC-Privileged',
  script: 'C:\\tpc\\privileged\\index.js',   
  execPath: 'C:\\Tools\\Bun\\bin\\bun.exe',
  
  // Passes "bun run start" to package.json directory
  scriptOptions: ['run'], 

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