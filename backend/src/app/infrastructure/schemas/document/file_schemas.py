from datetime import datetime
from typing import Optional

from fastapi import UploadFile
from pydantic import Field

from src.app.core.enums import FileAllowedExtensions
from src.base.schema import (
    AbstractPydanticSchema,
    AbstractFilterSchema,
    AbstractSearchSchema,
)
from src.base.types.pytypes import ID_T


class FileCreateSchema(AbstractPydanticSchema):
    title: str
    description: str
    file: UploadFile


class FileListSchema(AbstractPydanticSchema):
    id: ID_T
    title: str
    description: str
    path: str
    extension: FileAllowedExtensions
    created_at: datetime
    updated_at: datetime


class FileFilterSchema(AbstractFilterSchema):
    extension: Optional[FileAllowedExtensions] = Field(default=None)


class FileSearchSchema(AbstractSearchSchema):
    pass


class FileFilterSearchSchema(FileFilterSchema, FileSearchSchema):
    def parse_filters(self, **kwargs):
        return super().parse_filters(exclude={"search"})
