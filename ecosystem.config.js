module.exports = {
    apps: [
      {
        name: 'my-app',
        script: './app.js',
        instances: 4, // Or 'max' to scale to maximum available CPUs
        exec_mode: 'cluster', // Or 'fork' for single instance
        max_memory_restart: '1G', // Restart if memory usage exceeds 1GB
        env: {
          NODE_ENV: 'development',
          PORT: 3000
        },
        env_production: {
          NODE_ENV: 'production',
          PORT: 8080
        },
        log_date_format: 'YYYY-MM-DD HH:mm Z',
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        merge_logs: true,
        autorestart: true,
        watch: false, // Set to true to enable watching files and auto restart on change
      }
    ],
  };