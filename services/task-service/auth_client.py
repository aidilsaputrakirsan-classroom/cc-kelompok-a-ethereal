import os
import asyncio
import logging

import httpx
from circuit_breaker import CircuitBreaker

from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

AUTH_SERVICE_URL = os.getenv(
    "AUTH_SERVICE_URL",
    "http://localhost:8001"
)

logger = logging.getLogger(__name__)

# Retry Configuration
MAX_RETRIES = 3
BASE_DELAY = 0.5
TIMEOUT_SECONDS = 5.0

RETRYABLE_STATUS_CODES = {
    500,
    502,
    503,
    504
}

# Circuit Breaker
circuit_breaker = CircuitBreaker(
    failure_threshold=3,
    recovery_timeout=30
)

# Swagger Authorization Support
security = HTTPBearer()


async def _call_auth_service(headers: dict) -> dict:
    """
    Internal function untuk memanggil Auth Service
    dengan Retry Logic + Circuit Breaker.
    """

    last_exception = None

    # Circuit Breaker Check
    if not circuit_breaker.can_execute():
        raise HTTPException(
            status_code=503,
            detail="Auth Service temporarily unavailable (Circuit Open)"
        )

    for attempt in range(1, MAX_RETRIES + 1):

        try:

            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{AUTH_SERVICE_URL}/verify",
                    headers=headers,
                    timeout=TIMEOUT_SECONDS
                )

            # Success
            if response.status_code == 200:

                circuit_breaker.record_success()

                logger.info(
                    f"Auth verified (attempt {attempt})"
                )

                return response.json()

            # Unauthorized → jangan retry
            if response.status_code == 401:
                raise HTTPException(
                    status_code=401,
                    detail="Token tidak valid atau kedaluwarsa"
                )

            # Retryable server errors
            if response.status_code in RETRYABLE_STATUS_CODES:

                logger.warning(
                    f"Auth Service returned "
                    f"{response.status_code} "
                    f"(attempt {attempt}/{MAX_RETRIES})"
                )

                last_exception = response

            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Unexpected auth response"
                )

        except httpx.ConnectError as e:

            logger.warning(
                f"Cannot connect to Auth Service "
                f"(attempt {attempt}/{MAX_RETRIES})"
            )

            last_exception = e

        except httpx.TimeoutException as e:

            logger.warning(
                f"Auth Service timeout "
                f"(attempt {attempt}/{MAX_RETRIES})"
            )

            last_exception = e

        # Exponential Backoff
        if attempt < MAX_RETRIES:

            delay = BASE_DELAY * (
                2 ** (attempt - 1)
            )

            logger.info(
                f"Retrying in {delay}s..."
            )

            await asyncio.sleep(delay)

    logger.error(
        f"Auth Service unreachable "
        f"after {MAX_RETRIES} attempts"
    )

    circuit_breaker.record_failure()

    raise HTTPException(
        status_code=503,
        detail="Auth Service unavailable. Please try again later."
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Dependency FastAPI untuk memverifikasi token
    melalui Auth Service.
    """

    token = credentials.credentials

    headers = {
        "Authorization": f"Bearer {token}"
    }

    return await _call_auth_service(headers)