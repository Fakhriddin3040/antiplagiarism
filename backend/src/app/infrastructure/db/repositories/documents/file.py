from sqlalchemy import select

from src.app.infrastructure.db.orm.models import File
from src.base.abs.repository import AbstractAsyncSQLAlchemyRepository
from src.base.types.pytypes import ID_T


class FileRepository(AbstractAsyncSQLAlchemyRepository):
    async def get_by_id_and_owner(self, file_id: ID_T, created_by_id: ID_T) -> File:
        stmt = select(self.model).where(
            self.model.id == file_id,  # noqa
            self.model.created_by_id == created_by_id,  # noqa
        )
        result = await self.db.execute(stmt)
        return result.scalars().first()
