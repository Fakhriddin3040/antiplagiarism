import logging
import os
from typing import Generator, Tuple
from starlette import status

from src.app.infrastructure.db.orm.models import File
from src.app.infrastructure.db.repositories.documents.file import FileRepository
from src.base.types.pytypes import ID_T
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionMessage,
    ApiExceptionStatusCodes,
)
from src.utils.exceptions.api_exception import ApiException


logger = logging.getLogger(__name__)


class FileStreamService:
    def __init__(self, file_repo: FileRepository):
        self.file_repo = file_repo

    def _stream_file(
        self, file_path: str, chunk_size: int
    ) -> Generator[bytes, None, None]:
        with open(file_path, "rb") as f:
            logger.info(f"Streaming file {file_path}.")
            while chunk := f.read(chunk_size):
                yield chunk

    async def get_file(
        self, file_id: ID_T, owner_id: ID_T, chunk_size: int = 8192
    ) -> Tuple[Generator[bytes, None, None], File]:
        logger.info(f"Getting file {file_id} from database for owner {owner_id}")
        file = await self.file_repo.get_by_id_and_owner(
            file_id=file_id, owner_id=owner_id
        )
        if not file:
            logger.warning(f"File {file_id} not found for user {owner_id}")
            raise ApiException(
                message=ApiExceptionMessage.NOT_FOUND,
                status_code=status.HTTP_404_NOT_FOUND,
                exception_status=ApiExceptionStatusCodes.OBJECT_NOT_FOUND,
            )

        if not os.path.exists(file.path):
            logger.critical(
                f"File {file_id} of user {owner_id} exists in database, but not found in file system."
            )
            raise ApiException(
                message=ApiExceptionMessage.FILE_NOT_FOUND_IN_FS,
                status_code=status.HTTP_404_NOT_FOUND,
                exception_status=ApiExceptionStatusCodes.FILE_NOT_FOUND_IN_FS,
            )

        return self._stream_file(file.path, chunk_size=chunk_size), file
