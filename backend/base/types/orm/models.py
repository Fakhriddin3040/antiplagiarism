from sqlalchemy.orm import (
    DeclarativeBase as SQLAlchemyDeclarativeBase,
    Mapped,
    mapped_column,
)

from base.defaults import default_id
from base.types.pytypes import ID_T


class SQLAlchemyBaseModel(SQLAlchemyDeclarativeBase):
    id: Mapped[ID_T] = mapped_column(primary_key=True, default=default_id())
