from typing import Optional, Dict, Any, Sequence, Tuple

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from src.app.infrastructure.db.orm import Document
from src.base.abs.repository import AbstractAsyncSQLAlchemyRepository


class DocumentRepository(AbstractAsyncSQLAlchemyRepository):
    async def filter(
        self,
        limit: Optional[int] = 10,
        offset: int = 0,
        search: Optional[Dict[str, Any]] = None,
        need_count: Optional[bool] = False,
        **filters,
    ) -> Sequence[Document] | Tuple[Sequence[Document], int]:
        if not filters and not search:
            _select = (
                select(self.model)
                .options(selectinload(self.model.file))
                .offset(offset)
                .limit(limit)
            )
        else:
            _select = self.parse_to_statement(search=search, **filters)
            _select = (
                _select.options(selectinload(self.model.file))
                .limit(limit)
                .offset(offset)
            )

        result = (await self.db.execute(_select)).scalars().all()

        if not need_count:
            return result

        res_len = len(result)

        if res_len == limit:
            return result, await self._get_count(smt=_select)
        elif res_len > 0:
            return result, offset + res_len

        return result, 0
