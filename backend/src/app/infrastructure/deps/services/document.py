from fastapi import Depends

from src.app.core.services import TextIndexer
from src.app.core.services.text.noice_cleaner import TextNoiseCleaner
from src.app.infrastructure.db.repositories.documents.document import DocumentRepository
from src.app.infrastructure.db.repositories.documents.document_author import (
    DocumentAuthorRepository,
)
from src.app.infrastructure.db.repositories.documents.document_chunk import (
    DocumentChunkRepository,
)
from src.app.infrastructure.db.repositories.documents.file import FileRepository
from src.app.infrastructure.db.repositories.documents.folder import FolderRepository
from src.app.infrastructure.deps.parsers import get_file_content_parser
from src.app.infrastructure.deps.repositories import (
    get_document_repository,
    get_document_chunk_repository,
    get_file_repository,
    get_author_repository,
    get_folder_repository,
)
from src.app.infrastructure.deps.services.file import get_file_create_service
from src.app.infrastructure.deps.services.text_services import get_text_indexer
from src.app.infrastructure.parsers.file_content_parser import FileContentParser
from src.app.infrastructure.services.document.document_chunks_create_service import (
    DocumentChunksCreateService,
)
from src.app.infrastructure.services.document.document_create_service import (
    DocumentCreateService,
)
from src.app.infrastructure.services.document.document_index_service import (
    DocumentIndexService,
)
from src.app.infrastructure.services.document.text_chunker import TextChunker
from src.app.infrastructure.services.file.file_create_service import FileCreateService


def get_text_noise_cleaner() -> TextNoiseCleaner:
    return TextNoiseCleaner()


def get_text_chunker(
    indexer: TextIndexer = Depends(get_text_indexer),
    noice_cleaner: TextNoiseCleaner = Depends(get_text_noise_cleaner),
) -> TextChunker:
    return TextChunker(
        cleaner=noice_cleaner,
        indexer=indexer,
    )


def get_document_chunks_create_service(
    document_chunk_repo: DocumentChunkRepository = Depends(
        get_document_chunk_repository
    ),
    chunker: TextChunker = Depends(get_text_chunker),
) -> DocumentChunksCreateService:
    return DocumentChunksCreateService(
        chunker=chunker,
        doc_chunk_repo=document_chunk_repo,
    )


def get_document_index_service(
    content_parser: FileContentParser = Depends(get_file_content_parser),
    document_chunks_create_service: DocumentChunksCreateService = Depends(
        get_document_chunks_create_service
    ),
) -> DocumentIndexService:
    return DocumentIndexService(
        content_parser=content_parser,
        chunks_create_service=document_chunks_create_service,
    )


def get_document_create_service(
    indexer: DocumentIndexService = Depends(get_document_index_service),
    file_create_service: FileCreateService = Depends(get_file_create_service),
    document_repo: DocumentRepository = Depends(get_document_repository),
    file_repo: FileRepository = Depends(get_file_repository),
    folder_repo: FolderRepository = Depends(get_folder_repository),
    author_repo: DocumentAuthorRepository = Depends(get_author_repository),
) -> DocumentCreateService:
    return DocumentCreateService(
        document_repo=document_repo,
        file_repo=file_repo,
        folder_repo=folder_repo,
        author_repo=author_repo,
        document_index_service=indexer,
        file_create_service=file_create_service,
    )
