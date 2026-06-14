import os

from dotenv import load_dotenv

from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.getenv(
    "TASK_DATABASE_URL",
    "sqlite:///./task.db"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def run_migrations():
    """
    Robust migration to add missing columns.
    Handles PostgreSQL transaction state by using separate connections/transactions.
    """
    columns_to_add = [
        ("completed", "BOOLEAN DEFAULT FALSE"),
        ("deadline", "TIMESTAMP"),
        ("assigned_to", "INTEGER"),
        ("updated_at", "TIMESTAMP")
    ]

    for col_name, col_type in columns_to_add:
        # Check if column exists using a separate transaction
        exists = False
        try:
            with engine.connect() as conn:
                conn.execute(text(f"SELECT {col_name} FROM tasks LIMIT 1"))
                exists = True
        except Exception:
            # Column likely doesn't exist
            exists = False

        if not exists:
            print(f"Migration: Adding '{col_name}' column to tasks table...")
            try:
                with engine.connect() as conn:
                    conn.execute(text(f"ALTER TABLE tasks ADD COLUMN {col_name} {col_type}"))
                    conn.commit()
                    print(f"Migration: Column '{col_name}' added successfully.")
            except Exception as e:
                print(f"Migration error ({col_name}): {e}")


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()