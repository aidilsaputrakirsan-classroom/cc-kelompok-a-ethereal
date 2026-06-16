import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        # Check ty@gmail.com specifically for spaces or hidden chars
        result = connection.execute(text("SELECT email FROM users WHERE LOWER(email) LIKE '%ty@gmail.com%'"))
        users = result.fetchall()
        print("Precise check for ty@gmail.com:")
        for user in users:
            print(f"Email in DB: '[{user[0]}]' (Length: {len(user[0])})")
except Exception as e:
    print(f"Error: {e}")
