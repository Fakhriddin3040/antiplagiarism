from fastapi import UploadFile

from src.base.schema import AbstractPydanticSchema


class FileCreateSchema(AbstractPydanticSchema):
    title: str
    description: str
    file: UploadFile
