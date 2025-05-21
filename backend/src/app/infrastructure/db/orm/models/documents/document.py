from datetime import datetime

from sqlalchemy import ForeignKey, String, Text as TextType, UniqueConstraint, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.app.infrastructure.db.orm.models.documents.folder import Folder
from src.app.infrastructure.db.orm.models.documents.file import File
from src.app.infrastructure.db.orm.types.type_decorators.plagiarism_result import (
    PlagiarismCheckVerdictTD,
)
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
    text: Mapped[str | None] = mapped_column(TextType, nullable=True)
    checked: Mapped[bool] = mapped_column(default=False)
    verdict: Mapped[PlagiarismCheckVerdictTD.choices] = mapped_column(
        PlagiarismCheckVerdictTD,
        nullable=True,
    )
    idexed_at: Mapped[datetime] = mapped_column(nullable=True)
    is_indexed: Mapped[bool] = mapped_column(default=False, nullable=True)
    checked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    file_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.FILES.as_foreign_key), nullable=False
    )
    folder_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.FOLDERS.as_foreign_key), nullable=False, index=True
    )
    file: Mapped[File] = relationship("File", lazy="noload")
    folder: Mapped[Folder] = relationship("Folder", lazy="noload")

    __table_args__ = (
        UniqueConstraint("author_id", "title", name="unique_document_author_title"),
        UniqueConstraint("file_id", name="unique_document_file_id"),
    )
