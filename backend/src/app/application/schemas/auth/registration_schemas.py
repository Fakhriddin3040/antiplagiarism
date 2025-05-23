from pydantic import EmailStr

from src.base.schema import AbstractPydanticSchema


class UserRegisterSchema(AbstractPydanticSchema):
    first_name: str
    last_name: str
    password: str
    email: EmailStr
    password: str


class UserCredentialsConfirmSchema(AbstractPydanticSchema):
    email: str
    otp: str
