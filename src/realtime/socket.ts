import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../utils/logger';

let io: SocketIOServer;

/**
 * Initialize Socket.IO on the given HTTP server under /ws
 */
export function initSocket(server: HttpServer): void {
  io = new SocketIOServer(server, {
    path: '/ws',
    cors: {
      origin: '*', // lock this down in production
    },
  });

  io.on('connection', socket => {
    logger.info(`Socket.IO client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      logger.info(`Socket.IO client disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.IO initialized at path /ws');
}

/**
 * Broadcast a notification to all connected clients.
 * @param event  e.g. 'record_created' or 'record_updated'
 * @param data   minimal payload, e.g. { message: string, timestamp: string }
 */
export function broadcastSocket(event: string, data: Record<string, any>): void {
  if (!io) {
    logger.warn('Cannot broadcast; Socket.IO not initialized yet.');
    return;
  }
  io.emit(event, data);
}
