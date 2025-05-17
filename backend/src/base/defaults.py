from datetime import datetime, timezone
from uuid import uuid4


default_id = lambda: uuid4()  # noqa
default_dt = lambda: datetime.now(timezone.utc)  # noqa
