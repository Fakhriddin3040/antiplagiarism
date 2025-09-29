import logging

from fastapi import APIRouter, Depends
from starlette import status

from src.app.infrastructure.auth.deps.auth import get_current_user
from src.app.infrastructure.db.orm import User
from src.app.infrastructure.db.repositories.documents.document import DocumentRepository
from src.app.infrastructure.db.repositories.plagiarism_results.plagiarism_check import (
    PlagiarismCheckRepository,
)
from src.app.infrastructure.deps.repositories import (
    get_document_repository,
    get_plagiarism_check_repository,
)
from src.app.infrastructure.deps.services.plagiarism import (
    get_plagiarism_check_create_service,
)
from src.app.infrastructure.schemas.plagiarism_check.plagiarism_check_schmeas import (
    PlagiarismCheckDetailedSchema,
)
from src.app.infrastructure.services.check.plagiarism_check_service import (
    PlagiarismCheckService,
)
from src.base.types.pytypes import ID_T
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionStatusCodes,
    ApiExceptionMessage,
)
from src.utils.exceptions.api_exception import ApiException

logger = logging.getLogger(__name__)


router = APIRouter()


@router.post("/documents/{doc_id}/check/", status_code=status.HTTP_201_CREATED)
async def check(
    doc_id: ID_T,
    user: User = Depends(get_current_user),
    service: PlagiarismCheckService = Depends(get_plagiarism_check_create_service),
    doc_repo: DocumentRepository = Depends(get_document_repository),
):
    logger.info("Initializing plagiarism check for doc %s of user %s", doc_id, user.id)
    if not await doc_repo.filter_exists(created_by_id=user.id, id=doc_id):
        logger.info("Document %s not found for user %s", doc_id, user.id)
        raise ApiException(
            status_code=status.HTTP_404_NOT_FOUND,
            exception_status=ApiExceptionStatusCodes.OBJECT_NOT_FOUND,
            message=ApiExceptionMessage.NOT_FOUND,
        )
    return await service.check(user=user, document_id=doc_id)


@router.get(
    "/documents/{doc_id}/check/",
    status_code=status.HTTP_200_OK,
    response_model=PlagiarismCheckDetailedSchema,
)
async def get_check_detailed(
    doc_id: ID_T,
    user: User = Depends(get_current_user),
    doc_repo: DocumentRepository = Depends(get_document_repository),
    plagiarism_check_repository: PlagiarismCheckRepository = Depends(
        get_plagiarism_check_repository
    ),
) -> PlagiarismCheckDetailedSchema:
    logger.info("Initializing plagiarism check for doc %s for user %s", doc_id, user.id)
    if not await doc_repo.filter_exists(created_by_id=user.id, id=doc_id):
        logger.info("Document %s not found for user %s", doc_id, user.id)
        raise ApiException(
            status_code=status.HTTP_404_NOT_FOUND,
            exception_status=ApiExceptionStatusCodes.OBJECT_NOT_FOUND,
            message=ApiExceptionMessage.NOT_FOUND,
        )
    _check = await plagiarism_check_repository.get_for_doc(doc_id=doc_id)
    if not _check:
        logger.info("Plagiarism check for doc %s not found.")
        raise ApiException(
            status_code=status.HTTP_404_NOT_FOUND,
            exception_status=ApiExceptionStatusCodes.OBJECT_NOT_FOUND,
            message=ApiExceptionMessage.NOT_FOUND,
        )
    else:
        logger.info("Plagiarism check for doc %s found. Id: %s", doc_id, _check.id)
    return PlagiarismCheckDetailedSchema.model_validate(_check)
