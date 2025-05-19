from fastapi import FastAPI, APIRouter
from contextlib import asynccontextmanager

from starlette import status

from src.app.infrastructure.api.middlewares.handlers.api_exception_handler import (
    ApiHttpExceptionHandlerMiddleware,
)
from src.app.infrastructure.db.orm.setup import init_tables
from src.app.infrastructure.api import user_router, file_router, document_author_router
from src.utils.constants.exceptions.api import ApiEndpointsTags


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa
    await init_tables()
    print("Here we go...")
    yield


app = FastAPI()


healthcheck_router = APIRouter()


@healthcheck_router.get(path="/", status_code=status.HTTP_200_OK)
async def healthcheck():
    return {"message": "OK"}


app.add_middleware(ApiHttpExceptionHandlerMiddleware)


app.include_router(healthcheck_router, prefix="/healthcheck", tags=["healthcheck"])
app.include_router(user_router, prefix="/auth", tags=[ApiEndpointsTags.AUTH])
app.include_router(file_router, prefix="/files", tags=[ApiEndpointsTags.FILES])
app.include_router(
    document_author_router, prefix="/documents/authors", tags=[ApiEndpointsTags.AUTHORS]
)


if __name__ == "__main__":
    import uvicorn
    import sys

    reload = bool(int(sys.argv[1]))

    uvicorn.run(
        app="entrypoint:app",
        host="0.0.0.0",
        port=8000,
        log_level="debug",
        reload=reload,
    )
