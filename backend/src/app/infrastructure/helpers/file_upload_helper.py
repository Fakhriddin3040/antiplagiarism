import logging
from pathlib import Path
from typing import BinaryIO
from uuid import uuid4

from starlette import status

from src.app.infrastructure.constants import MAX_FILE_SIZE
from src.config.settings.base import PROJECT_ROOT
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionMessage,
    ApiExceptionStatusCodes,
)
from src.utils.exceptions.api_exception import ApiException


logger = logging.getLogger(__name__)


class FileHelper:
    def __init__(self, root: Path, file_max_size: int = MAX_FILE_SIZE):
        self.root = root
        self.max_size = file_max_size

    def validate_file_len(self, content: bytes):
        content_size = len(content)
        logger.info(f"Content size: {content_size}")

        if content_size > self.max_size:
            logger.error(f"File is too big. Actual size is: {content_size} bytes")
            raise ApiException(
                message=ApiExceptionMessage.FILE_SIZE_LIMIT_EXCEEDED,
                status_code=status.HTTP_409_CONFLICT,
                exception_status=ApiExceptionStatusCodes.FILE_SIZE_LIMIT_EXCEEDED,
            )

    def upload(self, io: BinaryIO) -> Path:
        name = uuid4().hex

        io.seek(0)
        content = io.read()

        full_path = self.write(content=content, name=name, path=self.root)

        return full_path.relative_to(PROJECT_ROOT)

    def write(self, content: bytes, name: str, path: str | Path) -> Path:
        logger.info(f"Writing file. Name: {name}, path: {path}")

        path = Path(path)
        path.mkdir(parents=True, exist_ok=True)

        full_path = path.joinpath(name)
        logger.info(f"Writing file. Full path: {full_path}")

        with full_path.open("wb") as file:
            file.write(content)

        logger.info(f"File written successfully. Full path: {full_path}")
        return full_path

    def check(self, path: str | Path) -> bool:
        return Path(path).exists()
