import { createClient } from 'redis';
import { config } from './index';
import { logger } from '../utils/logger';

export const redisClient = createClient({ url: config.redisUrl });

redisClient.on('error', err => {
  logger.error('Redis Client Error', err);
});

export async function connectRedis() {
  await redisClient.connect();
  logger.info('Connected to Redis');
}
