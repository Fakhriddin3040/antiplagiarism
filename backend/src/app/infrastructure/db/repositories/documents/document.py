from typing import Optional, Dict, Any, Sequence

from sqlalchemy.orm import selectinload

from src.base.abs.repository import AbstractAsyncSQLAlchemyRepository
from src.base.types.orm.models import TModel


class DocumentRepository(AbstractAsyncSQLAlchemyRepository):
    async def filter(
        self,
        limit: Optional[int] = 10,
        offset: int = 0,
        search: Optional[Dict[str, Any]] = None,
        **filters,
    ) -> Sequence[TModel] | None:
        if not filters:
            return None

        _select = self.parse_to_statement(search=search, **filters)

        _select = (
            _select.limit(limit).offset(offset).options(selectinload(self.model.file))
        )

        result = await self.db.execute(_select)

        return result.scalars().all()
