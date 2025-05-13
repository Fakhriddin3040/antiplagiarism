from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import (
    DeclarativeBase as SQLAlchemyDeclarativeBase,
    Mapped,
    mapped_column,
)
from typing_extensions import TypeVar

from src.base.defaults import default_id, default_dt
from src.base.types.pytypes import ID_T


class SQLAlchemyBaseModel(SQLAlchemyDeclarativeBase):
    id: Mapped[ID_T] = mapped_column(primary_key=True, default=default_id)


class ChronoModelMixin:
    created_at: Mapped[datetime] = mapped_column(default=default_dt, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(onupdate=default_dt, nullable=True)


class AuditableModelMixin:
    created_by_id: Mapped[ID_T] = mapped_column(
        ForeignKey("users"), nullable=False, index=True
    )
    updated_by_id: Mapped[ID_T] = mapped_column(ForeignKey("users"), nullable=False)


TModel = TypeVar("TModel", bound=SQLAlchemyBaseModel)
