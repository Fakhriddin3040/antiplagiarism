from src.app.infrastructure.auth.services.jwt_provider import JwtProvider
from src.app.infrastructure.constants import (
    JWT_HASH_ALG,
    ACCESS_TOKEN_EXPIRATION_SECONDS,
)
from src.config.settings.base import APP_SECRET


def get_jwt_provider() -> JwtProvider:
    return JwtProvider(
        secret=APP_SECRET,
        algorithm=JWT_HASH_ALG,
        expires_in=ACCESS_TOKEN_EXPIRATION_SECONDS,
    )
