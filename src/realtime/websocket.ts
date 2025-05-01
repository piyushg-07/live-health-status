import WebSocket from 'ws';
import http from 'http';
import { logger } from '../utils/logger';

let wss: WebSocket.Server;

export function initWebSocket(server: http.Server) {
  wss = new WebSocket.Server({ server, path: '/ws' });
  wss.on('connection', ws => {
    logger.info('WebSocket client connected');
  });
}

export function broadcastWS(data: any) {
  if (!wss) return;
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}
