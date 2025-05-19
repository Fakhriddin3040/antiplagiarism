from typing import Optional

from fastapi import UploadFile

from src.base.schema import AbstractPydanticSchema
from src.base.types.pytypes import ID_T


class DocumentCreateSchema(AbstractPydanticSchema):
    title: str
    text: Optional[str] = None
    description: Optional[str] = None
    file: Optional[UploadFile] = None
    file_id: Optional[ID_T] = None
