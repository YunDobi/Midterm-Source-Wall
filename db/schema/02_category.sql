-- Drop and recreate Widgets table (Example)

DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255),
  description TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
