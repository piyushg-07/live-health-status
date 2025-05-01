import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || '4000',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  db: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
  },
  redisUrl: process.env.REDIS_URL!,
  rabbitUrl: process.env.RABBITMQ_URL!,
};
