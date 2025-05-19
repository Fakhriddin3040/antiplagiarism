from sqlalchemy import String

from src.app.infrastructure.constants import AllowedMimeTypeEnum
from src.base.types.orm.type_decorators import SQLAlchemyEnumTypeDecorator


class MimeTypeTD(SQLAlchemyEnumTypeDecorator[AllowedMimeTypeEnum], String):
    impl = String
    choices = AllowedMimeTypeEnum
