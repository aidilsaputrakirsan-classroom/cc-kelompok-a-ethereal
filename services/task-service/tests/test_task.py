import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os
from unittest.mock import AsyncMock, patch

# Menambahkan direktori task-service ke sys.path agar import main & database bisa dilakukan secara lokal
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Base, get_db
from main import app

# Setup in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
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


@patch("httpx.AsyncClient.get")
def test_health_check_auth_reachable(mock_get):
    # Mock auth-service health endpoint returning 200 OK
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_get.return_value = mock_response

    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["dependencies"]["auth-service"] == "healthy"


@patch("httpx.AsyncClient.get")
def test_health_check_auth_unreachable(mock_get):
    # Mock auth-service health endpoint raising exception (unreachable)
    mock_get.side_effect = Exception("Connection refused")

    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["dependencies"]["auth-service"] == "unreachable"


def test_metrics_endpoint():
    response = client.get("/metrics")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)
