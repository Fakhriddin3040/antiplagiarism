from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from base.types.orm.models import SQLAlchemyBaseModel, ChronoModelMixin
from base.types.pytypes import ID_T
from src.app.infrastructure.db.orm import DatabaseTables


class PlagiarismMatch(SQLAlchemyBaseModel, ChronoModelMixin):
    __tablename__ = DatabaseTables.PLAGIARISM_MATCHES

    check_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.PLAGIARISM_MATCHES.as_foreign_key)
    )
    source_chunk_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.DOCUMENT_CHUNKS.as_foreign_key)
    )
    matched_chunk_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.DOCUMENT_CHUNKS.as_foreign_key)
    )
    similarity: Mapped[float] = mapped_column(nullable=False)
    updated_at = None
