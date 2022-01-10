DROP TABLE IF EXISTS resourcescategories CASCADE;

CREATE TABLE resourcescategories (
  id SERIAL PRIMARY KEY,
  resource_id INTEGER REFERENCES resources(id) on DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
)