import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT email, hashed_password FROM users WHERE LOWER(email) = 'ty@gmail.com'"))
        users = result.fetchall()
        print(f"Found {len(users)} matches for ty@gmail.com (case-insensitive):")
        for user in users:
            print(f"Email: {user[0]}")
            print(f"Hash:  {user[1][:20]}...")
except Exception as e:
    print(f"Error: {e}")
