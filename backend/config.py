import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application configuration"""

    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

    DEBUG = ENVIRONMENT == "development"

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///./test.db"
    )

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "dev-secret-key"
    )

    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    )

    CORS_ORIGINS = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000"
    ).split(",")

    LOG_LEVEL = os.getenv(
        "LOG_LEVEL",
        "DEBUG" if DEBUG else "INFO"
    )


settings = Settings()