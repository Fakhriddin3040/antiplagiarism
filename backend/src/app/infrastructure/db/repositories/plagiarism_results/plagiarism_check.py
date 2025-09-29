from sqlalchemy import select
from sqlalchemy.orm import selectinload

from src.app.infrastructure.db.orm import PlagiarismCheck
from src.base.abs.repository import AbstractAsyncSQLAlchemyRepository
from src.base.types.pytypes import ID_T


class PlagiarismCheckRepository(AbstractAsyncSQLAlchemyRepository):
    model: PlagiarismCheck

    async def get_for_doc(self, doc_id: ID_T) -> PlagiarismCheck:
        stmt = (
            select(self.model)
            .options(selectinload(self.model.matches))  # noqa
            .where(self.model.document_id == doc_id)  # noqa
            .order_by(self.model.created_at.desc())  # noqa
            .limit(1)
        )
        return await self.db.scalar(stmt)
