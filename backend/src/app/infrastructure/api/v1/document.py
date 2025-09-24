import logging
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from starlette import status

from src.app.infrastructure.api.dto.api_list_response import ApiListResponse
from src.app.infrastructure.auth.deps.auth import get_current_user
from src.app.infrastructure.constants import DOCUMENT_SEARCH_PERMITTED_FIELDS
from src.app.infrastructure.db.orm import User, Document
from src.app.infrastructure.db.repositories.documents.document import DocumentRepository
from src.app.infrastructure.deps.repositories import get_document_repository
from src.app.infrastructure.deps.services.document import get_document_create_service
from src.app.infrastructure.schemas.document.document_schemas import (
    DocumentCreateSchema,
    DocumentListSchema,
    DocumentFilterSearchParamsSchema,
)
from src.app.infrastructure.services.document.document_create_service import (
    DocumentCreateService,
)
from src.base.types.pytypes import ID_T
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionStatusCodes,
    ApiExceptionMessage,
)
from src.utils.constants.models_fields import DocumentField
from src.utils.exceptions.api_exception import ApiException

router = APIRouter()


logger = logging.getLogger(__name__)


@router.post(
    "/", response_model=DocumentListSchema, status_code=status.HTTP_201_CREATED
)
async def create(
    user: User = Depends(get_current_user),
    schema: DocumentCreateSchema = Depends(DocumentCreateSchema.as_form),
    create_service: DocumentCreateService = Depends(get_document_create_service),
) -> Document:
    doc = await create_service.create(user=user, schema=schema)
    return doc


@router.get(
    "", response_model=ApiListResponse[DocumentListSchema], status_code=status.HTTP_200_OK
)
async def list_(
    params: Annotated[DocumentFilterSearchParamsSchema, Query()],
    document_repo: DocumentRepository = Depends(get_document_repository),
    user: User = Depends(get_current_user),
) -> ApiListResponse[DocumentListSchema]:
    search = params.parse_search(permitted_fields=DOCUMENT_SEARCH_PERMITTED_FIELDS)
    filters = params.parse_filters()

    logger.debug("Search params: %s, filter params: %s", search, filters)

    filters[DocumentField.CREATED_BY.as_foreign_key] = user.id

    docs, count = await document_repo.filter(search=search, need_count=True, **filters)
    return ApiListResponse[DocumentListSchema](
        count=count,
        rows=docs,
    )


@router.delete("/{doc_id}/", response_model=None, status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    doc_id: ID_T,
    user: User = Depends(get_current_user),
    document_repo: DocumentRepository = Depends(get_document_repository),
) -> None:
    if not await document_repo.filter_exists(id=doc_id, created_by_id=user.id):
        logger.info("Document %s not found for user %s", doc_id, user.id)
        raise ApiException(
            status_code=status.HTTP_404_NOT_FOUND,
            exception_status=ApiExceptionStatusCodes.OBJECT_NOT_FOUND,
            message=ApiExceptionMessage.NOT_FOUND,
        )
    result = await document_repo.remove(doc_id)

    if result != 1:
        logger.critical(
            "Document % was found for user % but there is unexpected result of deleting. The result: %s",
            doc_id,
            user.id,
            result,
        )
        raise ApiException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            exception_status=ApiExceptionStatusCodes.UNKNOWN_ERROR,
            message=ApiExceptionMessage.UNKNOWN_ERROR,
        )
