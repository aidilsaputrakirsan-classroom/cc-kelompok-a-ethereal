import logging
import json
from datetime import datetime


class JsonFormatter(logging.Formatter):

    def format(self, record):
        log_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage()
        }

        if hasattr(record, "correlation_id"):
            log_record["correlation_id"] = record.correlation_id

        if hasattr(record, "alert"):
            log_record["alert"] = record.alert

        return json.dumps(log_record)


def setup_logging():
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())

    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    logger.handlers.clear()
    logger.addHandler(handler)