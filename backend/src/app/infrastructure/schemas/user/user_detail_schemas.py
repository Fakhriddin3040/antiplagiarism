from datetime import datetime

from src.base.schema import AbstractPydanticSchema


class UserDetailSchema(AbstractPydanticSchema):
    username: str
    email: str
    first_name: str
    last_name: str
    created_at: datetime
    updated_at: datetime
