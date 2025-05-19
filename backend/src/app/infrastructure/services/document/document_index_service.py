from src.app.infrastructure.db.orm import Document
from src.app.infrastructure.db.repositories.documents.document import DocumentRepository
from src.app.infrastructure.db.repositories.documents.document_chunk import (
    DocumentChunkRepository,
)


class DocumentIndexService:
    def __init__(
        self,
        document_repo: DocumentRepository,
        document_chunk_repo: DocumentChunkRepository,
    ):
        self.document_repo = document_repo
        self.document_chunk_repo = document_chunk_repo

    def index(self, document: Document, content: str) -> None:
        pass
