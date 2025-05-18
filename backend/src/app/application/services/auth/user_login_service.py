from src.app.application.schemas.auth.login_credentials_schema import (
    LoginCredentialsSchema,
)
from src.app.application.schemas.auth.token_schema import TokenSchema
from src.app.application.services.auth.password import PasswordService
from src.app.infrastructure.auth.services.jwt_provider import JwtProvider
from src.app.infrastructure.db.orm import User
from src.app.infrastructure.db.repositories.users.user import UserRepository
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionStatusCodes,
    ApiExceptionMessage,
)
from src.utils.exceptions.api_exception import ApiExceptionDetail, ApiException


class UserLoginService:
    def __init__(
        self,
        user_repository: UserRepository,
        password_service: PasswordService,
        token_provider: JwtProvider,
    ):
        self.user_repo = user_repository
        self.password_service = password_service
        self.token_provider = token_provider
        self.errors = []

    async def login(self, credentials: LoginCredentialsSchema) -> TokenSchema:
        user = await self.user_repo.get_by_email(credentials.email)  # noqa
        self._validate(credentials=credentials, user=user)
        return self.token_provider.for_user(user=user)

    def _validate(self, credentials: LoginCredentialsSchema, user: User):
        if not user:
            self.raise_exception()

        if not self.password_service.verify_password(
            password=credentials.password, hashed_password=user.password
        ):
            self.errors.append(
                ApiExceptionDetail(
                    status=ApiExceptionStatusCodes.INVALID_PASSWORD,
                )
            )

    def raise_exception(self):
        raise ApiException(
            message=ApiExceptionMessage.INVALID_LOGIN_CREDENTIALS,
            exception_status=ApiExceptionStatusCodes.INVALID_LOGIN_CREDENTIALS,
        )
