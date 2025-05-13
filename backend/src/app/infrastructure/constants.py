from enum import StrEnum, auto

from src.utils.constants.models_fields import UserFields


class JWTTokenKeys(StrEnum):
    IAT = auto()
    EXP = auto()
    ALG = auto()
    TYP = auto()


JWT_REQUIRED_PAYLOAD = {
    UserFields.as_outref(),
    JWTTokenKeys.IAT,
    JWTTokenKeys.EXP,
}

JWT_HASH_ALG = "RSA256"

ACCESS_TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24  # 60 sec * 60 min = 1 hour; * 24 = 1 day
