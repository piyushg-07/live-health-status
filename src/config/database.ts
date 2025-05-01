import { Pool } from 'pg';
import { config } from './index';
import { logger } from '../utils/logger';

export const dbPool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

dbPool.on('error', (err: Error) => {
  logger.error('Unexpected PG client error', err);
  process.exit(-1);
});
