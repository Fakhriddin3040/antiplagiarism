import logging
from typing import Callable

from sqlalchemy.exc import IntegrityError

from src.app.infrastructure.db.orm.models.documents import Folder
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionStatusCodes,
    ApiExceptionMessage,
)
from src.utils.constants.models_fields import FolderFields
from src.utils.exceptions.api_exception import ApiExceptionDetail, ApiException


logger = logging.getLogger(__name__)


async def edit_folder_async(callback: Callable, *args, **kwargs) -> Folder:
    try:
        logger.info(f"Calling callback {callback} with data {args}, {kwargs}")
        return await callback(*args, **kwargs)
    except IntegrityError:
        logger.error("Folder with given name and parent already exists")
        detail = ApiExceptionDetail(
            status=ApiExceptionStatusCodes.UNIQUE_CONSTRAINT,
            fields=(FolderFields.TITLE, FolderFields.PARENT_ID),
        )
        raise ApiException(
            message=ApiExceptionMessage.UNIQUE_CONSTRAINT,
            details=detail,
            exception_status=ApiExceptionStatusCodes.UNIQUE_CONSTRAINT,
        )
