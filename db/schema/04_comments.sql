DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE comments (
id SERIAL PRIMARY KEY NOT NULL,
comments text,
created_date timestamp default Now(),
user_id integer REFERENCES users(id) ON DELETE CASCADE,
resource_id integer REFERENCES resources(id) ON DELETE CASCADE
);
