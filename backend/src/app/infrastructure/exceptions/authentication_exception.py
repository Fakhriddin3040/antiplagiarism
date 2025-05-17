from http.client import HTTPException

from starlette import status


class AuthenticationError(HTTPException):
    status_code = status.HTTP_401_UNAUTHORIZED
