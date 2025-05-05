from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from base.types.pytypes import ID_T
from src.app.core.enums import PlagiarismResultStatusEnum
from src.app.infrastructure.db.orm.enums import DatabaseTables
from base.types.orm.models import SQLAlchemyBaseModel, ChronoModelMixin
from src.app.infrastructure.db.orm.models.plagiarism_results.plagiarism_match import (
    PlagiarismMatch,
)
from src.app.infrastructure.db.orm.types.type_decorators.plagiarism_result import (
    PlagiarismResultStatusTD,
)


class PlagiarismCheck(SQLAlchemyBaseModel, ChronoModelMixin):
    __tablename__ = DatabaseTables.PLAGIARISM_CHECKS

    document_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.DOCUMENTS.as_foreign_key), nullable=False
    )
    max_similarity_score: Mapped[float] = mapped_column(nullable=False)
    status: Mapped[PlagiarismResultStatusTD.choices] = mapped_column(
        PlagiarismResultStatusTD,
        nullable=False,
        default=PlagiarismResultStatusEnum.PENDING,
    )
    matches: Mapped[List[PlagiarismMatch]] = relationship(
        DatabaseTables.PLAGIARISM_MATCHES
    )
