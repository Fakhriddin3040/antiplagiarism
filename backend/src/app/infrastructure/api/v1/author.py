import logging
from typing import Annotated

from fastapi import APIRouter, Query, Body
from fastapi.params import Depends
from starlette import status

from src.app.infrastructure.api.dto.api_list_response import ApiListResponse
from src.app.infrastructure.auth.deps.auth import get_current_user
from src.app.infrastructure.constants import DOCUMENT_AUTHOR_SEARCH_PERMITTED_FIELDS
from src.app.infrastructure.db.orm import User
from src.app.infrastructure.db.repositories.documents.document_author import (
    DocumentAuthorRepository,
)
from src.app.infrastructure.deps.repositories import get_author_repository
from src.app.infrastructure.schemas.document.author_schemas import (
    DocumentAuthorListSchema,
    DocumentAuthorCreateSchema,
    DocumentAuthorSearchSchema,
    DocumentAuthorUpdateSchema,
)
from src.base.types.pytypes import ID_T
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionStatusCodes,
    ApiExceptionMessage,
)
from src.utils.exceptions.api_exception import ApiException

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post(
    "/", response_model=DocumentAuthorListSchema, status_code=status.HTTP_201_CREATED
)
async def create(
    data: DocumentAuthorCreateSchema,
    author_repo: DocumentAuthorRepository = Depends(get_author_repository),
    user: User = Depends(get_current_user),
):
    logger.info("Creating author %s", data)
    author_data = data.model_dump(exclude_unset=True)
    author_data.update(
        created_by_id=user.id,
    )
    author = await author_repo.create(author_data)
    logger.info(f"Created author {author.id}")
    return author


@router.get(
    "",
    response_model=ApiListResponse[DocumentAuthorListSchema],
    status_code=status.HTTP_200_OK,
)
async def list_(
    params: Annotated[DocumentAuthorSearchSchema, Query()],
    author_repo: DocumentAuthorRepository = Depends(get_author_repository),
    user: User = Depends(get_current_user),
) -> ApiListResponse[DocumentAuthorListSchema]:
    search = params.parse_search(
        permitted_fields=DOCUMENT_AUTHOR_SEARCH_PERMITTED_FIELDS
    )
    filters = params.parse_filters()
    logger.debug("Search params: %s, filters: %s for user %s", search, filters, user.id)
    authors, count = await author_repo.filter(
        **filters,
        search=search,
        created_by_id=user.id,
        need_count=True
    )
    return ApiListResponse[DocumentAuthorListSchema](
        count=count,
        rows=authors
    )


@router.patch(
    "/{author_id}/",
    response_model=DocumentAuthorListSchema,
    status_code=status.HTTP_200_OK,
)
async def update(
    author_id: ID_T,
    data: DocumentAuthorUpdateSchema = Body(),
    author_repo: DocumentAuthorRepository = Depends(get_author_repository),
    user: User = Depends(get_current_user),
):
    logger.info("Updating author %s", author_id)
    author_data = data.model_dump(exclude_unset=True)
    if not author_data:
        logger.debug("Data for author %s is not provided.", author_id)
        raise ApiException(
            message=ApiExceptionMessage.REQUEST_BODY_IS_EMPTY,
            status_code=status.HTTP_400_BAD_REQUEST,
            exception_status=ApiExceptionStatusCodes.REQUEST_BODY_IS_EMPTY,
        )

    logger.info("Getting author %s from db", author_id)
    author = await author_repo.get_by_id_and_owner(
        author_id=author_id, created_by_id=user.id
    )

    if not author:
        logger.warning("Author %s not found", author_id)
        raise ApiException(
            message=ApiExceptionMessage.NOT_FOUND,
            status_code=status.HTTP_404_NOT_FOUND,
            exception_status=ApiExceptionStatusCodes.OBJECT_NOT_FOUND,
        )

    updated_author = await author_repo.update(db_obj=author, obj_in=author_data)

    logger.debug("Updated author %s", updated_author)

    return updated_author


@router.delete(
    "/{author_id}/",
    status_code=status.HTTP_204_NO_CONTENT,
    response_model=None,
)
async def delete(
    author_id: ID_T,
    author_repo: DocumentAuthorRepository = Depends(get_author_repository),
    user: User = Depends(get_current_user),
) -> None:
    logger.info("Deleting author %s", author_id)

    if not await author_repo.filter_exists(id=author_id, created_by_id=user.id):
        logger.warning("Author %s not found for user %s", author_id, user.id)
        raise ApiException(
            message=ApiExceptionMessage.NOT_FOUND,
            status_code=status.HTTP_404_NOT_FOUND,
            exception_status=ApiExceptionStatusCodes.OBJECT_NOT_FOUND,
        )

    result = await author_repo.remove(_id=author_id)
    logger.debug("Delete result: %s", result)

    if result != 1:
        logger.critical(
            "Could not delete author %s from db for user %s, but it was found!",
            author_id,
            user.id,
        )
        raise ApiException(
            message=ApiExceptionMessage.UNKNOWN_ERROR,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            exception_status=ApiExceptionStatusCodes.UNKNOWN_ERROR,
        )
    logger.debug("Deleted author %s for user %s", author_id, user.id)
