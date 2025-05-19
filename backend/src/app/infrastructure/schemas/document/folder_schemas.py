from typing import Optional

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


class FolderCreateSchema(AbstractPydanticSchema):
    title: str
    description: Optional[str]
    parent_id: Optional[ID_T] = None


class FolderUpdateSchema(AbstractPydanticSchema):
    title: Optional[str]
    description: Optional[str]
    parent_id: Optional[ID_T] = None


class FolderFilterSearchSchema(AbstractPydanticFilterSearchSchema):
    pass
