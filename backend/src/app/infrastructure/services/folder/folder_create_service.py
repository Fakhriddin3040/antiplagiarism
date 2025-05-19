import logging
from typing import Mapping, Any

from sqlalchemy.exc import IntegrityError

from src.app.infrastructure.db.orm import User
from src.app.infrastructure.db.orm.models.documents import Folder
from src.app.infrastructure.db.repositories.documents.folder import FolderRepository
from src.app.infrastructure.schemas.document.folder_schemas import FolderCreateSchema
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionStatusCodes,
    ApiExceptionMessage,
)
from src.utils.constants.models_fields import FolderFields
from src.utils.exceptions.api_exception import ApiExceptionDetail, ApiException

logger = logging.getLogger(__name__)


class FolderCreateService:
    def __init__(self, folder_repo: FolderRepository):
        self.folder_repo = folder_repo

    async def create(self, schema: FolderCreateSchema, user: User) -> Folder:
        logger.info(f"Creating folder {schema.title} for user {user.id}")
        data = schema.model_dump(exclude_unset=True)
        data.update(created_by_id=user.id)

        folder = await self._validate_and_create(data=data, user=user)

        logger.info(f"Created folder {schema.title} for user {user.id}")
        return folder

    async def _validate_and_create(self, data: Mapping[str, Any], user: User) -> Folder:
        if parent_id := data.get(FolderFields.PARENT_ID):
            if not await self.folder_repo.filter_exists(
                parent_id=parent_id, created_by_id=user.id
            ):
                exc_detail = ApiExceptionDetail(
                    status=ApiExceptionStatusCodes.OBJECT_NOT_FOUND,
                    field=FolderFields.PARENT_ID,
                )
                raise ApiException(
                    message=ApiExceptionMessage.DETAILED_ERROR,
                    exception_status=ApiExceptionStatusCodes.DETAILED_ERROR,
                    details=exc_detail,
                )
        try:
            return await self.folder_repo.create(obj_in=data)
        except IntegrityError as e:
            logger.error(
                "Folder with given name and parent already exists. Exception: %s, data: %s, user: %s",
                str(e),
                data,
                user.id,
            )
            exc_detail = ApiExceptionDetail(
                status=ApiExceptionStatusCodes.UNIQUE_CONSTRAINT,
                fields=(FolderFields.TITLE, FolderFields.PARENT_ID),
            )
            raise ApiException(
                message=ApiExceptionMessage.DETAILED_ERROR,
                details=exc_detail,
                exception_status=ApiExceptionStatusCodes.DETAILED_ERROR,
            )
