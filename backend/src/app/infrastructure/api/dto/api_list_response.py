from typing import Optional, Generic, Sequence

from pydantic import Field
from typing_extensions import TypeVar

from src.base.schema import AbstractPydanticSchema

ROW_TYPE = TypeVar('ROW_TYPE', default=AbstractPydanticSchema, bound=AbstractPydanticSchema)

class ApiListResponse(AbstractPydanticSchema, Generic[ROW_TYPE]):
    count: Optional[int] = Field(default=0)
    rows: Sequence[ROW_TYPE] = Field(default_factory=list)
