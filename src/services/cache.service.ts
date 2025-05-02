import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';

const TTL_SECONDS = 300;

export class CacheService {
  static async get(key: string): Promise<string | null> {
    // return redisClient.get(key);
    try {
      return await redisClient.get(key);
    } catch (err) {
      logger.warn('Redis GET failed (ignored in test)', err);
      return null;
    }
  }
  static async set(key: string, value: string): Promise<void> {
    // await redisClient.setEx(key, TTL_SECONDS, value);
    try {
      await redisClient.setEx(key, TTL_SECONDS, value);
    } catch (err) {
      logger.warn('Redis SET failed (ignored in test)', err);
    }
  }
  static async del(key: string): Promise<void> {
    // await redisClient.del(key);
    try {
      await redisClient.del(key);
    } catch (err) {
      logger.warn('Redis DEL failed (ignored in test)', err);
    }
  }
}
