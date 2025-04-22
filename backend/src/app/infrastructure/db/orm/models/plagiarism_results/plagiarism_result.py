from decimal import Decimal

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from base.types.pytypes import ID_T
from src.app.core.enums import PlagiarismResultStatusEnum
from src.app.infrastructure.db.orm.enums import DatabaseTables
from base.types.orm.models import SQLAlchemyBaseModel, ChronoModelMixin
from src.app.infrastructure.db.orm.models.documents.document import Document
from src.app.infrastructure.db.orm.types.type_decorators.plagiarism_result import (
    PlagiarismResultStatusTD,
)


class PlagiarismResult(SQLAlchemyBaseModel, ChronoModelMixin):
    __tablename__ = DatabaseTables.PLAGIARISM_RESULTS

    document_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.DOCUMENTS.as_foreign_key),
        nullable=False,
    )
    target_document_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.DOCUMENTS.as_foreign_key), nullable=False
    )
    similarity_score: Mapped[Decimal] = mapped_column(nullable=False)
    status: Mapped[PlagiarismResultStatusTD.choices] = mapped_column(
        PlagiarismResultStatusTD,
        nullable=False,
        default=PlagiarismResultStatusEnum.PENDING,
    )

    document: Mapped["Document"] = relationship(foreign_keys=[document_id])
    target_document: Mapped["Document"] = relationship(
        foreign_keys=[target_document_id]
    )
