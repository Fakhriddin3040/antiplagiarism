from sqlalchemy import Integer

from base.types.orm.type_decorators import ORMEnumTypeDecorator
from src.app.core.enums import PlagiarismResultStatusEnum


class PlagiarismResultStatusTD(
    ORMEnumTypeDecorator[PlagiarismResultStatusEnum], Integer
):
    impl = Integer
    choices = PlagiarismResultStatusEnum
