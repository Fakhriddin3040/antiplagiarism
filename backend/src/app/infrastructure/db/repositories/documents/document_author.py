from typing import Union

from sqlalchemy import select

from src.app.infrastructure.db.orm.models import DocumentAuthor
from src.base.abs.repository import AbstractAsyncSQLAlchemyRepository
from src.base.types.pytypes import ID_T


class DocumentAuthorRepository(AbstractAsyncSQLAlchemyRepository):
    async def get_by_id_and_owner(
        self, author_id: ID_T, owner_id: ID_T
    ) -> Union[DocumentAuthor, None]:
        stmt = select(self.model).where(
            self.model.id == author_id, self.model.created_by_id == owner_id  # noqa
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
