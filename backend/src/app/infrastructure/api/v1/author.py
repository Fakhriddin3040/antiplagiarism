from typing import Annotated, Sequence

from fastapi import APIRouter, Query, Body
from fastapi.params import Depends
from starlette import status

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


@router.post(
    "/", response_model=DocumentAuthorListSchema, status_code=status.HTTP_201_CREATED
)
async def create(
    data: DocumentAuthorCreateSchema,
    author_repo: DocumentAuthorRepository = Depends(get_author_repository),
    user: User = Depends(get_current_user),
):
    author_data = data.model_dump(exclude_unset=True)
    author_data.update(
        created_by_id=user.id,
        updated_by_id=user.id,
    )
    author = await author_repo.create(author_data)
    return author


@router.get(
    "/",
    response_model=Sequence[DocumentAuthorListSchema],
    status_code=status.HTTP_200_OK,
)
async def list(
    params: Annotated[DocumentAuthorSearchSchema, Query()],
    author_repo: DocumentAuthorRepository = Depends(get_author_repository),
    user: User = Depends(get_current_user),
) -> Sequence:
    search = params.parse_search(
        permitted_fields=DOCUMENT_AUTHOR_SEARCH_PERMITTED_FIELDS
    )
    filters = params.parse_filters()
    authors = await author_repo.filter(**filters, search=search, created_by_id=user.id)
    return authors


@router.patch(
    "/{author_id}",
    response_model=DocumentAuthorListSchema,
    status_code=status.HTTP_200_OK,
)
async def update(
    author_id: ID_T,
    data: DocumentAuthorUpdateSchema = Body(),
    author_repo: DocumentAuthorRepository = Depends(get_author_repository),
    user: User = Depends(get_current_user),
):
    author_data = data.model_dump(exclude_unset=True)
    if not author_data:
        raise ApiException(
            message=ApiExceptionMessage.REQUEST_BODY_IS_EMPTY,
            status_code=status.HTTP_400_BAD_REQUEST,
            exception_status=ApiExceptionStatusCodes.REQUEST_BODY_IS_EMPTY,
        )

    author = await author_repo.get_by_id_and_owner(
        author_id=author_id, owner_id=user.id
    )

    if not author:
        raise ApiException(
            message=ApiExceptionMessage.NOT_FOUND,
            status_code=status.HTTP_404_NOT_FOUND,
            exception_status=ApiExceptionStatusCodes.OBJECT_NOT_FOUND,
        )

    updated_author = await author_repo.update(db_obj=author, obj_in=author_data)

    return updated_author
