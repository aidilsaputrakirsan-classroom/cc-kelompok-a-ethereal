import sqlite3

MONOLITH_DB = "temp_migration/kelarin_monolith.db"
AUTH_DB = "services/auth-service/auth.db"
TASK_DB = "services/task-service/task.db"


def migrate_users():
    monolith_conn = sqlite3.connect(MONOLITH_DB)
    auth_conn = sqlite3.connect(AUTH_DB)

    monolith_cursor = monolith_conn.cursor()
    auth_cursor = auth_conn.cursor()

    users = monolith_cursor.execute(
        "SELECT * FROM users"
    ).fetchall()

    for user in users:
        try:
            auth_cursor.execute(
                """
                INSERT INTO users
                (id, email, name, hashed_password, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                user
            )
        except sqlite3.IntegrityError:
            print(f"User ID {user[0]} sudah ada")

    auth_conn.commit()

    monolith_conn.close()
    auth_conn.close()

    print(f"Berhasil migrasi {len(users)} user")


def migrate_tasks():
    monolith_conn = sqlite3.connect(MONOLITH_DB)
    task_conn = sqlite3.connect(TASK_DB)

    monolith_cursor = monolith_conn.cursor()
    task_cursor = task_conn.cursor()

    tasks = monolith_cursor.execute(
        "SELECT * FROM tasks"
    ).fetchall()

    for task in tasks:
        try:
            task_cursor.execute(
                """
                INSERT INTO tasks
                (
                    id,
                    title,
                    description,
                    category,
                    status,
                    attachment_url,
                    completed,
                    owner_id,
                    created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                task
            )
        except sqlite3.IntegrityError:
            print(f"Task ID {task[0]} sudah ada")

    task_conn.commit()

    monolith_conn.close()
    task_conn.close()

    print(f"Berhasil migrasi {len(tasks)} task")


if __name__ == "__main__":
    migrate_users()
    migrate_tasks()