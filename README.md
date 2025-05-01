# Live Health Status API

A simple Express-TypeScript service for managing and monitoring health records in real-time.

## Project Structure

server/
├── src/
│   ├── config/
│   │   ├── index.ts            # Load env vars & default settings
│   │   ├── database.ts         # PostgreSQL pool/ORM init
│   │   ├── redis.ts            # Redis client setup
│   │   └── rabbitmq.ts         # RabbitMQ connection & channels
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── records.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── records.service.ts
│   │   ├── cache.service.ts     # Redis caching logic
│   │   └── queue.service.ts     # Publish to RabbitMQ
│   │
│   ├── consumers/
│   │   └── healthUpdates.consumer.ts # RabbitMQ message consumer
│   │
│   ├── realtime/
│   │   ├── websocket.ts         # WebSocket server setup
│   │   └── sse.ts               # SSE endpoint setup
│   │
│   ├── models/
│   │   └── record.model.ts      # TypeORM/Prisma schema or pg types
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── records.routes.ts
│   │
│   ├── utils/
│   │   └── logger.ts
│   │
│   ├── middlewares/
│   │   └── auth.middleware.ts   # Token validation
│   │
│   ├── index.ts                 # App entrypoint (Express + HTTP server)
│   └── server.ts                # WS/SSE server bootstrap
│
├── scripts/
│   └── migrate.ts               # DB migrations or seeding
│
├── test/
│   ├── auth.test.ts
│   └── records.test.ts
│
├── public/
│   └── tester.html              # Frontend tester page
│
├── .env.example
├── tsconfig.json
├── package.json
├── docker-compose.yml           # Bring up PostgreSQL, Redis, RabbitMQ
├── .eslintrc.js                 # ESLint config (bonus)
└── README.md                    # Installation & usage docs

## 📁 Project Discription

- `src/config`: Centralizes all external-service connections.  
- `controllers ↔ services`: Keeps Express handlers thin; business logic in services.  
- `routes`: Maps HTTP paths to controllers.  
- `models`: Database schemas or ORM entities.  
- `utils/middlewares`: Cross-cutting concerns (logging, auth).  
- `realtime`: Dedicated peers for WebSocket and SSE.  
- `consumers`: Separate message-queue consumers for resiliency.  
- `public`: Tester HTML + JS.  
- `docker-compose.yml`: Spins up DB, cache, queue for local dev

## Features

- **CRUD** operations on health records (name, age, status)
- **Caching** via Redis
- **Queueing** via RabbitMQ
- **Server-Sent Events** (SSE) for live updates
- **Socket.IO** notifications for lightweight "record created/updated" alerts

---

## Installation & Setup

### Local Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/live-health-status.git
   cd live-health-status
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run DB migrations**
   ```bash
   npx ts-node src/scripts/migrate.ts
   ```

4. **Ensure services are running locally**
   - Redis on `localhost:6379`
   - RabbitMQ on `localhost:5672`
   - PostgreSQL on `localhost:5432`

5. **Start the server**
   ```bash
   npm run dev
   ```

---

### Docker Setup

1. **Build & start all containers**

   ```bash
   docker compose up -d --build
   ```

2. **Run migrations inside the API container**

   ```bash
   docker compose exec api npx ts-node src/scripts/migrate.ts
   ```

3. **Check logs**

   ```bash
   docker compose logs -f api
   docker compose logs -f redis
   docker compose logs -f rabbitmq
   docker compose logs -f postgres
   ```

4. **Rebuild the API image**

   ```bash
   docker compose build api
   ```

5. **Restart your stack**

   ```bash
   docker compose up -d
   ```
   
6. **Stop & clean up**

   ```bash
   docker compose down
   ```

---

## API Endpoints

> All routes are prefixed with `/records`, and require a Bearer token returned by `POST /login`.

| Method | Endpoint               | Description                                              |
| ------ | ---------------------- | -------------------------------------------------------- |
| POST   | `/login`               | Authenticate (body: `{ username, password }`) → `{ token }` |
| GET    | `/records`             | **List all records** (supports pagination via `?page=&limit=`) |
| POST   | `/records`             | Create a new record (body: `{ name, age, status }`)      |
| GET    | `/records/:id`         | Fetch a record by ID                                     |
| PUT    | `/records/:id`         | Update fields (`name`, `age`, `status`)                 |
| DELETE | `/records/:id`         | Delete a record                                          |

---

## Real-Time Updates

- **SSE**  
  Connect to `/sse/health-updates` to receive full JSON payloads for each create/update.

- **Socket.IO**  
  Connect to WS endpoint (`/ws`) and listen for:
  ```js
  socket.on('record_create', ({ message, timestamp }) => { … });
  socket.on('record_update', ({ message, timestamp }) => { … });
  ```

---

## Testing

- **Shell script**
  ```bash
  chmod +x run-tests.sh
  ./run-tests.sh
  ```

- **Dockerized**  
  ```bash
  docker compose exec api bash -lc "./run-tests.sh"
  ```

---

## Additional Commands

- **View API container logs**
  ```bash
  docker compose logs -f api
  ```
- **View Redis logs**
  ```bash
  docker compose logs -f redis
  ```
- **View RabbitMQ logs**
  ```bash
  docker compose logs -f rabbitmq
  ```
- **View Postgres logs**
  ```bash
  docker compose logs -f postgres
  ```