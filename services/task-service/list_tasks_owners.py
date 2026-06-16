import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load from task-service env
load_dotenv("services/task-service/.env")
DATABASE_URL = os.getenv("TASK_DATABASE_URL")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT id, title, created_by FROM tasks LIMIT 20"))
        tasks = result.fetchall()
        print("Tasks in Railway (task_db):")
        for task in tasks:
            print(f"Task ID: {task[0]}, Title: {task[1]}, Owner (created_by): {task[2]}")
except Exception as e:
    print(f"Error: {e}")
