from datetime import datetime
from typing import Optional

from fastapi import UploadFile, Form, File

from src.app.core.enums import PlagiarismCheckVerdictEnum
from src.app.infrastructure.schemas.document.file_schemas import FileListSchema
from src.base.schema import AbstractPydanticSchema, AbstractPydanticFilterSearchSchema
from src.base.types.pytypes import ID_T


class DocumentCreateSchema(AbstractPydanticSchema):
    title: str
    author_id: ID_T
    folder_id: ID_T
    description: Optional[str] = None
    index_it: Optional[bool] = False
    file: UploadFile  # отдельно потом добавим

    @classmethod
    def as_form(
        cls,
        title: str = Form(...),
        author_id: ID_T = Form(...),
        folder_id: ID_T = Form(...),
        description: Optional[str] = Form(None),
        index_it: Optional[bool] = Form(False),
        file: UploadFile = File(...),
    ) -> "DocumentCreateSchema":
        return cls(
            title=title,
            author_id=author_id,
            folder_id=folder_id,
            description=description,
            index_it=index_it,
            file=file,
        )


class DocumentUpdateSchema(AbstractPydanticSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    folder_id: Optional[ID_T] = None
    author_id: Optional[ID_T] = None


class DocumentListSchema(AbstractPydanticSchema):
    id: ID_T
    author_id: ID_T
    title: str
    is_indexed: bool
    indexed_at: Optional[datetime]
    checked: bool
    checked_at: Optional[datetime]
    verdict: Optional[PlagiarismCheckVerdictEnum]
    folder_id: ID_T
    description: Optional[str]
    file: FileListSchema


class DocumentFilterSearchParamsSchema(AbstractPydanticFilterSearchSchema):
    is_indexed: Optional[bool] = None
    folder_id: Optional[ID_T] = None
    author_id: Optional[ID_T] = None
    verdict: Optional[PlagiarismCheckVerdictEnum] = None
    checked: Optional[bool] = None


"""
    author_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.DOCUMENTS_AUTHORS.as_foreign_key),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(TextType, nullable=True)
    text: Mapped[str | None] = mapped_column(TextType, nullable=True)
    is_indexed: Mapped[bool] = mapped_column(default=False)
    last_indexed_at: Mapped[datetime] = mapped_column(nullable=True)
    file_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.FILES.as_foreign_key), nullable=False
    )
    file: Mapped[File] = relationship("File", lazy="noload")

"""
