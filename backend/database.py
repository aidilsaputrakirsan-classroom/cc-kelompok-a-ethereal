from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

from config import settings

# ================= LOAD ENV =================

load_dotenv()

# ================= DATABASE URL =================

DATABASE_URL = settings.DATABASE_URL

# ================= ENGINE =================

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

# ================= SESSION =================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ================= BASE MODEL =================

Base = declarative_base()

# ================= GET DB =================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()