from datetime import datetime

from src.app.core.constants import TIMEZONE


def get_current_timestamp() -> int:
    return int(datetime.now(tz=TIMEZONE).timestamp())


def get_datetime_from_timestamp(timestamp: int) -> datetime:
    return datetime.fromtimestamp(timestamp)


def get_datetime(tz=TIMEZONE) -> datetime:
    return datetime.now(tz=tz)


def get_datetime_utc() -> datetime:
    import pytz

    return datetime.now(pytz.utc)
