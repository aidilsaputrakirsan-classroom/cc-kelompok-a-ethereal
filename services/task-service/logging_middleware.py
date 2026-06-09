import uuid
import logging

from starlette.middleware.base import BaseHTTPMiddleware

from metrics import record_request

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request, call_next):

        correlation_id = request.headers.get(
            "X-Correlation-ID",
            str(uuid.uuid4())
        )

        request.state.correlation_id = correlation_id

        logger.info(
            f"{request.method} {request.url.path}",
            extra={
                "correlation_id": correlation_id
            }
        )

        record_request()

        response = await call_next(request)

        response.headers["X-Correlation-ID"] = correlation_id

        return response