from typing import Optional

from pydantic import BaseModel

from src.base.types.pytypes import ID_T


class JwtPayloadSchema(BaseModel):
    user_id: ID_T
    exp: Optional[int]
    iat: Optional[int]


class JwtAuthResponseSchema(BaseModel):
    access_token: str
