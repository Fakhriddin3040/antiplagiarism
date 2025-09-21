from datetime import datetime
from typing import Optional, Dict, Any

from pydantic import BaseModel, Field, ConfigDict

from src.base.types.pytypes import ID_T


class AbstractPydanticSchema(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )


class ChronoSchemaMixin(AbstractPydanticSchema):
    created_at: datetime
    updated_at: datetime


class AuditableSchemaMixin(AbstractPydanticSchema):
    created_by_id: Optional[ID_T]


class AbstractPydanticSearchSchema(BaseModel):
    search: Optional[str] = Field(None, description="Поисковый запрос")

    def parse_search(self, permitted_fields: set[str]) -> Dict[str, Any]:
        self.search = self.search.strip() if self.search else ""

        if not self.search:
            return {}

        return {
            field: self.search
            for field in permitted_fields
        }


class AbstractPydanticFilterSchema(BaseModel):
    limit: int = Field(100, ge=1, le=1000)
    offset: int = Field(0, ge=0)

    def parse_filters(self, **kwargs) -> Dict[str, Any]:
        return self.model_dump(exclude_unset=True, **kwargs)


class AbstractPydanticFilterSearchSchema(
    AbstractPydanticFilterSchema, AbstractPydanticSearchSchema
):
    def parse_filters(self, **kwargs) -> Dict[str, Any]:
        exclude = kwargs.get("exclude", set())
        if not isinstance(exclude, set):
            raise TypeError("exclude must be a set")
        if "search" not in exclude:
            exclude.add("search")

        kwargs["exclude"] = exclude

        return super().parse_filters(**kwargs)
