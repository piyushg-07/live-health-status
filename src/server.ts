import http from 'http';
import { app } from './index';
import { config } from './config';
import { connectRedis } from './config/redis';
import { connectRabbit } from './config/rabbitmq';
import { initSocket } from './realtime/socket';
import { startConsumer } from './consumers/healthUpdates.consumer';

async function bootstrap() {
  await connectRedis();
  await connectRabbit();

  const server = http.createServer(app);

  // replace native WS init with Socket.IO
  initSocket(server);

  startConsumer();

  server.listen(config.port, () =>
    console.log(`Server listening on port ${config.port}`)
  );
}

bootstrap().catch(err => {
  console.error('Startup error', err);
  process.exit(1);
});
