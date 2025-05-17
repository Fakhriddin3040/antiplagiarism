from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import JSONResponse

from src.utils.exceptions.api_exception import ApiException


class ApiHttpExceptionHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint):
        try:
            response = await call_next(request)
            return response
        except ApiException as e:
            response = JSONResponse(
                content=e.as_dict(),
                status_code=e.status_code,
            )
            return response
