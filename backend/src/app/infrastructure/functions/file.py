import logging
from typing import Tuple

import filetype
from fastapi import UploadFile, status

from src.app.core.enums import DocumentAllowedExtensions
from src.app.infrastructure.constants import DISALLOWED_EXTENSIONS
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionStatusCodes,
    ApiExceptionMessage,
)
from src.utils.exceptions.api_exception import ApiException


logger = logging.getLogger(__name__)


async def validate_file_extension(file: UploadFile) -> Tuple[str, str]:
    logger.info(f"Starting validating file {file.filename}")
    content = await file.read()
    kind = filetype.guess(content)

    if kind is None:
        logger.info("File has no file extension. Setting default 'txt' and returning.")
        if is_probably_text(content):
            return "txt", "text/plain"

        logger.error(
            "File has no file extension and also is not a text. Throwing Api exception."
        )
        raise ApiException(
            message=ApiExceptionMessage.INVALID_FILE_FORMAT,
            exception_status=ApiExceptionStatusCodes.INVALID_FILE_FORMAT,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    ext = kind.extension
    logger.info(f"File has file extension: {ext}")

    if ext in DISALLOWED_EXTENSIONS:
        logger.warning(f"Given file extension is in disallowed format: {ext}")
        raise ApiException(
            message="Нельзя загружать исполняемые файлы, брат.",
            exception_status=ApiExceptionStatusCodes.UNSUPPORTED_FILE_FORMAT,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    if ext not in DocumentAllowedExtensions.__members__.values():
        logger.warning(f"File`s extension not in Document allowed extensions: {kind}")
        raise ApiException(
            message=ApiExceptionMessage.UNSUPPORTED_FILE_FORMAT,
            exception_status=ApiExceptionStatusCodes.UNSUPPORTED_FILE_FORMAT,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    logger.info(f"File format is valid. Returning extension: {ext}")
    return ext, kind.mime


def is_probably_text(data: bytes) -> bool:
    try:
        data.decode("utf-8")
        return True
    except UnicodeDecodeError:
        return False
