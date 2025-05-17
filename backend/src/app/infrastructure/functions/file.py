import filetype
from fastapi import UploadFile, status

from src.app.infrastructure.constants import ALLOWED_MIME_TYPES, DISALLOWED_EXTENSIONS
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionStatusCodes,
    ApiExceptionMessage,
)
from src.utils.exceptions.api_exception import ApiException


async def validate_file_extension(file: UploadFile) -> str:
    content = await file.read()
    kind = filetype.guess(content)

    if kind is None:
        if is_probably_text(content):
            return "txt"

        raise ApiException(
            message=ApiExceptionMessage.INVALID_FILE_FORMAT,
            exception_status=ApiExceptionStatusCodes.INVALID_FILE_FORMAT,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    ext = kind.extension

    if ext in DISALLOWED_EXTENSIONS:
        raise ApiException(
            message="Нельзя загружать исполняемые файлы, брат.",
            exception_status=ApiExceptionStatusCodes.UNSUPPORTED_FILE_FORMAT,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    if kind.mime not in ALLOWED_MIME_TYPES:
        raise ApiException(
            message=ApiExceptionMessage.UNSUPPORTED_FILE_FORMAT,
            exception_status=ApiExceptionStatusCodes.UNSUPPORTED_FILE_FORMAT,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return ext


def is_probably_text(data: bytes) -> bool:
    try:
        data.decode("utf-8")
        return True
    except UnicodeDecodeError:
        return False
