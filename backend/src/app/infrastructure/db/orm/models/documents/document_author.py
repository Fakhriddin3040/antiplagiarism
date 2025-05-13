from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from src.base.types.orm.models import (
    SQLAlchemyBaseModel,
    ChronoModelMixin,
    AuditableModelMixin,
)
from src.app.infrastructure.db.orm import DatabaseTables


class DocumentAuthor(SQLAlchemyBaseModel, ChronoModelMixin, AuditableModelMixin):
    __tablename__ = DatabaseTables.DOCUMENTS_AUTHORS

    first_name: Mapped[str] = mapped_column(String(20), nullable=False)
    last_name: Mapped[str] = mapped_column(String(20), nullable=False)
