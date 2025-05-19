import logging
from typing import Sequence

from fastapi import APIRouter, Depends, Body
from starlette import status

from src.app.infrastructure.auth.deps.auth import get_current_user
from src.app.infrastructure.constants import FOLDER_SEARCH_PERMITTED_FIELDS
from src.app.infrastructure.db.orm import User
from src.app.infrastructure.db.orm.models.documents import Folder
from src.app.infrastructure.db.repositories.documents.folder import FolderRepository
from src.app.infrastructure.deps.repositories import get_folder_repository
from src.app.infrastructure.deps.services.folder import (
    get_folder_create_service,
    get_folder_update_service,
)
from src.app.infrastructure.schemas.document.folder_schemas import (
    FolderListSchema,
    FolderCreateSchema,
    FolderFilterSearchSchema,
    FolderUpdateSchema,
)
from src.app.infrastructure.services.folder.folder_create_service import (
    FolderCreateService,
)
from src.app.infrastructure.services.folder.folder_update_service import (
    FolderUpdateService,
)
from src.base.types.pytypes import ID_T
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionStatusCodes,
    ApiExceptionMessage,
)
from src.utils.exceptions.api_exception import ApiException

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", response_model=FolderListSchema, status_code=status.HTTP_201_CREATED)
async def create(
    schema: FolderCreateSchema = Body(),
    service: FolderCreateService = Depends(get_folder_create_service),
    user: User = Depends(get_current_user),
) -> Folder:
    return await service.create(schema=schema, user=user)


@router.get(
    "/", response_model=Sequence[FolderListSchema], status_code=status.HTTP_200_OK
)
async def list_(
    params: FolderFilterSearchSchema = Depends(FolderFilterSearchSchema),
    folder_repo: FolderRepository = Depends(get_folder_repository),
    user: User = Depends(get_current_user),
) -> Sequence[Folder]:
    search = params.parse_search(permitted_fields=FOLDER_SEARCH_PERMITTED_FIELDS)
    filters = params.parse_filters()

    logger.debug(f"search={search}, filters={filters}")

    folders = await folder_repo.filter(
        search=search,
        created_by_id=user.id,
        **filters,
    )
    return folders


@router.patch(
    "/{folder_id}", response_model=FolderListSchema, status_code=status.HTTP_200_OK
)
async def update(
    folder_id: ID_T,
    schema: FolderUpdateSchema = Body(),
    service: FolderUpdateService = Depends(get_folder_update_service),
    user: User = Depends(get_current_user),
) -> Folder:
    return await service.update(folder_id=folder_id, user=user, schema=schema)


@router.delete(
    "/{folder_id}", response_model=None, status_code=status.HTTP_204_NO_CONTENT
)
async def delete(
    folder_id: ID_T,
    folder_repo: FolderRepository = Depends(get_folder_repository),
    user: User = Depends(get_current_user),
) -> None:
    if not await folder_repo.filter_exists(created_by_id=user.id, id=folder_id):
        logger.info(f"Folder {folder_id} not found for user {user.id}")
        raise ApiException(
            status_code=status.HTTP_404_NOT_FOUND,
            exception_status=ApiExceptionStatusCodes.OBJECT_NOT_FOUND,
            message=ApiExceptionMessage.NOT_FOUND,
        )
    result = await folder_repo.remove(_id=folder_id)

    if result != 1:
        logger.critical(
            f"Folder {folder_id} was wound on database with correct owner, but could not be removed!"
        )
        raise ApiException(
            message=ApiExceptionMessage.UNKNOWN_ERROR,
            exception_status=ApiExceptionStatusCodes.UNKNOWN_ERROR,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    logger.info(f"Folder {folder_id} was removed from database")
