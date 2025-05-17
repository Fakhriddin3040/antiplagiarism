from starlette import status
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from src.app.application.services.auth.password import PasswordService
from src.app.application.services.auth.user_login_service import UserLoginService
from src.app.application.services.auth.user_register_service import UserRegisterService
from src.app.infrastructure.auth.services.jwt_provider import JwtProvider
from src.app.infrastructure.db.orm import User
from src.app.infrastructure.db.repositories.users.user import UserRepository
from src.app.infrastructure.deps.repositories import get_user_repository
from src.app.infrastructure.auth.deps.token import get_jwt_provider
from src.app.infrastructure.schemas.jwt_bearer import jwt_token_schema
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionMessage,
    ApiExceptionStatusCodes,
)
from src.utils.exceptions.api_exception import ApiException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_user_register_service(
    user_repository=Depends(get_user_repository),
    password_service=Depends(PasswordService),
    token_provider=Depends(get_jwt_provider),
) -> UserRegisterService:
    return UserRegisterService(
        user_repository=user_repository,
        password_service=password_service,
        token_provider=token_provider,
    )


def get_user_login_service(
    token_provider=Depends(get_jwt_provider),
    password_service=Depends(PasswordService),
    user_repo=Depends(get_user_repository),
) -> UserLoginService:
    return UserLoginService(
        user_repository=user_repo,
        password_service=password_service,
        token_provider=token_provider,
    )


async def get_current_user(
    token: str = Depends(jwt_token_schema),
    user_repository: UserRepository = Depends(get_user_repository),
    token_provider: JwtProvider = Depends(get_jwt_provider),
) -> User:
    def raise_exception(
        message: ApiExceptionMessage, exception_status: ApiExceptionStatusCodes
    ):
        raise ApiException(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            exception_status=exception_status,
        )

    if not token:
        raise_exception(
            ApiExceptionMessage.ACCESS_TOKEN_REQUIRED,
            ApiExceptionStatusCodes.ACCESS_TOKEN_REQUIRED,
        )

    token_payload = token_provider.decode_payload(token=token)

    if not token_payload:
        raise_exception(
            ApiExceptionMessage.INVALID_TOKEN_PROVIDED,
            ApiExceptionStatusCodes.INVALID_ACCESS_TOKEN,
        )

    user = await user_repository.get_by_id(id_=token_payload.user_id)

    if not user:
        raise_exception(
            ApiExceptionMessage.INVALID_LOGIN_CREDENTIALS,
            ApiExceptionStatusCodes.INVALID_LOGIN_CREDENTIALS,
        )

    return user
