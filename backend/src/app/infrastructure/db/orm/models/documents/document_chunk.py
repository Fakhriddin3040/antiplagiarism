from pgvector.sqlalchemy import Vector
from sqlalchemy import ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import mapped_column, Mapped

from src.base.types.orm.models import SQLAlchemyBaseModel, ChronoModelMixin
from src.base.types.pytypes import ID_T
from src.app.infrastructure.db.orm import DatabaseTables


class DocumentChunk(SQLAlchemyBaseModel, ChronoModelMixin):
    __tablename__ = DatabaseTables.DOCUMENT_CHUNKS

    document_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.DOCUMENTS.as_foreign_key, ondelete="cascade"),
        nullable=False,
    )
    content: Mapped[str] = mapped_column(Text)
    idx: Mapped[int] = mapped_column(nullable=False)

    vector = mapped_column(Vector(128), index=True)
    size: Mapped[int] = mapped_column(nullable=False)
    updated_at = None

    __table_args__ = (UniqueConstraint("document_id", "idx"),)
