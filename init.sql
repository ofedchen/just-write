CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    prompt TEXT NOT NULL,
    artstyle TEXT,
    imageurl TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prompts (
    id SERIAL PRIMARY KEY,
    prompt TEXT NOT NULL,
);

CREATE TABLE IF NOT EXISTS entries (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
