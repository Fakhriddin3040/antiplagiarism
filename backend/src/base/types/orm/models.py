from datetime import datetime

from sqlalchemy import ForeignKey, DateTime
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
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=default_dt,
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), onupdate=default_dt, default=default_dt, nullable=True
    )


class AuditableModelMixin:
    created_by_id: Mapped[ID_T] = mapped_column(
        ForeignKey("users.id"), nullable=False, index=True
    )


TModel = TypeVar("TModel", bound=SQLAlchemyBaseModel)
