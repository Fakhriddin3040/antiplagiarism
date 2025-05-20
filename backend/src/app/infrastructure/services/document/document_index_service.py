import logging

from starlette import status

from src.app.core.services import TextIndexer
from src.app.infrastructure.db.orm import Document
from src.app.infrastructure.db.repositories.documents.document import DocumentRepository
from src.app.infrastructure.db.repositories.documents.document_chunk import (
    DocumentChunkRepository,
)
from src.app.infrastructure.parsers.file_content_parser import FileContentParser
from src.utils.constants.exceptions.error_codes import (
    ApiExceptionStatusCodes,
    ApiExceptionMessage,
)
from src.utils.constants.models_fields import DocumentChunkField
from src.utils.exceptions.api_exception import ApiException

logger = logging.getLogger(__name__)


class DocumentIndexService:
    def __init__(
        self,
        document_repo: DocumentRepository,
        document_chunk_repo: DocumentChunkRepository,
        content_parser: FileContentParser,
        text_indexer_service: TextIndexer,
    ):
        self.document_repo = document_repo
        self.document_chunk_repo = document_chunk_repo
        self.text_indexer_service = text_indexer_service
        self.content_parser = content_parser

    async def index(self, document: Document) -> None:
        path = document.file.path
        logger.info("Indexing file %s", path)

        file_content = self.content_parser.parse_content(
            extension=document.file.extension, path=path
        )
        if not file_content or len(file_content) < 100:
            msg = "File %s is empty maan, wtf?!" % path
            logger.critical(msg)
            raise ApiException(
                status_code=status.HTTP_400_BAD_REQUEST,
                exception_status=ApiExceptionStatusCodes.TOO_SHORT_CONTENT,
                message=ApiExceptionMessage.TOO_SHORT_CONTENT,
            )

        vector = self.text_indexer_service.index_vector(text=file_content)
        to_create = {
            DocumentChunkField.DOCUMENT_ID: document.id,
            DocumentChunkField.VECTOR: vector,
        }
        await self.document_chunk_repo.create(obj_in=to_create)
