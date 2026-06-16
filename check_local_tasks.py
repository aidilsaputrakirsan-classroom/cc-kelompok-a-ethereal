import os
from sqlalchemy import create_engine, text

DATABASE_URL = "sqlite:///services/task-service/task.db"

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT id, title, owner_id FROM tasks"))
        tasks = result.fetchall()
        print(f"Tasks in LOCAL SQLite (task_db):")
        for task in tasks:
            print(f"ID: {task[0]}, Title: {task[1]}, Owner: {task[2]}")
except Exception as e:
    print(f"Error: {e}")
