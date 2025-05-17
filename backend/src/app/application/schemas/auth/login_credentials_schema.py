from pydantic import EmailStr

from src.base.schema import AbstractPydanticSchema


class LoginCredentialsSchema(AbstractPydanticSchema):
    email: EmailStr
    password: str
