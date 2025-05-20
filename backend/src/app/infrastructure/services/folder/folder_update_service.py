import logging

from starlette import status

from src.app.infrastructure.db.orm import User
from src.app.infrastructure.db.orm.models.documents import Folder
from src.app.infrastructure.db.repositories.documents.folder import FolderRepository
from src.app.infrastructure.helpers.folder_edit_helper import edit_folder_async
from src.app.infrastructure.schemas.document.folder_schemas import FolderUpdateSchema
from src.base.types.pytypes import ID_T
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionMessage,
    ApiExceptionStatusCodes,
)
from src.utils.exceptions.api_exception import ApiException


logger = logging.getLogger(__name__)


class FolderUpdateService:
    def __init__(self, folder_repo: FolderRepository):
        self.folder_repo = folder_repo

    async def update(self, folder_id: ID_T, schema: FolderUpdateSchema, user: User):
        logger.info(f"Updating folder {folder_id}")
        logger.debug(f"Folder schema: {schema}")
        folder = await self.validate_and_get(folder_id=folder_id, user=user)
        data = schema.model_dump(exclude_unset=True)

        updated_folder = await edit_folder_async(
            self.folder_repo.update, db_obj=folder, obj_in=data
        )
        logger.info(f"Folder updated: {updated_folder}")
        return updated_folder

    async def validate_and_get(self, folder_id: ID_T, user: User) -> Folder:
        folder = await self.folder_repo.get_by_id_and_owner(
            folder_id=folder_id, created_by_id=user.id
        )
        if not folder:
            logger.info(f"Folder {folder_id} not found for user {user.id}")
            raise ApiException(
                message=ApiExceptionMessage.NOT_FOUND,
                status_code=status.HTTP_404_NOT_FOUND,
                exception_status=ApiExceptionStatusCodes.OBJECT_NOT_FOUND,
            )
        return folder
