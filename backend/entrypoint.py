from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from starlette import status

from src.app.infrastructure.api.middlewares.handlers.api_exception_handler import (
    ApiHttpExceptionHandlerMiddleware,
)
from src.app.infrastructure.db.orm.setup import init_tables
from src.app.infrastructure.api import (
    user_router,
    file_router,
    document_author_router,
    folder_router,
    document_router,
    plagiarism_result_router,
)
from src.utils.constants.exceptions.api import ApiEndpointsTags


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa
    await init_tables()
    print("Here we go...")
    yield


app = FastAPI()


app.add_middleware(ApiHttpExceptionHandlerMiddleware)

router = APIRouter()


@app.get(path="/healthcheck", status_code=status.HTTP_200_OK)
async def healthcheck():
    return {"message": "OK"}


router.include_router(user_router, prefix="/auth", tags=[ApiEndpointsTags.AUTH])
router.include_router(file_router, prefix="/files", tags=[ApiEndpointsTags.FILES])
router.include_router(
    document_author_router, prefix="/documents/authors", tags=[ApiEndpointsTags.AUTHORS]
)
router.include_router(folder_router, prefix="/folders", tags=[ApiEndpointsTags.FOLDERS])
router.include_router(
    document_router, prefix="/documents", tags=[ApiEndpointsTags.DOCUMENTS]
)
router.include_router(
    plagiarism_result_router, prefix="", tags=[ApiEndpointsTags.PLAGIARISM_CHECKS]
)


app.include_router(router, prefix="/api", tags=[ApiEndpointsTags.API])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    import sys

    reload = bool(sys.argv)

    uvicorn.run(
        app="entrypoint:app",
        host="0.0.0.0",
        port=8000,
        log_level="debug",
        reload=reload,
    )
