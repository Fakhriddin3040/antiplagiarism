from sqlalchemy import Integer

from src.base.types.orm.type_decorators import SQLAlchemyEnumTypeDecorator
from src.app.core.enums import PlagiarismCheckStatusEnum, PlagiarismCheckVerdictEnum


class PlagiarismCheckStatusTD(
    SQLAlchemyEnumTypeDecorator[PlagiarismCheckStatusEnum], Integer
):
    impl = Integer
    choices = PlagiarismCheckStatusEnum


class PlagiarismCheckVerdictTD(
    SQLAlchemyEnumTypeDecorator[PlagiarismCheckVerdictEnum], Integer
):
    impl = Integer
    choices = PlagiarismCheckVerdictEnum
