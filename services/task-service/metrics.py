request_count = 0
error_count = 0


def record_request():
    global request_count
    request_count += 1


def record_error():
    global error_count
    error_count += 1


def get_metrics():
    return {
        "requests": request_count,
        "errors": error_count
    }