import amqp, { Channel } from 'amqplib';
import { config } from './index';
import { logger } from '../utils/logger';

let channel: Channel;

export async function connectRabbit() {
  try {
    const conn = await amqp.connect(config.rabbitUrl);
    channel = await conn.createChannel();
    await channel.assertQueue('health_updates', { durable: true });
    logger.info('Connected to RabbitMQ');
  } catch (err) {
    logger.error('RabbitMQ connection error', err);
    process.exit(1);
  }
}

export function getRabbitChannel(): Channel {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
}
