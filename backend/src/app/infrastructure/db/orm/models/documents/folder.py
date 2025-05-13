from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from src.base.types.orm.models import (
    SQLAlchemyBaseModel,
    ChronoModelMixin,
    AuditableModelMixin,
)
from src.app.infrastructure.db.orm import DatabaseTables


class Folder(SQLAlchemyBaseModel, ChronoModelMixin, AuditableModelMixin):
    __tablename__ = DatabaseTables.FOLDERS

    name: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
