from src.base.schema import AbstractPydanticSchema


class UserDetailScheme(AbstractPydanticSchema):
    username: str
    email: str
    first_name: str
    last_name: str
