from src.app.infrastructure.db.orm import User
from src.base.abs.repository import AbstractAsyncSQLAlchemyRepository
from src.utils.constants.models_fields import UserField


class UserRepository(AbstractAsyncSQLAlchemyRepository):
    async def get_by_email(self, email: str) -> User:
        result = await self._get_by_field(field=UserField.EMAIL, value=email)
        return result
