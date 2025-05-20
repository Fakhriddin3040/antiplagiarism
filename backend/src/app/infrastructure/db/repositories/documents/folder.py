from typing import Optional

from sqlalchemy import select

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
