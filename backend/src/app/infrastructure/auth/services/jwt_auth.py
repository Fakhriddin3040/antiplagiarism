import logging

from src.app.infrastructure.db.orm import User
from src.app.infrastructure.db.repositories.users.user import UserRepository
from src.app.infrastructure.exceptions.authentication_exception import (
    AuthenticationError,
)
from src.app.infrastructure.schemas import LoginSchema
from src.app.infrastructure.schemas.auth.jwt_schemas import JwtAuthResponseSchema
from src.app.infrastructure.auth.services.jwt_provider import JwtProvider
from src.app.application.services.auth.password import PasswordService
from src.utils.constants.exceptions.error_codes import ApiExceptionStatusCodes

logger = logging.getLogger(__name__)


class JwtAuthService:
    def __init__(
        self,
        password_service: PasswordService,
        credential_provider: JwtProvider,
        user_repository: UserRepository,
    ):
        self.password_service = password_service
        self.credential_provider = credential_provider
        self.user_repository = user_repository

    async def authenticate(self, token: str) -> User:
        payload = self.credential_provider.decode_payload(token=token)

        if not payload:
            raise AuthenticationError(ApiExceptionStatusCodes.INVALID_ACCESS_TOKEN)

        user = await self.user_repository.get_by_id(payload.user_id)

        if not user:
            raise AuthenticationError(ApiExceptionStatusCodes.INVALID_LOGIN_CREDENTIALS)

        return user

    async def login(self, params: LoginSchema) -> JwtAuthResponseSchema:
        user = await self.user_repository.get_by_email(params.email)  # noqa

        if not user:
            raise AuthenticationError(ApiExceptionStatusCodes.INVALID_LOGIN_CREDENTIALS)

        token = self.credential_provider.for_user(user=user)

        return JwtAuthResponseSchema(access_token=token.access_token)
