from datetime import datetime
from uuid import uuid4

from src.app.core.constants import TIMEZONE

default_id = lambda: uuid4()  # noqa
default_dt = lambda: datetime.now(tz=TIMEZONE)  # noqa
