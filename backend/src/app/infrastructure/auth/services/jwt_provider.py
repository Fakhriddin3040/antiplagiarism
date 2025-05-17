from typing import Dict, Optional
import jwt

from src.app.application.schemas.auth.token_schema import TokenSchema
from src.app.infrastructure.constants import (
    JwtKeys,
    JWT_REQUIRED_PAYLOAD,
)
from src.app.infrastructure.db.orm import User
from src.app.infrastructure.schemes.auth.jwt_schemes import JwtPayloadSchema
from src.base.types.pytypes import PasswordType
from src.utils.constants.models_fields import UserFields
from src.utils.functions.datetime import get_current_timestamp


class JwtProvider:
    def __init__(self, secret: PasswordType, algorithm: str, expires_in: int):
        self.secret = secret
        self.algorithm = algorithm
        self.expires_in = expires_in

    def for_user(self, user: User) -> TokenSchema:
        user_payload = self.payload_from_user(user=user)
        total_payload = self.get_payload(**user_payload)

        if set(total_payload.model_fields.keys()) != JWT_REQUIRED_PAYLOAD:
            raise ValueError("Unexpected error on jwt payload generation")

        access = self.access_token(total_payload)
        return access

    def access_token(self, payload: JwtPayloadSchema) -> TokenSchema:
        access_token = jwt.encode(
            payload=payload.model_dump(mode="json"),
            key=self.secret,
            algorithm=self.algorithm,
        )
        access_token_obj = TokenSchema(access_token=access_token)
        return access_token_obj

    def is_valid_access_token(self, access_token: str) -> bool:
        decoded = self.decode_payload(token=access_token)
        return decoded is not None

    def decode_access_token(
        self, access_token: str, **kwargs
    ) -> Optional[JwtPayloadSchema]:
        decoded = self.decode_payload(token=access_token, **kwargs)
        return decoded

    def decode_payload(
        self, token: PasswordType, **kwargs
    ) -> Optional[JwtPayloadSchema]:
        try:
            decoded = jwt.decode(
                jwt=token, key=self.secret, algorithms=self.algorithm, **kwargs
            )
            return JwtPayloadSchema(**decoded)
        except jwt.InvalidTokenError:
            return None

    def payload_from_user(self, user: User) -> Dict[str, str]:
        return {UserFields.as_outref(): getattr(user, UserFields.ID)}

    def get_payload(self, **kwargs) -> JwtPayloadSchema:
        iat = get_current_timestamp()
        exp = iat + self.expires_in
        kwargs.update(
            {
                JwtKeys.IAT: iat,
                JwtKeys.EXP: exp,
            }
        )
        return JwtPayloadSchema(**kwargs)
