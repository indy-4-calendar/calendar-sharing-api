import mongoose from 'mongoose';

import config from '@/constants';
import logger from '@/lib/logger';

/**
 * Establish a connection to the database
 * Wait for the connection then log the database
 * environment and the database name
 */
const connect = async () => {
  await mongoose.connect(config.DBUri, {
    dbName: config.DBName,
  });

  // If there is an error during the connection
  // Abort the process and log the error
  mongoose.connection.on('error', (err) => {
    logger.error(err);
    process.exit(1);
  });

  mongoose.connection.on('disconnected', () => {});

  logger.info(`Connected to database: ${config.DBName}`);
};

const disconnect = async () => {
  mongoose.connection.close();
};

export default {
  connect,
  disconnect,
};
