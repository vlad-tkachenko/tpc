export default {
  apps: [
    {
      name: "tpc-client",
      // Path to the Electron executable CLI inside node_modules
      script: "./node_modules/electron/cli.js",
      // Arguments passed to electron ('.' points to main.js / package.json)
      args: ".",
      // Ensure working directory is set to your project root
      cwd: "C:/tpc/agent",
      autorestart: true,
      interpreter: "C:/Tools/Bun/bin/bun.exe",
      interpreter_args: "run",
      env: {
      }
    }
  ]
};