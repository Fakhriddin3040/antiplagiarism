from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.app.infrastructure.db.orm.models.plagiarism_results.plagiarism_match import (
    PlagiarismMatch,
)
from src.base.types.pytypes import ID_T
from src.app.core.enums import PlagiarismCheckStatusEnum
from src.app.infrastructure.db.orm.enums import DatabaseTables
from src.base.types.orm.models import (
    SQLAlchemyBaseModel,
    ChronoModelMixin,
    AuditableModelMixin,
)
from src.app.infrastructure.db.orm.types.type_decorators.plagiarism_result import (
    PlagiarismCheckStatusTD,
    PlagiarismCheckVerdictTD,
)


class PlagiarismCheck(SQLAlchemyBaseModel, ChronoModelMixin, AuditableModelMixin):
    __tablename__ = DatabaseTables.PLAGIARISM_CHECKS

    document_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.DOCUMENTS.as_foreign_key, ondelete='cascade'), nullable=False
    )
    max_similarity_score: Mapped[float] = mapped_column(nullable=False)
    status: Mapped[PlagiarismCheckStatusTD.choices] = mapped_column(
        PlagiarismCheckStatusTD,
        nullable=False,
        default=PlagiarismCheckStatusEnum.PENDING,
    )
    chunks_found: Mapped[int] = mapped_column(nullable=True)
    matches_found: Mapped[int] = mapped_column(nullable=True)
    average_chunks_similarity: Mapped[float] = mapped_column(nullable=True)
    verdict: Mapped[PlagiarismCheckVerdictTD.choices] = mapped_column(
        PlagiarismCheckVerdictTD,
        nullable=False,
        default=PlagiarismCheckVerdictTD.choices.UNIQUE,
    )
    matches: Mapped[List["PlagiarismMatch"]] = relationship(
        "PlagiarismMatch",
        lazy="noload",
        primaryjoin="PlagiarismMatch.check_id == PlagiarismCheck.id",
    )
    updated_at = None
