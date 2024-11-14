import cron from 'node-cron';
import { exec } from 'child_process';
import config from '../src/config/index.js';
import logger from '../src/utils/logger.js';

const backupDatabase = () => {
  const filename = `backup-${new Date().toISOString()}.sql`;
  const command = `PGPASSWORD="${config.dbPassword}" pg_dump -U ${config.dbUser} -h ${config.dbHost} -d ${config.dbName} > ${filename}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Error during backup: ${error.message}`);
      return;
    }
    if (stderr) {
      logger.error(`Backup stderr: ${stderr}`);
      return;
    }
    logger.info(`Database backup created: ${filename}`);
  });
};

// Schedule backup every day at 2:00 AM
cron.schedule('0 2 * * *', () => {
  logger.info('Running scheduled database backup');
  backupDatabase();
});

logger.info('Database backup scheduler initialized');