from datetime import datetime
from typing import Optional

from fastapi import UploadFile
from pydantic import Field

from src.app.core.enums import FileAllowedExtensionEnum
from src.app.infrastructure.constants import AllowedMimeTypeEnum
from src.base.schema import (
    AbstractPydanticSchema,
    AbstractPydanticFilterSearchSchema,
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
    extension: FileAllowedExtensionEnum
    mimetype: AllowedMimeTypeEnum
    created_at: datetime
    updated_at: datetime


class FileFilterSearchSchema(AbstractPydanticFilterSearchSchema):
    extension: Optional[FileAllowedExtensionEnum] = Field(default=None)
