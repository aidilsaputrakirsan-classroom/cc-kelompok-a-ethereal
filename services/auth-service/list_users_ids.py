import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT id, email FROM users ORDER BY id"))
        users = result.fetchall()
        print("Users in Railway (auth_db):")
        for user in users:
            print(f"ID: {user[0]}, Email: {user[1]}")
except Exception as e:
    print(f"Error: {e}")
