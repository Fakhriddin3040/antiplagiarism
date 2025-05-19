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


class FileFields(ModelFieldsEnum):
    NAME = auto()
    DESCRIPTION = auto()
    TITLE = auto()
    OWNER_ID = auto()
    PATH = auto()
    EXTENSION = auto()
    MIMETYPE = auto()
    CREATED_AT = auto()
    UPDATED_AT = auto()

    @staticmethod
    def as_outref() -> str:
        return "file_id"


class DocumentAuthorFields(ModelFieldsEnum):
    FIRST_NAME = auto()
    LAST_NAME = auto()
    CREATED_AT = auto()
    UPDATED_AT = auto()
    CREATED_BY_ID = auto()

    @staticmethod
    def as_outref() -> str:
        return "author_id"


class FolderFields(ModelFieldsEnum):
    TITLE = auto()
    DESCRIPTION = auto()
    PARENT_ID = auto()

    @staticmethod
    def as_outref() -> str:
        return "folder_id"
