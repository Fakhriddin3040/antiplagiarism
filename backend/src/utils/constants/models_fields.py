from enum import auto

from src.base.enums import ModelFieldsEnum


class UserFields(ModelFieldsEnum):
    ID = auto()
    USERNAME = auto()
    PASSWORD = auto()
    EMAIL = auto()
    FIRST_NAME = auto()
    LAST_NAME = auto()
    CREATED_AT = auto()
    UPDATED_AT = auto()

    @staticmethod
    def as_outref() -> str:
        return "user_id"
