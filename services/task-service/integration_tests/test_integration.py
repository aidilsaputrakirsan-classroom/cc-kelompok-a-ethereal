import os
import pytest
import httpx


AUTH_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")
TASK_URL = os.getenv("TASK_SERVICE_URL", "http://localhost:8002")


@pytest.mark.asyncio
async def test_auth_and_task_integration():

    # Registration & Login
    async with httpx.AsyncClient() as client:
        # 1. Register user (in case they don't exist)
        await client.post(
            f"{AUTH_URL}/register",
            json={
                "email": "test123@gmail.com",
                "password": "Test123!",
                "name": "Test User"
            }
        )

        # 2. Login ke Auth Service
        login_response = await client.post(
            f"{AUTH_URL}/login",
            json={
                "email": "test123@gmail.com",
                "password": "Test123!"
            }
        )

        assert login_response.status_code == 200

        token = login_response.json()["access_token"]

        headers = {
            "Authorization": f"Bearer {token}"
        }

        # Ambil daftar task dari Task Service
        task_response = await client.get(
            f"{TASK_URL}/tasks",
            headers=headers
        )

        assert task_response.status_code == 200

        data = task_response.json()

        assert isinstance(data, list)
