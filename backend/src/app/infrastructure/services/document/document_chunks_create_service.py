from src.app.infrastructure.db.repositories.documents.document_chunk import (
    DocumentChunkRepository,
)
from src.app.infrastructure.services.document.text_chunker import TextChunker
from src.base.types.pytypes import ID_T


class DocumentChunksCreateService:
    def __init__(
        self,
        doc_chunk_repo: DocumentChunkRepository,
        chunker: TextChunker,
    ):
        self.doc_chunk_repository = doc_chunk_repo
        self.chunker = chunker

    async def create(self, content: str, document_id: ID_T) -> None:
        chunks = self.chunker.process(raw_text=content, document_id=document_id)
        await self.doc_chunk_repository.batch_create(objs_in=chunks)
