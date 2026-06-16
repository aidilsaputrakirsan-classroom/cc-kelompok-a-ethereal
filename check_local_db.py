import os
from sqlalchemy import create_engine, text

DATABASE_URL = "sqlite:///services/auth-service/auth.db"

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT email FROM users"))
        users = result.fetchall()
        print(f"Found {len(users)} users in LOCAL SQLite.")
        for user in users:
            print(f"- {user[0]}")
except Exception as e:
    print(f"Error (maybe table doesn't exist): {e}")
