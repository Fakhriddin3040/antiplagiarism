from enum import auto

from src.base.enums import ModelFieldsEnum


class UserField(ModelFieldsEnum):
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


class FileField(ModelFieldsEnum):
    ID = auto()
    NAME = auto()
    DESCRIPTION = auto()
    TITLE = auto()
    CREATED_BY = auto()
    PATH = auto()
    EXTENSION = auto()
    MIMETYPE = auto()
    CREATED_AT = auto()
    UPDATED_AT = auto()

    @staticmethod
    def as_outref() -> str:
        return "file_id"


class DocumentAuthorField(ModelFieldsEnum):
    ID = auto()
    FIRST_NAME = auto()
    LAST_NAME = auto()
    CREATED_AT = auto()
    UPDATED_AT = auto()
    CREATED_BY_ID = auto()

    @staticmethod
    def as_outref() -> str:
        return "author_id"


class FolderField(ModelFieldsEnum):
    ID = auto()
    TITLE = auto()
    DESCRIPTION = auto()
    PARENT_ID = auto()

    @staticmethod
    def as_outref() -> str:
        return "folder_id"


class DocumentChunkField(ModelFieldsEnum):
    ID = auto()
    DOCUMENT_ID = auto()
    VECTOR = auto()
    CREATED_AT = auto()

    @staticmethod
    def as_outref() -> str:
        return "chunk_id"


class DocumentField(ModelFieldsEnum):
    ID = auto()
    TITLE = auto()
    DESCRIPTION = auto()
    FOLDER = auto()
    AUTHOR = auto()
    FILE = auto()
    CHECKED = auto()
    VERDICT = auto()
    CHECKED_AT = auto()
    CREATED_AT = auto()
    UPDATED_AT = auto()
    CREATED_BY = auto()
    IS_INDEXED = auto()
    INDEXED_AT = auto()

    @staticmethod
    def as_outref() -> str:
        return "document_id"
