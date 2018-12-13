DROP TABLE IF EXISTS friends;
DROP TABLE IF EXISTS chat;
DROP TABLE IF EXISTS wallpost;
DROP TABLE IF EXISTS walllikes;
DROP TABLE IF EXISTS chatlikes;

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

CREATE TABLE friends(
    id SERIAL PRIMARY KEY,
    receiver_id INTEGER NOT NULL REFERENCES users(id),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wallpost(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    receiver_id INTEGER NOT NULL REFERENCES users(id),
    wallpost TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE walllikes(
    id SERIAL PRIMARY KEY,
    liker_id INTEGER NOT NULL REFERENCES users(id),
    post_id INTEGER NOT NULL REFERENCES wallpost(id),
    liked BOOLEAN DEFAULT false
);

CREATE TABLE chatlikes(
    id SERIAL PRIMARY KEY,
    liker_id INTEGER NOT NULL REFERENCES users(id),
    post_id INTEGER NOT NULL REFERENCES chat(id),
    liked BOOLEAN DEFAULT false
);
