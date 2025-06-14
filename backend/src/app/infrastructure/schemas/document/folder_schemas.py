from typing import Optional, List

from pydantic import Field

from src.base.schema import (
    AbstractPydanticSchema,
    ChronoSchemaMixin,
    AuditableSchemaMixin,
    AbstractPydanticFilterSearchSchema,
)
from src.base.types.pytypes import ID_T


class FolderListSchema(ChronoSchemaMixin, AuditableSchemaMixin):
    id: ID_T
    title: str
    description: Optional[str]
    parent_id: Optional[ID_T]
    children: Optional[List["FolderListSchema"]]


class FolderCreateSchema(AbstractPydanticSchema):
    title: str = Field(max_length=20, min_length=1)
    description: Optional[str]
    parent_id: Optional[ID_T] = None


class FolderUpdateSchema(AbstractPydanticSchema):
    title: Optional[str] = Field(max_length=20, min_length=1)
    description: Optional[str]
    parent_id: Optional[ID_T] = None


class FolderFilterSearchSchema(AbstractPydanticFilterSearchSchema):
    parent_id: Optional[ID_T] = None
