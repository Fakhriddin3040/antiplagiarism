import logging

from starlette import status

from src.app.infrastructure.db.orm import Document
from src.app.infrastructure.parsers.file_content_parser import FileContentParser
from src.app.infrastructure.services.document.document_chunks_create_service import (
    DocumentChunksCreateService,
)
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionStatusCodes,
    ApiExceptionMessage,
)
from src.utils.exceptions.api_exception import ApiException

logger = logging.getLogger(__name__)


class DocumentIndexService:
    def __init__(
        self,
        content_parser: FileContentParser,
        chunks_create_service: DocumentChunksCreateService,
    ):
        self.content_parser = content_parser
        self.chunks_create_service = chunks_create_service

    async def index(self, document: Document) -> None:
        path = document.file.path
        logger.info("Indexing file %s", path)

        file_content = self.content_parser.parse_content(
            extension=document.file.extension, path=path
        )
        if not file_content or len(file_content.strip()) < 100:
            msg = "File should have at least 100 words" % path
            logger.critical(msg)
            raise ApiException(
                status_code=status.HTTP_400_BAD_REQUEST,
                exception_status=ApiExceptionStatusCodes.TOO_SHORT_CONTENT,
                message=ApiExceptionMessage.TOO_SHORT_CONTENT,
            )

        await self.chunks_create_service.create(
            content=file_content, document_id=document.id
        )
