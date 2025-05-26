from typing import Optional, Sequence

from sqlalchemy import select, Select
from sqlalchemy.orm import selectinload

from src.app.infrastructure.db.orm.models.documents import Folder
from src.base.abs.repository import AbstractAsyncSQLAlchemyRepository
from src.base.types.pytypes import ID_T


class FolderRepository(AbstractAsyncSQLAlchemyRepository):
    async def get_by_id_and_owner(
        self, folder_id: ID_T, created_by_id: ID_T
    ) -> Optional[Folder]:
        stmt = select(self.model).where(
            self.model.id == folder_id,
            self.model.created_by_id == created_by_id,  # noqa
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_with_children(self, **kwargs) -> Optional[Folder]:
        stmt = self.parse_to_statement(**kwargs)
        stmt = stmt.options(selectinload(self.model.children))
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_roots(self, **kwargs) -> Sequence[Folder]:
        stmt = self.parse_to_statement(**kwargs)
        stmt = self._add_roots_options(stmt)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    def _add_roots_options(self, statement: Select) -> Select:
        return statement.where(self.model.parent_id.is_(None)).options(
            selectinload(self.model.children)
        )
