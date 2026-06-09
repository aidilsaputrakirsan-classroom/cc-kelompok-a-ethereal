import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

request_count = 0
error_count = 0

request_history = []
error_history = []


def record_request():
    global request_count

    request_count += 1
    request_history.append(datetime.utcnow())


def record_error():
    global error_count

    error_count += 1
    error_history.append(datetime.utcnow())


def get_metrics():
    return {
        "requests": request_count,
        "errors": error_count
    }


def get_error_rate_last_minute():

    now = datetime.utcnow()
    one_minute_ago = now - timedelta(minutes=1)

    recent_requests = [
        r for r in request_history
        if r >= one_minute_ago
    ]

    recent_errors = [
        e for e in error_history
        if e >= one_minute_ago
    ]

    total_requests = len(recent_requests)

    if total_requests == 0:
        return 0

    return len(recent_errors) / total_requests


def check_error_alert():

    error_rate = get_error_rate_last_minute()

    if error_rate > 0.10:

        logger.critical(
            "High error rate detected",
            extra={
                "alert": True
            }
        )