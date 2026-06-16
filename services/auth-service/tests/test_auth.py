import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import sys
import os

# Menambahkan direktori auth-service ke sys.path agar import main & database bisa dilakukan secara lokal
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Base, get_db
from main import app

# Gunakan database in-memory dengan StaticPool agar koneksi persisten di seluruh sesi test
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables after test runs
    Base.metadata.drop_all(bind=engine)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["service"] == "auth-service"


def test_register_validation_invalid_email():
    # Test invalid email format (rejected by Pydantic EmailStr)
    response = client.post(
        "/register",
        json={
            "email": "invalid-email-format",
            "password": "Password123!",
            "name": "Test User"
        }
    )
    assert response.status_code == 422  # Unprocessable Entity (Validation Error)


def test_register_validation_weak_password():
    # Test weak password (length < 8)
    response = client.post(
        "/register",
        json={
            "email": "test@gmail.com",
            "password": "123",
            "name": "Test User"
        }
    )
    assert response.status_code == 400
    assert "karakter" in response.json()["detail"].lower() or "password" in response.json()["detail"].lower()


def test_register_success_and_login_success():
    # 1. Register successfully
    register_response = client.post(
        "/register",
        json={
            "email": "successfuluser@gmail.com",
            "password": "Password123!",
            "name": "Success User"
        }
    )
    assert register_response.status_code == 201
    assert register_response.json()["email"] == "successfuluser@gmail.com"

    # 2. Login successfully
    login_response = client.post(
        "/login",
        json={
            "email": "successfuluser@gmail.com",
            "password": "Password123!"
        }
    )
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()


def test_login_rejects_invalid_credentials():
    # Try logging in with unregistered credentials
    response = client.post(
        "/login",
        json={
            "email": "nonexistent@gmail.com",
            "password": "WrongPassword123"
        }
    )
    assert response.status_code == 401
    assert "salah" in response.json()["detail"].lower() or "invalid" in response.json()["detail"].lower()
