from sqlalchemy import Integer

from src.base.types.orm.type_decorators import SQLAlchemyEnumTypeDecorator
from src.app.core.enums import PlagiarismResultStatusEnum


class PlagiarismResultStatusTD(
    SQLAlchemyEnumTypeDecorator[PlagiarismResultStatusEnum], Integer
):
    impl = Integer
    choices = PlagiarismResultStatusEnum
