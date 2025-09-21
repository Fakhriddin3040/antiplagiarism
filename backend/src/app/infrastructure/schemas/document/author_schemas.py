from typing import Optional

from src.base.schema import (
    ChronoSchemaMixin,
    AbstractPydanticSchema,
    AbstractPydanticFilterSearchSchema,
)
from src.base.types.pytypes import ID_T


class DocumentAuthorCreateSchema(AbstractPydanticSchema):
    first_name: str
    last_name: str
    description: Optional[str] = None


class DocumentAuthorUpdateSchema(AbstractPydanticSchema):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    description: Optional[str] = None


class DocumentAuthorListSchema(ChronoSchemaMixin):
    id: ID_T
    first_name: str
    last_name: str
    description: Optional[str] = None


class DocumentAuthorSearchSchema(AbstractPydanticFilterSearchSchema):
    pass
