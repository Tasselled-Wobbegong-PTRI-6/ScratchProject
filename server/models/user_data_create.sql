-- psql -d "postgres://pydxjssx:5rJMuVa1CjjQ1cQA8v0nArw8Sa_p3GZM@ziggy.db.elephantsql.com/pydxjssx" -f ./server/models/user_data_create.sql

DROP TABLE sessions;
DROP TABLE user_data;

CREATE TABLE user_data (
  _id SERIAL PRIMARY KEY, 
  username VARCHAR(256) NOT NULL UNIQUE, 
  password VARCHAR(127) NOT NULL
);

CREATE TABLE sessions (
  _id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  expiration TIMESTAMP DEFAULT(NOW() + INTERVAL '1 minutes'),
  FOREIGN KEY (user_id) REFERENCES user_data(_id)
)