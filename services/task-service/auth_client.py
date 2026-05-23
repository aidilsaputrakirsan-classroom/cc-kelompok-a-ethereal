import os

import httpx

from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

AUTH_SERVICE_URL = os.getenv(
    "AUTH_SERVICE_URL",
    "http://localhost:8001"
)

# Inisialisasi skema HTTPBearer untuk integrasi otomatis dengan Swagger UI
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Dependency: Memverifikasi token dengan memanggil Auth Service.
    Digunakan sebagai Depends(get_current_user) pada endpoint yang membutuhkan autentikasi.
    """
    token = credentials.credentials
    headers = {
        "Authorization": f"Bearer {token}"
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{AUTH_SERVICE_URL}/verify",
                headers=headers,
                timeout=5.0
            )

        if response.status_code == 200:
            return response.json()  # Mengembalikan data user: {"user_id", "email", "name"}
        elif response.status_code == 401:
            raise HTTPException(
                status_code=401,
                detail="Token tidak valid atau kedaluwarsa"
            )
        else:
            raise HTTPException(
                status_code=503,
                detail="Layanan auth tidak tersedia"
            )

    except HTTPException as he:
        # Re-raise HTTPException agar status 401/503 tidak terbungkus oleh error 503 umum
        raise he
    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Layanan auth tidak tersedia"
        )