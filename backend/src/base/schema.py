from typing import Optional, Dict, Any

from pydantic import BaseModel, Field, ConfigDict


class AbstractPydanticSchema(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )


class AbstractFilterSchema(BaseModel):
    limit: int = Field(100, ge=1, le=1000)
    offset: int = Field(0, ge=0)

    def parse_filters(self, **kwargs) -> Dict[str, Any]:
        return self.model_dump(exclude_unset=True, **kwargs)


class AbstractSearchSchema(BaseModel):
    search: Optional[str] = Field(None, description="Поисковый запрос")

    def parse_search(self, permitted_fields: set[str]) -> Dict[str, Any]:
        if not self.search:
            return {}

        arr = self.search.split(",")

        data = {}

        for item in arr:
            if "=" not in item:
                continue

            key, value = item.split("=")

            if key in permitted_fields:
                data[key] = value

        return data
