-- =====================================
-- Kelarin Database Initialization
-- =====================================

-- ================= USERS TABLE =================

CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    email VARCHAR(255) NOT NULL UNIQUE,

    name VARCHAR(255) NOT NULL,

    hashed_password TEXT NOT NULL

);

-- ================= TASKS TABLE =================

CREATE TABLE IF NOT EXISTS tasks (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    category VARCHAR(100),

    status VARCHAR(50) DEFAULT 'pending',

    attachment_url TEXT,

    completed BOOLEAN DEFAULT FALSE,

    owner_id INTEGER NOT NULL,

    FOREIGN KEY (owner_id)
        REFERENCES users(id)

);

-- ================= INDEXES =================

CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

CREATE INDEX IF NOT EXISTS idx_tasks_owner_id
ON tasks(owner_id);

CREATE INDEX IF NOT EXISTS idx_tasks_status
ON tasks(status);