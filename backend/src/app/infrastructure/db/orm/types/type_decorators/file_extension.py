from sqlalchemy import String

from src.app.core.enums import FileAllowedExtensionEnum
from src.base.types.orm.type_decorators import SQLAlchemyEnumTypeDecorator


class FileExtensionTD(SQLAlchemyEnumTypeDecorator[FileAllowedExtensionEnum, String]):
    impl = String
    choices = FileAllowedExtensionEnum
