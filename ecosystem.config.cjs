module.exports = {
  apps: [
    {
      name: 'hindonix-api',
      script: 'npx',
      args: 'tsx server/index.ts',
      cwd: '/var/www/hindonix',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        API_PORT: '3001',
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '300M',
      log_file: '/var/log/hindonix/combined.log',
      out_file: '/var/log/hindonix/out.log',
      error_file: '/var/log/hindonix/error.log',
      time: true,
    },
  ],
};
