// src/consumers/healthUpdates.consumer.ts
import { getRabbitChannel } from '../config/rabbitmq';
import { broadcastSSE } from '../realtime/sse';
import { broadcastSocket } from '../realtime/socket';
import { logger } from '../utils/logger';

export async function startConsumer(): Promise<void> {
  const ch = await getRabbitChannel();
  await ch.assertQueue('health_updates', { durable: true });

  await ch.consume(
    'health_updates',
    msg => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());
      const { action } = data; // e.g. 'create' or 'update'

      // 1) SSE: send full payload to any EventSource listeners
      broadcastSSE(data);

      // 2) Socket.IO: send lightweight notification
      broadcastSocket(
        `record_${action}`,       // e.g. 'record_create' or 'record_update'
        {
          message: `Record ${action}d`,
          timestamp: new Date().toISOString(),
        }
      );

      ch.ack(msg);
    },
    { noAck: false }
  );

  logger.info('RabbitMQ consumer started with SSE + Socket.IO notifications');
}
