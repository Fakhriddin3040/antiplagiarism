from typing import Dict, Union, Optional
import jwt

from src.app.infrastructure.constants import (
    ACCESS_TOKEN_EXPIRATION_SECONDS,
    JWTTokenKeys,
    JWT_REQUIRED_PAYLOAD,
)
from src.app.infrastructure.db.orm import User
from src.utils.constants.models_fields import UserFields
from src.utils.functions.datetime import get_current_timestamp


class AuthCredentialService:
    def __init__(self, secret: Union[str, bytes], algorithm: str, expires_in: int):
        self.secret = secret
        self.algorithm = algorithm
        self.expires_in = expires_in

    def jwt_for_user(self, user: User) -> str:
        user_payload = self.payload_from_user(user=user)
        total_payload = self.get_payload(**user_payload)

        if not all(f in JWT_REQUIRED_PAYLOAD for f in total_payload) or len(
            total_payload
        ) != len(JWT_REQUIRED_PAYLOAD):
            raise ValueError("Unexpected error on jwt payload generation")

        return self.access_token(total_payload)

    def access_token(self, payload: Dict[str, str]) -> str:
        access_token = jwt.encode(
            payload=payload, key=self.secret, algorithm=self.algorithm
        )
        return access_token

    def is_valid_access_token(self, access_token: str) -> bool:
        try:
            decoded = self.decode(token=access_token)
            return decoded is not None
        except jwt.InvalidTokenError:
            return False

    def decode_access_token(self, access_token: str, **kwargs) -> Dict[str, str]:
        decoded = self.decode(token=access_token, **kwargs)
        return decoded

    def decode(self, token: Union[str, bytes], **kwargs) -> Optional[Dict[str, str]]:
        try:
            return jwt.decode(
                jwt=token, key=self.secret, algorithms=self.algorithm, **kwargs
            )
        except jwt.InvalidTokenError:
            return None

    def payload_from_user(self, user: User) -> Dict[str, str]:
        return {UserFields.as_outref(): getattr(user, UserFields.ID)}

    def get_payload(self, **kwargs) -> Dict[str, str]:
        iat = get_current_timestamp()
        exp = iat + ACCESS_TOKEN_EXPIRATION_SECONDS
        kwargs.update(
            {
                JWTTokenKeys.IAT: iat,
                JWTTokenKeys.EXP: exp,
            }
        )
        return kwargs
