from pathlib import Path
from typing import BinaryIO
from uuid import uuid4

from starlette import status

from src.app.infrastructure.constants import MAX_FILE_SIZE
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionMessage,
    ApiExceptionStatusCodes,
)
from src.utils.exceptions.api_exception import ApiException


class FileHelper:
    def __init__(self, root: Path, file_max_size: int = MAX_FILE_SIZE):
        self.root = root
        self.max_size = file_max_size

    def validate_file_len(self, content: bytes):
        if len(content) > self.max_size:
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

        return full_path.relative_to(self.root)

    def write(self, content: bytes, name: str, path: str | Path) -> Path:
        path = Path(path)
        path.mkdir(parents=True, exist_ok=True)

        full_path = path.joinpath(name)

        with full_path.open("wb") as file:
            file.write(content)

        return full_path

    def check(self, path: str | Path) -> bool:
        return Path(path).exists()
