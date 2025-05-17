from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Request


class JWTBearer(HTTPBearer):
    async def __call__(self, request: Request) -> str:
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        return credentials.credentials


jwt_token_schema = JWTBearer()
