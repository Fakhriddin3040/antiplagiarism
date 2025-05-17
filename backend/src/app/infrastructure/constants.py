from enum import StrEnum, auto

from src.utils.constants.models_fields import UserFields


class JwtKeys(StrEnum):
    IAT = auto()
    EXP = auto()
    ALG = auto()
    TYP = auto()


class JwtType(StrEnum):
    ACCESS_TOKEN = auto()
    REFRESH_TOKEN = auto()


JWT_REQUIRED_PAYLOAD = {
    UserFields.as_outref(),
    JwtKeys.IAT,
    JwtKeys.EXP,
}

JWT_HASH_ALG = "HS256"

ACCESS_TOKEN_EXPIRATION_SECONDS = (
    60 * 60 * 24
) * 1000  # 60 sec * 60 min = 1 hour; * 24 = 1 day
