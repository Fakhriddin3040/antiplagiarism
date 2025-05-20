from typing import List, Annotated

from fastapi import APIRouter, Depends, Form, UploadFile, File, Query
from starlette import status
from starlette.responses import StreamingResponse

from src.app.infrastructure.auth.deps.auth import get_current_user
from src.app.infrastructure.constants import FILE_SEARCH_PERMITTED_FIELDS
from src.app.infrastructure.deps.repositories import get_file_repository
from src.app.infrastructure.deps.services.file import (
    get_file_create_service,
    get_file_upload_service,
)
from src.app.infrastructure.schemas.document.file_schemas import (
    FileCreateSchema,
    FileListSchema,
    FileFilterSearchSchema,
)
from src.app.infrastructure.services.file.file_create_service import FileCreateService
from src.app.infrastructure.services.file.file_stream_service import FileStreamService
from src.base.types.pytypes import ID_T

router = APIRouter()


@router.post("/", responses=None, status_code=status.HTTP_201_CREATED)
async def create_file(
    title: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    service: FileCreateService = Depends(get_file_create_service),
) -> None:
    params = FileCreateSchema(
        title=title,
        description=description,
        file=file,
    )
    await service.create(user=user, schema=params)


@router.get(
    "/",
    response_model=List[FileListSchema],
    status_code=status.HTTP_200_OK,
)
async def get(
    params: Annotated[FileFilterSearchSchema, Query()],
    user=Depends(get_current_user),
    file_repo=Depends(get_file_repository),
) -> List[FileListSchema]:
    search_params = params.parse_search(FILE_SEARCH_PERMITTED_FIELDS)
    filter_params = params.parse_filters()
    files = await file_repo.filter(
        **filter_params, search=search_params, created_by_id=user.id
    )
    return files


@router.get("/{file_id}/download", status_code=status.HTTP_200_OK)
async def download_file(
    file_id: ID_T,
    stream_service: FileStreamService = Depends(get_file_upload_service),
    user=Depends(get_current_user),
):
    stream, file = await stream_service.get_file(file_id=file_id, created_by_id=user.id)
    headers = {
        "Content-Disposition": f"attachment; filename={file.title}.{file.extension}"
    }
    return StreamingResponse(content=stream, media_type=file.mimetype, headers=headers)
