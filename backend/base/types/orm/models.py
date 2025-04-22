from datetime import datetime

from sqlalchemy.orm import (
    DeclarativeBase as SQLAlchemyDeclarativeBase,
    Mapped,
    mapped_column,
)
from typing_extensions import TypeVar

from base.defaults import default_id, default_dt
from base.types.pytypes import ID_T


class SQLAlchemyBaseModel(SQLAlchemyDeclarativeBase):
    id: Mapped[ID_T] = mapped_column(primary_key=True, default=default_id())


class ChronoModelMixin:
    created_at: Mapped[datetime] = mapped_column(default=default_dt(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(default=default_dt(), nullable=False)


TModel = TypeVar("TModel", bound=SQLAlchemyBaseModel)
