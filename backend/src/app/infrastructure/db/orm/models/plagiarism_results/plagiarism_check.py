from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from src.base.types.pytypes import ID_T
from src.app.core.enums import PlagiarismResultStatusEnum
from src.app.infrastructure.db.orm.enums import DatabaseTables
from src.base.types.orm.models import (
    SQLAlchemyBaseModel,
    ChronoModelMixin,
    AuditableModelMixin,
)
from src.app.infrastructure.db.orm.types.type_decorators.plagiarism_result import (
    PlagiarismResultStatusTD,
)


class PlagiarismCheck(SQLAlchemyBaseModel, ChronoModelMixin, AuditableModelMixin):
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
