module.exports = {
  apps: [
    {
      name: "tpc-privileged",
      script: "index.js",
      cwd: "C:/tpc/privileged",
      interpreter: "C:/Tools/Bun/bin/bun.exe",
      interpreter_args: "run",
      autorestart: true,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};