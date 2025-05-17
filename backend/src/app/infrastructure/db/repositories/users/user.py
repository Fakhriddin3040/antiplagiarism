from src.app.infrastructure.db.orm import User
from src.base.abs.repository import AbstractAsyncSQLAlchemyRepository
from src.utils.constants.models_fields import UserFields


class UserRepository(AbstractAsyncSQLAlchemyRepository):
    async def get_by_email(self, email: str) -> User:
        result = await self._get_by_field(field=UserFields.EMAIL, value=email)
        return result
