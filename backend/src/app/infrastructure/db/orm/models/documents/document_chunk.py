from pgvector.sqlalchemy import Vector
from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped

from src.base.types.orm.models import SQLAlchemyBaseModel, ChronoModelMixin
from src.base.types.pytypes import ID_T
from src.app.infrastructure.db.orm import DatabaseTables


class DocumentChunk(SQLAlchemyBaseModel, ChronoModelMixin):
    __tablename__ = DatabaseTables.DOCUMENT_CHUNKS

    document_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.DOCUMENTS.as_foreign_key), nullable=False
    )
    vector = mapped_column(Vector, index=True)
    updated_at = None
