DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(200) NOT NULL,
    last VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    pass VARCHAR(200) NOT NULL,
    bio VARCHAR(100) DEFAULT 'this is your bio...',
    profilepic TEXT
);
