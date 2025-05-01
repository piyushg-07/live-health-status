import { dbPool } from '../config/database';

async function migrate() {
  await dbPool.query(`
    CREATE TYPE status_enum AS ENUM ('Healthy','Sick','Critical');
    CREATE TABLE IF NOT EXISTS records (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      age INT NOT NULL CHECK (age > 0),
      status status_enum NOT NULL,
      last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  console.log('Migration complete');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed', err);
  process.exit(1);
});
