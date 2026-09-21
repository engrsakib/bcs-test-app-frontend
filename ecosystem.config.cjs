/** PM2 — use after `npm run build` from this directory. */
module.exports = {
  apps: [
    {
      name: "frontend-dashboard",
      cwd: __dirname,
      script: ".next/standalone/server.js",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
