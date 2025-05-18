from sqlalchemy import ForeignKey, String, Text as TextType
from sqlalchemy.orm import Mapped, mapped_column

from src.base.types.pytypes import ID_T
from src.app.infrastructure.db.orm.enums import DatabaseTables
from src.base.types.orm.models import (
    SQLAlchemyBaseModel,
    ChronoModelMixin,
    AuditableModelMixin,
)


class Document(SQLAlchemyBaseModel, ChronoModelMixin, AuditableModelMixin):
    __tablename__ = DatabaseTables.DOCUMENTS

    author_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.DOCUMENTS_AUTHORS.as_foreign_key),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(TextType, nullable=True)
    text: Mapped[str] = mapped_column(TextType, nullable=True)
    file_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.FILES.as_foreign_key), nullable=False
    )
