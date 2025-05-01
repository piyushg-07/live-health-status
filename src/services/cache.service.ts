import { redisClient } from '../config/redis';

const TTL_SECONDS = 300;

export class CacheService {
  static async get(key: string): Promise<string | null> {
    return redisClient.get(key);
  }
  static async set(key: string, value: string): Promise<void> {
    await redisClient.setEx(key, TTL_SECONDS, value);
  }
  static async del(key: string): Promise<void> {
    await redisClient.del(key);
  }
}
