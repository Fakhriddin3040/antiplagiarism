from typing import Optional, Dict, Any

from pydantic import BaseModel, Field


class AbstractPydanticSchema(BaseModel):
    pass


class AbstractFilterSchema(BaseModel):
    limit: int = Field(100, ge=1, le=1000)
    offset: int = Field(0, ge=0)

    def filter_kwargs(self):
        return self.model_dump(exclude_unset=True, exclude={"offset", "limit"})


class BaseSearchSchema(BaseModel):
    search: Optional[str] = Field(None, description="Поисковый запрос")

    def parse(self, permitted_fields: set[str]) -> Optional[Dict[str, Any]]:
        if not self.search:
            return None

        arr = self.search.split(",")

        data = {}

        for item in arr:
            if "=" not in item:
                continue

            key, value = item.split("=")

            if key in permitted_fields:
                data[key] = value

        return data
