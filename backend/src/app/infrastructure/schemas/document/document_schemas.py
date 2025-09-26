from datetime import datetime
from typing import Optional

from fastapi import UploadFile, Form, File

from src.app.core.enums import PlagiarismCheckVerdictEnum
from src.app.infrastructure.schemas.document.file_schemas import FileListSchema
from src.base.schema import (
    AbstractPydanticSchema,
    AbstractPydanticFilterSearchSchema,
    ChronoSchemaMixin,
)
from src.base.types.pytypes import ID_T


class DocumentCreateSchema(AbstractPydanticSchema):
    title: str
    author_id: ID_T
    folder_id: ID_T
    description: Optional[str] = None
    file: UploadFile  # отдельно потом добавим

    @classmethod
    def as_form(
        cls,
        title: str = Form(...),
        author_id: ID_T = Form(...),
        folder_id: ID_T = Form(...),
        description: Optional[str] = Form(None),
        file: UploadFile = File(...),
    ) -> "DocumentCreateSchema":
        return cls(
            title=title,
            author_id=author_id,
            folder_id=folder_id,
            description=description,
            file=file,
        )


class DocumentUpdateSchema(AbstractPydanticSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    folder_id: Optional[ID_T] = None
    author_id: Optional[ID_T] = None


class DocumentListSchema(ChronoSchemaMixin):
    id: ID_T
    author_id: ID_T
    title: str
    checked: bool
    checked_at: Optional[datetime]
    verdict: Optional[PlagiarismCheckVerdictEnum]
    folder_id: ID_T
    description: Optional[str] = None
    file: FileListSchema


class DocumentFilterSearchParamsSchema(AbstractPydanticFilterSearchSchema):
    folder_id: Optional[ID_T] = None
    author_id: Optional[ID_T] = None
    verdict: Optional[PlagiarismCheckVerdictEnum] = None
    checked: Optional[bool] = None
