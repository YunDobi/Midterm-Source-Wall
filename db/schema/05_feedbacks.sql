DROP TABLE IF EXISTS feedbacks CASCADE;

CREATE TABLE feedbacks (
id SERIAL PRIMARY KEY,
likes integer,
rating INTEGER,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
resource_id integer REFERENCES resources(id) ON DELETE CASCADE
);