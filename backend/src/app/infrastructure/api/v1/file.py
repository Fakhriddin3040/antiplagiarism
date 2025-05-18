from typing import List, Annotated

from fastapi import APIRouter, Depends, Form, UploadFile, File, Query
from starlette import status

from src.app.infrastructure.auth.deps.auth import get_current_user
from src.app.infrastructure.constants import FILE_SEARCH_PERMITTED_FIELDS
from src.app.infrastructure.deps.repositories import get_file_repository
from src.app.infrastructure.deps.services.file import get_file_create_service
from src.app.infrastructure.schemas.document.file_schemas import (
    FileCreateSchema,
    FileListSchema,
    FileFilterSearchSchema,
)
from src.app.infrastructure.services.file.file_create_service import FileCreateService

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
    await service.create(user=user, params=params)


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
        **filter_params, search=search_params, owner_id=user.id
    )
    return files


@router.get("/{id}/download", status_code=status.HTTP_200_OK)
async def download_file():
    pass
