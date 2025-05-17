import re

from src.app.application.constants import PASSWORD_REGEX
from src.app.application.schemas.auth.registration_schemas import UserRegisterSchema
from src.app.application.schemas.auth.token_schema import TokenSchema
from src.app.infrastructure.auth.services.jwt_provider import JwtProvider
from src.app.application.services.auth.password import PasswordService
from src.app.infrastructure.db.orm.enums.models import DatabaseModels
from src.app.infrastructure.db.repositories.users.user import UserRepository
from src.utils.constants.exceptions.common import VALIDATION_ERR_MESSAGE
from src.utils.constants.exceptions.error_codes import ApiExceptionStatusCodes
from src.utils.constants.models_fields import UserFields
from src.utils.exceptions.api_exception import ApiException, ApiExceptionDetail


class UserRegisterService:
    def __init__(
        self,
        user_repository: UserRepository,
        token_provider: JwtProvider,
        password_service: PasswordService,
    ):
        self.user_repo = user_repository
        self.token_provider = token_provider
        self.password_service = password_service

    async def register(self, data: UserRegisterSchema) -> TokenSchema:
        await self.validate(data=data)
        hashed_password = self.password_service.hash_password(data.password)
        data.password = hashed_password.decode("utf-8")
        user = await self.user_repo.create(data.model_dump())

        token = self.token_provider.for_user(user=user)
        return token

    def _validate_password(self, password: str) -> bool:
        return bool(re.match(PASSWORD_REGEX, password))

    async def validate(self, data: UserRegisterSchema) -> None:
        errors = []
        if not self._validate_password(data.password):
            errors.append(
                ApiExceptionDetail(
                    status=ApiExceptionStatusCodes.INVALID_PASSWORD,
                )
            )
        if await self.user_repo.exists(DatabaseModels.USERS.email == data.email):
            errors.append(
                ApiExceptionDetail(
                    status=ApiExceptionStatusCodes.UNIQUE_CONSTRAINT,
                    field=UserFields.EMAIL,
                )
            )
        if await self.user_repo.exists(DatabaseModels.USERS.username == data.username):
            errors.append(
                ApiExceptionDetail(
                    status=ApiExceptionStatusCodes.UNIQUE_CONSTRAINT,
                    field=UserFields.USERNAME,
                )
            )
        if errors:
            raise ApiException(message=VALIDATION_ERR_MESSAGE, details=errors)
