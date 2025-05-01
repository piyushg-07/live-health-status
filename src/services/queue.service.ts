import { getRabbitChannel } from '../config/rabbitmq';
import { logger } from '../utils/logger';

export class QueueService {
  static async publishUpdate(message: object) {
    try {
      const ch = getRabbitChannel();
      ch.sendToQueue(
        'health_updates',
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );
    } catch (err) {
      logger.error('Failed to publish to queue', err);
    }
  }
}
