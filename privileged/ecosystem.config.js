module.exports = {
  apps: [
    {
      name: "tpc-privileged", // fixed typo in name if intentional
      script: "./index.js",
      // 1. Use the full absolute path to the project directory
      cwd: "C:/tpc/privileged", 
      autorestart: true,
      // 2. Use the full absolute path to bun.exe (use forward slashes in JS)
      interpreter: "C:/Tools/Bun/bin/bun.exe", 
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};