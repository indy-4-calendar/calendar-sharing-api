import app from '@/app';
import cron from '@/cron';
import config from '@/constants';
import database from '@/database';
import logger from '@/lib/logger';

/**
 * Sequence of events:
 * 1. Connect to the database
 * 2. Start the http server
 * 4. If in dev env, create a listener for keypresses to restart the server
 */

database.connect().then(async () => {
  /**
   * Start the http server on the specified port and env
   */
  app.listen(config.Port, async () => {
    logger.info(`Server environment: ${config.NodeEnv}`);
    logger.info(`Server listening on port: ${config.Port}`);
  });

  /**
   * Start the cron jobs for the application to run
   */
  cron.startJobs();

  /**
   * If we are in a dev env, we want to be able to clear the console by
   * pressing 'c' in the console. Also ensure that we can exit the process
   */
  if (config.IsDevelopmentEnv) {
    process.stdin.setRawMode(true).on('data', (key) => {
      if (key.toString().toLowerCase() === 'c') {
        process.stdout.write('\x1Bc');
        logger.info('Console cleared!');
      }

      // Check for control + c
      if (key.toString().charCodeAt(0) === 3) {
        process.exit();
      }
    });
  }
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception thrown', err);
});
