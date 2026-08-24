import { Service } from 'node-windows';

const svc = new Service({
  name: 'TPC-Agent',
  description: 'TPC-Agent',
  
  script: 'C:\\tpc\\agent\\index.js',   
  execPath: 'C:\\tpc\\agent\\node_modules\\electron\\dist\\electron.exe',
  
  workingDirectory: 'C:\\tpc\\agent',
  wait: 2,
  grow: 0.25,
  maxRestarts: 40
});

svc.on('install', function() {
  console.log('Service installed successfully!');
  svc.start();
});

svc.install();