from sqlalchemy import select

from src.app.infrastructure.db.orm.models import File
from src.base.abs.repository import AbstractAsyncSQLAlchemyRepository
from src.base.types.pytypes import ID_T


class FileRepository(AbstractAsyncSQLAlchemyRepository):
    async def get_by_id_and_owner(self, file_id: ID_T, owner_id: ID_T) -> File:
        result = await self.db.execute(
            select(
                self.model.id == file_id,
                self.model.owner_id == owner_id,
            )
        )
        return result.scalar_one()
